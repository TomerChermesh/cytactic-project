import { API_BASE_URL, API_PREFIX } from '../constants/api'

const baseURL = `${API_BASE_URL}${API_PREFIX}`

export const api = {
  async get<T>(path: string, init?: RequestInit) {
    const res = await fetch(`${baseURL}${path}`, {
      method: 'GET',
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
    })

    if (!res.ok) {
      throw new Error(`GET ${path} failed with status ${res.status}`)
    }

    const data = (await res.json()) as T
    return { data }
  },

  async post<T>(path: string, body?: unknown, init?: RequestInit) {
    const res = await fetch(`${baseURL}${path}`, {
      method: 'POST',
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })

    if (!res.ok) {
      throw new Error(`POST ${path} failed with status ${res.status}`)
    }

    const data = (await res.json()) as T
    return { data }
  },

  async patch<T>(path: string, body?: unknown, init?: RequestInit) {
    const res = await fetch(`${baseURL}${path}`, {
      method: 'PATCH',
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })

    if (!res.ok) {
      throw new Error(`PATCH ${path} failed with status ${res.status}`)
    }

    const data = (await res.json()) as T
    return { data }
  },

  async delete(path: string, init?: RequestInit) {
    const res = await fetch(`${baseURL}${path}`, {
      method: 'DELETE',
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
    })

    if (!res.ok) {
      throw new Error(`DELETE ${path} failed with status ${res.status}`)
    }

    return res.status === 204 ? undefined : await res.json()
  }
}
