from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from src.dal.dependencies import get_tag_dal, get_task_dal
from src.dal.tag_dal import TagDAL
from src.dal.task_dal import TaskDAL
from src.models.tag import Tag
from src.schemas.associations import TagWithSuggestedTasks
from src.schemas.tag import TagCreate, TagRead, TagUpdate
from src.core.exceptions import ItemNotFoundError

router: APIRouter = APIRouter(prefix='/v1/tags')


@router.get('', response_model=List[TagRead])
def list_tags(tag_dal: TagDAL = Depends(get_tag_dal)) -> List[Tag]:
    return tag_dal.list_all_tags()


@router.post('', response_model=TagRead, status_code=status.HTTP_201_CREATED)
def create_tag(payload: TagCreate, tag_dal: TagDAL = Depends(get_tag_dal)) -> Tag:
    return tag_dal.create_tag(name=payload.name)


@router.get('/{tag_id}', response_model=TagRead)
def get_tag(tag_id: int, tag_dal: TagDAL = Depends(get_tag_dal)) -> Tag:
    try:
        return tag_dal.get_tag_by_id(tag_id)
    except ItemNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.patch('/{tag_id}', response_model=TagRead)
def update_tag(
    tag_id: int,
    payload: TagUpdate,
    tag_dal: TagDAL = Depends(get_tag_dal),
) -> Tag:
    try:
        return tag_dal.update_tag(tag_id, payload.name)
    except ItemNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete('/{tag_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_tag(tag_id: int, tag_dal: TagDAL = Depends(get_tag_dal)) -> None:
    try:
        tag_dal.deactivate(tag_id)
    except ItemNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get('/{tag_id}/suggested-tasks', response_model=TagWithSuggestedTasks)
def get_suggested_tasks(
    tag_id: int,
    tag_dal: TagDAL = Depends(get_tag_dal)
) -> TagWithSuggestedTasks:
    try:
        return tag_dal.get_tag_with_suggested_tasks(tag_id)
    except ItemNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
