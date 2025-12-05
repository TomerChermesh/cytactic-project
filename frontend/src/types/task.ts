import type { Tag } from './tag'

export type TaskType = 'template' | 'ad_hoc'

export type TaskStatus = 'open' | 'in_progress' | 'completed' | 'cancelled'

export interface BaseTask {
  id: number
  name: string
  created_at: string
  updated_at: string
  is_active: boolean
  type: TaskType
}

export interface Task extends BaseTask {}

export interface TemplateTask extends BaseTask {
  tags: Tag[]
}

export interface CallTask extends BaseTask {
  call_id: number
  status: TaskStatus
}