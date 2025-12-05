import { api } from './client'
import type { CallListItem, CallDetail } from '../types/call'

export const fetchCalls = async (): Promise<CallListItem[]> => {
  const res = await api.get<CallListItem[]>('/calls')
  return res.data
}

export const fetchCall = async (id: number): Promise<CallDetail> => {
  const res = await api.get<CallDetail>(`/calls/${id}`)
  return res.data
}

export const createCall = async (
  name: string,
  tagIds: number[] = [],
  description: string | null = null,
): Promise<CallDetail> => {
  const res = await api.post<CallDetail>('/calls', {
    name,
    description,
    tag_ids: tagIds,
  })
  return res.data
}

export const updateCall = async (
  callId: number,
  name?: string,
  description?: string | null,
  tagIds?: number[] | null,
): Promise<CallDetail> => {
  const res = await api.patch<CallDetail>(`/calls/${callId}`, {
    name,
    description,
    tag_ids: tagIds,
  })
  return res.data
}
