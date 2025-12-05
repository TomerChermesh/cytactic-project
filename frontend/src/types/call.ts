import type { Task } from './task'
import type { Tag } from './tag'

export interface BaseCall {
  id: number
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface CallListItem extends BaseCall {
  tags: Tag[]
}

export interface CallDetail extends BaseCall {
  tags: Tag[]
  tasks: Task[]
}