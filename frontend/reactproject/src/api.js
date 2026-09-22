const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export function getToken() {
  return localStorage.getItem('nc_token')
}

export async function api(path, options = {}) {

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  }

  const token = getToken()

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  })

  if (!response.ok) {
    throw new Error(
      (await response.text()) ||
      `Request failed (${response.status})`
    )
  }

  return response.status === 204
    ? null
    : response.json()
}

export function post(path, body) {
  return api(path, {
    method: 'POST',
    body: JSON.stringify(body)
  })
}

export function put(path, body) {
  return api(path, {
    method: 'PUT',
    body: JSON.stringify(body)
  })
}

export function remove(path) {
  return api(path, {
    method: 'DELETE'
  })
}