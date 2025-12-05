export interface Tag {
  id: number
  name: string
  created_at: string
  updated_at: string
  is_active: boolean
}

export interface TagWithSuggestedTasks extends Tag {
  suggested_tasks: import('./task').Task[]
}
