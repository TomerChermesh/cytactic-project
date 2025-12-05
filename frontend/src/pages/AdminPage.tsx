import React, { useState, useEffect } from 'react'
import { Box, Paper } from '@mui/material'
import TagsTable from '../components/tables/TagsTable'
import SuggestedTasksTable from '../components/tables/SuggestedTasksTable'
import TagForm from '../components/forms/TagForm'
import SuggestedTaskForm from '../components/forms/SuggestedTaskForm'
import ConfirmDialog from '../components/common/ConfirmDialog'
import { useSnackbar } from '../components/layout/SnackbarContext'
import { fetchTags, createTag, updateTag, deleteTag } from '../api/tags'
import {
  fetchTemplateTasks,
  createTemplateTask,
  updateTemplateTask,
  deleteTemplateTask,
} from '../api/template_tasks'
import type { Tag } from '../types/tag'
import type { TemplateTask } from '../types/task'

const AdminPage: React.FC = () => {
  const { showAlert } = useSnackbar()
  const [tags, setTags] = useState<Tag[]>([])
  const [templateTasks, setTemplateTasks] = useState<TemplateTask[]>([])
  const [isLoadingTags, setIsLoadingTags] = useState(true)
  const [isLoadingTasks, setIsLoadingTasks] = useState(true)
  
  const [tagFormOpen, setTagFormOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  
  const [taskFormOpen, setTaskFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<TemplateTask | null>(null)
  
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [confirmDialogConfig, setConfirmDialogConfig] = useState<{
    title: string
    message: string
    onConfirm: () => void
  } | null>(null)

  useEffect(() => {
    setIsLoadingTags(true)
    fetchTags()
      .then(setTags)
      .finally(() => setIsLoadingTags(false))
  }, [])

  useEffect(() => {   
    setIsLoadingTasks(true)
    fetchTemplateTasks()
      .then(setTemplateTasks)
      .finally(() => setIsLoadingTasks(false))
  }, [])


  const handleCreateTag = () => {
    setEditingTag(null)
    setTagFormOpen(true)
  }

  const handleEditTag = (tag: Tag) => {
    setEditingTag(tag)
    setTagFormOpen(true)
  }

  const handleDeleteTag = (tag: Tag) => {
    setConfirmDialogConfig({
      title: 'Delete Tag',
      message: `Are you sure you want to delete tag '${tag.name}'?`,
      onConfirm: async () => {
        try {
          await deleteTag(tag.id)
          setTags(tags.filter((t) => t.id !== tag.id))
          showAlert('success', `Tag '${tag.name}' deleted successfully`)
        } catch (error) {
          showAlert('error', 'Failed to delete tag')
        } finally {
          setConfirmDialogOpen(false)
        }
      },
    })
    setConfirmDialogOpen(true)
  }

  const handleTagSubmit = async (name: string, colorId: number) => {
    try {
      if (editingTag) {
        const updated = await updateTag(editingTag.id, name, colorId)
        setTags(tags.map((t) => (t.id === updated.id ? updated : t)))
        showAlert('success', `Tag '${name}' updated successfully`)
      } else {
        const newTag = await createTag(name, colorId)
        setTags([...tags, newTag])
        showAlert('success', `Tag '${name}' created successfully`)
      }
    } catch (error) {
      showAlert('error', 'Failed to save tag')
      throw error
    }
  }

  const handleCreateTask = () => {
    setEditingTask(null)
    setTaskFormOpen(true)
  }

  const handleEditTask = (task: TemplateTask) => {
    setEditingTask(task)
    setTaskFormOpen(true)
  }

  const handleDeleteTask = (task: TemplateTask) => {
    setConfirmDialogConfig({
      title: 'Delete Task',
      message: `Are you sure you want to delete task '${task.name}'?`,
      onConfirm: async () => {
        try {
          await deleteTemplateTask(task.id)
          setTemplateTasks(templateTasks.filter((t) => t.id !== task.id))
          showAlert('success', `Task '${task.name}' deleted successfully`)
        } catch (error) {
          showAlert('error', 'Failed to delete task')
        } finally {
          setConfirmDialogOpen(false)
        }
      },
    })
    setConfirmDialogOpen(true)
  }

  const handleTaskSubmit = async (name: string, tagIds: number[]) => {
    try {
      if (editingTask) {
        const updated = await updateTemplateTask(editingTask.id, name, tagIds)
        setTemplateTasks(
          templateTasks.map((t) => (t.id === updated.id ? updated : t))
        )
        showAlert('success', `Task '${name}' updated successfully`)
      } else {
        const newTask = await createTemplateTask(name, tagIds)
        setTemplateTasks([...templateTasks, newTask])
        showAlert('success', `Task '${name}' created successfully`)
      }
    } catch (error) {
      showAlert('error', 'Failed to save task')
      throw error
    }
  }
  
  return (
    <>
      <Box sx={{ width: '100%', height: '100%', display: 'flex', gap: 3, overflow: 'hidden', boxSizing: 'border-box', p: 3 }}>
        <Box sx={{ flex: '0 0 30%', display: 'flex', minWidth: 0, height: '100%', overflow: 'hidden' }}>
          <Paper sx={{ flex: 1, display: 'flex', minWidth: 0, height: '100%', overflow: 'hidden', borderRadius: 2 }}>
            <TagsTable 
              tags={tags}
              isLoading={isLoadingTags}
              onCreate={handleCreateTag}
              onEdit={handleEditTag}
              onDelete={handleDeleteTag}
            />
          </Paper>
        </Box>

        <Box sx={{ flex: '0 0 70%', display: 'flex', minWidth: 0, height: '100%', overflow: 'hidden' }}>
          <Paper sx={{ flex: 1, display: 'flex', minWidth: 0, height: '100%', overflow: 'hidden', borderRadius: 2 }}>
            <SuggestedTasksTable 
              tasks={templateTasks}
              isLoading={isLoadingTasks}
              onCreate={handleCreateTask}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          </Paper>
        </Box>
      </Box>

      <TagForm
        open={tagFormOpen}
        tag={editingTag}
        onClose={() => setTagFormOpen(false)}
        onSubmit={handleTagSubmit}
      />

      <SuggestedTaskForm
        open={taskFormOpen}
        task={editingTask}
        tags={tags}
        onClose={() => setTaskFormOpen(false)}
        onSubmit={handleTaskSubmit}
      />

      {confirmDialogConfig && (
        <ConfirmDialog
          open={confirmDialogOpen}
          title={confirmDialogConfig.title}
          message={confirmDialogConfig.message}
          onConfirm={confirmDialogConfig.onConfirm}
          onCancel={() => {
            setConfirmDialogOpen(false)
            setConfirmDialogConfig(null)
          }}
          confirmText='Delete'
          cancelText='Cancel'
          confirmColor='error'
        />
      )}
    </>
  )
}

export default AdminPage
