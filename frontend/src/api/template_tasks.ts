import { api } from './client'
import type { TemplateTask, CallTask } from '../types/task'

export const fetchTemplateTasks = async (): Promise<TemplateTask[]> => {
  const res = await api.get<TemplateTask[]>('/tasks/template/list')
  return res.data
}

export const createTemplateTask = async (
  name: string,
  tagIds: number[] = [],
): Promise<TemplateTask> => {
  const res = await api.post<TemplateTask>('/tasks/template', {
    name,
    type: 'template',
    tag_ids: tagIds,
  })
  return res.data
}

export const updateTemplateTask = async (
  taskId: number,
  name?: string,
  tagIds?: number[] | null,
): Promise<TemplateTask> => {
  const res = await api.patch<TemplateTask>(`/tasks/template/${taskId}`, {
    name,
    tag_ids: tagIds,
  })
  return res.data
}

export const linkTemplateTaskToCall = async (
  taskId: number,
  callId: number,
): Promise<CallTask> => {
  const res = await api.post<CallTask>(
    `/tasks/template/${taskId}/link?call_id=${callId}`,
  )
  return res.data
}

export const unlinkTemplateTaskFromCall = async (
  taskId: number,
  callId: number,
): Promise<void> => {
  await api.post(`/tasks/template/${taskId}/unlink?call_id=${callId}`)
}

export const deleteTemplateTask = async (taskId: number): Promise<void> => {
  await api.delete(`/tasks/template/${taskId}`)
}

