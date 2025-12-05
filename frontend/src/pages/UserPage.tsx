import React, { useState, useEffect } from 'react'
import { Box, CircularProgress } from '@mui/material'
import CallsList from '../components/calls/CallsList'
import CallEditBox from '../components/calls/CallEditBox'
import CallForm from '../components/forms/CallForm'
import CallTaskForm from '../components/forms/CallTaskForm'
import ConfirmDialog from '../components/common/ConfirmDialog'
import { useSnackbar } from '../contexts/SnackbarContext'
import { fetchCalls, fetchCall, createCall, updateCall } from '../api/calls'
import { fetchCallTasks, createAdHocTask, updateCallTask, deleteCallTask } from '../api/call_tasks'
import { fetchTemplateTasks, linkTemplateTaskToCall, unlinkTemplateTaskFromCall } from '../api/template_tasks'
import { fetchTags, fetchTagSuggestedTasks } from '../api/tags'
import type { TaskStatus } from '../types/task'
import type { CallListItem, CallDetail } from '../types/call'
import type { CallTask, TemplateTask } from '../types/task'
import type { Tag } from '../types/tag'

const UserPage: React.FC = () => {
  const { showAlert } = useSnackbar()
  const [calls, setCalls] = useState<CallListItem[]>([])
  const [selectedCall, setSelectedCall] = useState<CallDetail | null>(null)
  const [callTasks, setCallTasks] = useState<CallTask[]>([])
  const [suggestedTasks, setSuggestedTasks] = useState<TemplateTask[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [days, setDays] = useState<number>(7)
  const [isLoadingCalls, setIsLoadingCalls] = useState(true)
  const [isLoadingCall, setIsLoadingCall] = useState(false)
  const [isLoadingCallTasks, setIsLoadingCallTasks] = useState(false)
  const [isLoadingSuggestedTasks, setIsLoadingSuggestedTasks] = useState(false)
  
  const [callFormOpen, setCallFormOpen] = useState(false)
  const [editingCall, setEditingCall] = useState<CallDetail | null>(null)

  const [callTaskFormOpen, setCallTaskFormOpen] = useState(false)
  const [editingCallTask, setEditingCallTask] = useState<CallTask | null>(null)
  
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [confirmDialogConfig, setConfirmDialogConfig] = useState<{
    title: string
    message: string
    onConfirm: () => void
  } | null>(null)

  useEffect(() => {
    setIsLoadingCalls(true)
    fetchCalls(days)
      .then(setCalls)
      .finally(() => setIsLoadingCalls(false))
  }, [days])

  useEffect(() => {
    if (selectedCall) {
      setIsLoadingCallTasks(true)
      fetchCallTasks(selectedCall.id)
        .then(setCallTasks)
        .finally(() => setIsLoadingCallTasks(false))
    } else {
      setCallTasks([])
    }
  }, [selectedCall])

  useEffect(() => {
    if (selectedCall && selectedCall.tags && selectedCall.tags.length > 0) {
      setIsLoadingSuggestedTasks(true)
      Promise.all(
        selectedCall.tags.map((tag) => fetchTagSuggestedTasks(tag.id))
      )
        .then((tagWithTasks) => {
          const taskIds = new Set<number>()
          tagWithTasks.forEach((tagData) => {
            tagData.suggested_tasks.forEach((task) => {
              taskIds.add(task.id)
            })
          })
          
          return fetchTemplateTasks().then((allTemplateTasks) => {
            const suggestedTemplateTasks = allTemplateTasks.filter((task) =>
              taskIds.has(task.id)
            )
            setSuggestedTasks(suggestedTemplateTasks)
          })
        })
        .finally(() => setIsLoadingSuggestedTasks(false))
    } else {
      setSuggestedTasks([])
    }
  }, [selectedCall])

  useEffect(() => {
    fetchTags().then(setTags)
  }, [])

  const handleCallSelect = async (callId: number) => {
    setIsLoadingCall(true)
    try {
      const call = await fetchCall(callId)
      setSelectedCall(call)
    } catch (error) {
      console.error('Failed to fetch call:', error)
    } finally {
      setIsLoadingCall(false)
    }
  }

  const handleCallEdit = () => {
    if (selectedCall) {
      setEditingCall(selectedCall)
      setCallFormOpen(true)
    }
  }

  const handleCloseCall = () => {
    setSelectedCall(null)
  }

  const handleAddSuggestedTask = async (task: TemplateTask) => {
    if (!selectedCall) return
    try {
      await linkTemplateTaskToCall(task.id, selectedCall.id)
      // Refresh call tasks
      const updatedCallTasks = await fetchCallTasks(selectedCall.id)
      setCallTasks(updatedCallTasks)
    } catch (error) {
      console.error('Failed to add task to call:', error)
    }
  }

  const handleCreateNewCall = () => {
    setCallFormOpen(true)
  }

  const handleCallSubmit = async (name: string, description: string | null, tagIds: number[]) => {
    try {
      if (editingCall) {
        const updatedCall = await updateCall(editingCall.id, name, description, tagIds)
        const updatedCalls = await fetchCalls()
        setCalls(updatedCalls)
        const callDetail = await fetchCall(updatedCall.id)
        setSelectedCall(callDetail)
        showAlert('success', `Call '${name}' updated successfully!`)
      } else {
        const newCall = await createCall(name, tagIds, description)
        const updatedCalls = await fetchCalls()
        setCalls(updatedCalls)
        const callDetail = await fetchCall(newCall.id)
        setSelectedCall(callDetail)
        showAlert('success', `Call '${name}' created successfully!`)
      }
      setEditingCall(null)
    } catch (error) {
      console.error('Failed to save call:', error)
      showAlert('error', 'Failed to save call.')
      throw error
    }
  }

  const handleCreateCallTask = () => {
    if (!selectedCall) return
    setEditingCallTask(null)
    setCallTaskFormOpen(true)
  }

  const handleEditCallTask = (task: CallTask) => {
    setEditingCallTask(task)
    setCallTaskFormOpen(true)
  }

  const handleDeleteCallTask = (task: CallTask) => {
    if (!selectedCall) return
    
    setConfirmDialogConfig({
      title: 'Delete Task',
      message: `Are you sure you want to delete task '${task.name}'?`,
      onConfirm: async () => {
        try {
          if (task.type === 'template') {
            await unlinkTemplateTaskFromCall(task.id, selectedCall.id)
            showAlert('success', `Task '${task.name}' removed from call successfully!`)
          } else {
            await deleteCallTask(task.id)
            showAlert('success', `Task '${task.name}' deleted successfully!`)
          }
          const updatedCallTasks = await fetchCallTasks(selectedCall.id)
          setCallTasks(updatedCallTasks)
        } catch (error) {
          console.error('Failed to delete task:', error)
          showAlert('error', 'Failed to delete task.')
        } finally {
          setConfirmDialogOpen(false)
        }
      },
    })
    setConfirmDialogOpen(true)
  }

  const handleCallTaskSubmit = async (name: string, status: TaskStatus) => {
    if (!selectedCall) return
    
    try {
      if (editingCallTask) {
        await updateCallTask(editingCallTask.id, selectedCall.id, name, status)
        showAlert('success', `Task '${name}' updated successfully!`)
      } else {
        await createAdHocTask(selectedCall.id, name)
        showAlert('success', `Task '${name}' created successfully!`)
      }
      const updatedCallTasks = await fetchCallTasks(selectedCall.id)
      setCallTasks(updatedCallTasks)
      setEditingCallTask(null)
    } catch (error) {
      console.error('Failed to save task:', error)
      showAlert('error', 'Failed to save task.')
      throw error
    }
  }

  const handleCompleteTask = async (task: CallTask) => {
    if (!selectedCall) return
    try {
      await updateCallTask(task.id, selectedCall.id, task.name, 'completed')
      const updatedCallTasks = await fetchCallTasks(selectedCall.id)
      setCallTasks(updatedCallTasks)
      showAlert('success', `Task '${task.name}' marked as completed!`)
    } catch (error) {
      console.error('Failed to complete task:', error)
      showAlert('error', 'Failed to complete task.')
    }
  }

  return (
    <Box sx={{ display: 'flex', height: '100%', width: '100%', overflow: 'hidden' }}>
      <CallsList
        calls={calls}
        selectedCallId={selectedCall?.id}
        isLoading={isLoadingCalls}
        days={days}
        onCallSelect={handleCallSelect}
        onDaysChange={setDays}
      />

      <Box sx={{ flex: '0 0 80%', overflow: 'hidden', height: '100%', display: 'flex', minWidth: 0 }}>
        {isLoadingCall ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              width: '100%',
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <CallEditBox
            call={selectedCall}
            callTasks={callTasks}
            isLoadingCallTasks={isLoadingCallTasks}
            suggestedTasks={suggestedTasks}
            isLoadingSuggestedTasks={isLoadingSuggestedTasks}
            onAddSuggestedTask={handleAddSuggestedTask}
            onCreateNewCall={handleCreateNewCall}
            onClose={handleCloseCall}
            onEdit={handleCallEdit}
            onCreateCallTask={handleCreateCallTask}
            onEditCallTask={handleEditCallTask}
            onDeleteCallTask={handleDeleteCallTask}
            onCompleteTask={handleCompleteTask}
          />
        )}
      </Box>

      <CallForm
        open={callFormOpen}
        call={editingCall}
        tags={tags}
        onClose={() => {
          setCallFormOpen(false)
          setEditingCall(null)
        }}
        onSubmit={handleCallSubmit}
      />

      {selectedCall && (
        <CallTaskForm
          open={callTaskFormOpen}
          task={editingCallTask}
          onClose={() => {
            setCallTaskFormOpen(false)
            setEditingCallTask(null)
          }}
          onSubmit={handleCallTaskSubmit}
        />
      )}

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
    </Box>
  )
}

export default UserPage