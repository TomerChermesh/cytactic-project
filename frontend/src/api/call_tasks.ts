import { api } from './client'
import type { CallTask, TaskStatus } from '../types/task'

export const fetchCallTasks = async (callId: number): Promise<CallTask[]> => {
  const res = await api.get<CallTask[]>(`/calls/${callId}/tasks`)
  return res.data
}

export const createAdHocTask = async (
  callId: number,
  name: string,
  status: TaskStatus = 'open',
): Promise<CallTask> => {
  const res = await api.post<CallTask>('/tasks', {
    name,
    type: 'ad_hoc',
    call_id: callId,
    status
  })
  return res.data
}

export const updateCallTask = async (
  taskId: number,
  callId: number,
  name?: string,
  status?: TaskStatus,
): Promise<CallTask> => {
  const res = await api.patch<CallTask>(`/tasks/${taskId}`, {
    call_id: callId,
    status: status || 'open',
    name,
  })
  return res.data
}

export const deleteCallTask = async (taskId: number): Promise<void> => {
  await api.delete(`/tasks/${taskId}`)
}
