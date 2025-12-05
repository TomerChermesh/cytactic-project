import { api } from './client'
import type { Tag, TagWithSuggestedTasks } from '../types/tag'

export const fetchTags = async (): Promise<Tag[]> => {
  const res = await api.get<Tag[]>('/tags')
  return res.data
}

export const fetchTag = async (tagId: number): Promise<Tag> => {
  const res = await api.get<Tag>(`/tags/${tagId}`)
  return res.data
}

export const createTag = async (name: string, colorId: number = 0): Promise<Tag> => {
  const res = await api.post<Tag>('/tags', { name, color_id: colorId })
  return res.data
}

export const updateTag = async (tagId: number, name: string, colorId?: number): Promise<Tag> => {
  const payload: { name: string; color_id?: number } = { name }
  if (colorId !== undefined) {
    payload.color_id = colorId
  }
  const res = await api.patch<Tag>(`/tags/${tagId}`, payload)
  return res.data
}

export const deleteTag = async (tagId: number): Promise<void> => {
  await api.delete(`/tags/${tagId}`)
}

export const fetchTagSuggestedTasks = async (
  tagId: number,
): Promise<TagWithSuggestedTasks> => {
  const res = await api.get<TagWithSuggestedTasks>(
    `/tags/${tagId}/suggested-tasks`,
  )
  return res.data
}
