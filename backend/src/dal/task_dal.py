from typing import Dict, List, Tuple, TYPE_CHECKING

from sqlalchemy.orm import Session, joinedload

from src.dal.base import BaseDAL
from src.models.associations import calls_tasks
from src.models.custom_types import TaskStatus
from src.models.tag import Tag
from src.models.task import Task, TaskType
from src.schemas.task import CallTaskRead, TemplateTaskRead
from src.core.exceptions import ItemNotFoundError, InvalidTaskTypeError

if TYPE_CHECKING:
    from src.dal.tag_dal import TagDAL


class TaskDAL(BaseDAL[Task]):
    def __init__(self, db: Session, tag_dal: 'TagDAL'):
        super().__init__(db, Task)
        self._tag_dal = tag_dal

    def list_all_tasks(self) -> List[Task]:
        return self.get_all()
    
    def list_all_template_tasks(self) -> List[TemplateTaskRead]:
        tasks: List[Task] = (
            self.db.query(Task)
            .options(joinedload(Task.tags))
            .filter(Task.type == TaskType.TEMPLATE, Task.is_active.is_(True))
            .all()
        )

        return [TemplateTaskRead.from_model(t) for t in tasks]

    def get_task_by_id(self, task_id: int) -> Task:
        task: Task | None = self.get_by_id(task_id)
        if task is None:
            raise ItemNotFoundError(f'Task with id {task_id} not found')
        return task

    def get_template_task_by_id(self, task_id: int) -> TemplateTaskRead:
        task: Task = self.get_task_by_id(task_id)
        if task.type != TaskType.TEMPLATE:
            raise InvalidTaskTypeError(f'Task with id {task_id} is not a template task')

        return TemplateTaskRead.from_model(task)

    def create_template_task(self, name: str, tag_ids: List[int] | None = None) -> Task:
        task: Task = Task(name=name, type=TaskType.TEMPLATE)
        
        if tag_ids and self._tag_dal:
            all_active_tags = self._tag_dal.get_all_active()
            tags: List[Tag] = [tag for tag in all_active_tags if tag.id in tag_ids]
            task.tags = tags
        
        return self.create(task)

    def create_ad_hoc_task(self, name: str, call_id: int, status: TaskStatus = TaskStatus.OPEN) -> Task:
        task: Task = Task(name=name, type=TaskType.AD_HOC)
        task = self.create(task)
        
        self.db.execute(
            calls_tasks.insert().values(
                task_id=task.id,
                call_id=call_id,
                status=status
            )
        )
        self.db.commit()
        return task

    def update_task(self, task_id: int, name: str | None = None, is_active: bool | None = None) -> Task:
        task: Task = self.get_task_by_id(task_id)

        if name is not None:
            task.name = name
        if is_active is not None:
            task.is_active = is_active

        return self.update(task)

    def update_task_and_status(self, task_id: int, call_id: int, status: TaskStatus, name: str | None = None) -> CallTaskRead:
        self.db.execute(
            calls_tasks.update()
            .where(calls_tasks.c.task_id == task_id, calls_tasks.c.call_id == call_id)
            .values(status=status)
        )
        task: Task = self.update_task(task_id, name=name)
        return CallTaskRead.from_model(task, call_id=call_id, status=status)

    def update_template_task_and_tags(self, task_id: int, name: str | None = None, tag_ids: List[int] | None = None) -> TemplateTaskRead:
        task: Task = self.get_task_by_id(task_id)
        if task.type != TaskType.TEMPLATE:
            raise InvalidTaskTypeError(f'Task with id {task_id} is not a template task')

        if tag_ids is not None and self._tag_dal:
            all_active_tags = self._tag_dal.get_all_active()
            tags: List[Tag] = [tag for tag in all_active_tags if tag.id in tag_ids]
            task.tags = tags
            self.commit_and_refresh(task)

        task = self.update_task(task_id, name=name)
        return TemplateTaskRead.from_model(task)

    def link_template_task_to_call(self, task_id: int, call_id: int) -> CallTaskRead:
        task: Task = self.get_task_by_id(task_id)
        if task.type != TaskType.TEMPLATE:
            raise InvalidTaskTypeError(f'Task with id {task_id} is not a template task')

        self.db.execute(
            calls_tasks.insert().values(
                task_id=task_id,
                call_id=call_id,
                status=TaskStatus.OPEN
            )
        )
        
        self.db.commit()
        
        return CallTaskRead.from_model(task, call_id=call_id, status=TaskStatus.OPEN)

    def unlink_template_task_from_call(self, task_id: int, call_id: int) -> None:
        task: Task = self.get_task_by_id(task_id)
        if task.type != TaskType.TEMPLATE:
            raise InvalidTaskTypeError(f'Task with id {task_id} is not a template task')

        self.db.execute(
            calls_tasks.delete()
            .where(calls_tasks.c.task_id == task_id, calls_tasks.c.call_id == call_id)
        )
        self.db.commit()

    def deactivate(self, task_id: int) -> None:
        task: Task = self.get_task_by_id(task_id)
        task.is_active = False
        self.db.execute(
            calls_tasks.delete()
            .where(calls_tasks.c.task_id == task_id)
        )
        self.update_task(task_id, is_active=False)

   
    def get_all_tasks_by_call_id(self, call_id: int) -> List[CallTaskRead]:
        all_active_tasks: Dict[int, Task] = {t.id: t for t in self.get_all_active()}
        results: List[Tuple[Task, TaskStatus]] = (
            self.db.query(Task, calls_tasks.c.status)
            .join(calls_tasks, Task.id == calls_tasks.c.task_id)
            .filter(calls_tasks.c.call_id == call_id)
            .all()
        )
        results: List[Tuple[Task, TaskStatus]] = [
            (task, status) for task, status in results if task.id in all_active_tasks
        ]

        call_tasks: List[CallTaskRead] = [
            CallTaskRead.from_model(task, call_id=call_id, status=TaskStatus(status))
            for task, status in results
        ]

        return call_tasks
        