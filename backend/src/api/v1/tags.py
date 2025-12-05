from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from src.dal.dependencies import get_tag_dal, get_task_dal
from src.dal.tag_dal import TagDAL
from src.dal.task_dal import TaskDAL
from src.models.tag import Tag
from src.schemas.associations import TagWithSuggestedTasks
from src.schemas.tag import TagCreate, TagRead, TagUpdate
from src.core.exceptions import ItemNotFoundError
from src.utils.logger import logger

router: APIRouter = APIRouter(prefix='/v1/tags')


@router.get('', response_model=List[TagRead])
def list_tags(tag_dal: TagDAL = Depends(get_tag_dal)) -> List[Tag]:
    logger.info('Listing all tags')
    result = tag_dal.list_all_tags()
    logger.info(f'Successfully retrieved {len(result)} tags')
    return result


@router.post('', response_model=TagRead, status_code=status.HTTP_201_CREATED)
def create_tag(payload: TagCreate, tag_dal: TagDAL = Depends(get_tag_dal)) -> Tag:
    logger.info(f'Creating tag: name={payload.name}')
    result = tag_dal.create_tag(name=payload.name)
    logger.info(f'Successfully created tag with id: {result.id}')
    return result


@router.get('/{tag_id}', response_model=TagRead)
def get_tag(tag_id: int, tag_dal: TagDAL = Depends(get_tag_dal)) -> Tag:
    try:
        logger.info(f'Getting tag: id={tag_id}')
        result = tag_dal.get_tag_by_id(tag_id)
        logger.info(f'Successfully retrieved tag: {result.name}')
        return result
    except ItemNotFoundError as e:
        logger.error(f'Tag not found: id={tag_id}', exception=e)
        raise HTTPException(status_code=404, detail=str(e))


@router.patch('/{tag_id}', response_model=TagRead)
def update_tag(
    tag_id: int,
    payload: TagUpdate,
    tag_dal: TagDAL = Depends(get_tag_dal),
) -> Tag:
    try:
        logger.info(f'Updating tag: id={tag_id}, name={payload.name}')
        result = tag_dal.update_tag(tag_id, payload.name)
        logger.info(f'Successfully updated tag: {result.name}')
        return result
    except ItemNotFoundError as e:
        logger.error(f'Tag not found for update: id={tag_id}', exception=e)
        raise HTTPException(status_code=404, detail=str(e))


@router.delete('/{tag_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_tag(tag_id: int, tag_dal: TagDAL = Depends(get_tag_dal)) -> None:
    try:
        logger.info(f'Deleting tag: id={tag_id}')
        tag_dal.deactivate(tag_id)
        logger.info(f'Successfully deleted tag: id={tag_id}')
    except ItemNotFoundError as e:
        logger.error(f'Tag not found for deletion: id={tag_id}', exception=e)
        raise HTTPException(status_code=404, detail=str(e))


@router.get('/{tag_id}/suggested-tasks', response_model=TagWithSuggestedTasks)
def get_suggested_tasks(
    tag_id: int,
    tag_dal: TagDAL = Depends(get_tag_dal)
) -> TagWithSuggestedTasks:
    try:
        logger.info(f'Getting suggested tasks for tag: id={tag_id}')
        result = tag_dal.get_tag_with_suggested_tasks(tag_id)
        logger.info(f'Successfully retrieved {len(result.suggested_tasks)} suggested tasks for tag: {tag_id}')
        return result
    except ItemNotFoundError as e:
        logger.error(f'Tag not found when getting suggested tasks: id={tag_id}', exception=e)
        raise HTTPException(status_code=404, detail=str(e))
