from fastapi import Depends
from sqlalchemy.orm import Session

from src.core.db import get_db
from src.dal.call_dal import CallDAL
from src.dal.tag_dal import TagDAL
from src.dal.task_dal import TaskDAL


def get_tag_dal(db: Session = Depends(get_db)) -> TagDAL:
    return TagDAL(db)


def get_task_dal(
    db: Session = Depends(get_db),
    tag_dal: TagDAL = Depends(get_tag_dal)
) -> TaskDAL:
    return TaskDAL(db, tag_dal=tag_dal)


def get_call_dal(
    db: Session = Depends(get_db),
    tag_dal: TagDAL = Depends(get_tag_dal)
) -> CallDAL:
    return CallDAL(db, tag_dal=tag_dal)
