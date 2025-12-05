from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from src.dal.dependencies import get_task_dal
from src.dal.task_dal import TaskDAL
from src.schemas.task import TemplateTaskCreate, TemplateTaskUpdate, TemplateTaskRead, CallTaskRead
from src.core.exceptions import ItemNotFoundError, InvalidTaskTypeError
from src.utils.logger import logger

router: APIRouter = APIRouter(prefix='/v1/tasks/template')


@router.get('/list', response_model=List[TemplateTaskRead])
def list_template_tasks(task_dal: TaskDAL = Depends(get_task_dal)) -> List[TemplateTaskRead]:
    try:
        logger.info('Listing all template tasks')
        result = task_dal.list_all_template_tasks()
        logger.info(f'Successfully retrieved {len(result)} template tasks')
        return result
    except ItemNotFoundError as e:
        logger.error('Failed to list template tasks', exception=e)
        raise HTTPException(status_code=404, detail=str(e))

@router.post('', response_model=TemplateTaskRead, status_code=status.HTTP_201_CREATED)
def create_template_task(payload: TemplateTaskCreate, task_dal: TaskDAL = Depends(get_task_dal)) -> TemplateTaskRead:
    try:
        logger.info(f'Creating template task: name={payload.name}, tag_ids={payload.tag_ids}')
        result = task_dal.create_template_task(payload.name, payload.tag_ids)
        logger.info(f'Successfully created template task with id: {result.id}')
        return result
    except ItemNotFoundError as e:
        logger.error(f'Failed to create template task: {payload.name}', exception=e)
        raise HTTPException(status_code=400, detail=str(e))


@router.patch('/{task_id}', response_model=TemplateTaskRead)
def update_template_task(task_id: int, payload: TemplateTaskUpdate, task_dal: TaskDAL = Depends(get_task_dal)) -> TemplateTaskRead:
    try:
        logger.info(f'Updating template task: id={task_id}, name={payload.name}, tag_ids={payload.tag_ids}')
        result = task_dal.update_template_task_and_tags(task_id, payload.name, payload.tag_ids)
        logger.info(f'Successfully updated template task: {result.name}')
        return result
    except ItemNotFoundError as e:
        logger.error(f'Template task not found for update: id={task_id}', exception=e)
        raise HTTPException(status_code=404, detail=str(e))
    except InvalidTaskTypeError as e:
        logger.error(f'Invalid task type for update: id={task_id}', exception=e)
        raise HTTPException(status_code=400, detail=str(e))


@router.post('/{task_id}/link', response_model=CallTaskRead)
def link_template_task_to_call(task_id: int, call_id: int, task_dal: TaskDAL = Depends(get_task_dal)) -> CallTaskRead:
    try:
        logger.info(f'Linking template task to call: task_id={task_id}, call_id={call_id}')
        result = task_dal.link_template_task_to_call(task_id, call_id)
        logger.info(f'Successfully linked template task {task_id} to call {call_id}')
        return result
    except ItemNotFoundError as e:
        logger.error(f'Failed to link template task to call: task_id={task_id}, call_id={call_id}', exception=e)
        raise HTTPException(status_code=404, detail=str(e))


@router.post('/{task_id}/unlink', response_model=None)
def unlink_template_task_from_call(task_id: int, call_id: int, task_dal: TaskDAL = Depends(get_task_dal)) -> None:
    try:
        logger.info(f'Unlinking template task from call: task_id={task_id}, call_id={call_id}')
        task_dal.unlink_template_task_from_call(task_id, call_id)
        logger.info(f'Successfully unlinked template task {task_id} from call {call_id}')
    except ItemNotFoundError as e:
        logger.error(f'Failed to unlink template task from call: task_id={task_id}, call_id={call_id}', exception=e)
        raise HTTPException(status_code=404, detail=str(e))


@router.delete('/{task_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_template_task(task_id: int, task_dal: TaskDAL = Depends(get_task_dal)) -> None:
    try:
        logger.info(f'Deleting template task: id={task_id}')
        task_dal.deactivate(task_id)
        logger.info(f'Successfully deleted template task: id={task_id}')
    except ItemNotFoundError as e:
        logger.error(f'Template task not found for deletion: id={task_id}', exception=e)
        raise HTTPException(status_code=404, detail=str(e))
