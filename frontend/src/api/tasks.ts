import { api } from './client'
import type { Task, TaskStatus } from '../types/task'

// Ad-hoc tasks API
export const fetchTasks = async (): Promise<Task[]> => {
  const res = await api.get<Task[]>('/tasks')
  return res.data
}

export const createAdHocTask = async (
  name: string,
  callId: number,
): Promise<Task> => {
  const res = await api.post<Task>('/tasks', {
    name,
    type: 'ad_hoc',
    call_id: callId,
  })
  return res.data
}

export const updateTask = async (
  taskId: number,
  callId: number,
  status: TaskStatus,
  name?: string,
): Promise<Task> => {
  const res = await api.patch<Task>(`/tasks/${taskId}`, {
    call_id: callId,
    status,
    name,
  })
  return res.data
}

export const deleteTask = async (taskId: number): Promise<void> => {
  await api.delete(`/tasks/${taskId}`)
}
