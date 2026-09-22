import { createContext, useContext, useEffect, useState } from 'react'
import { api, getToken, post, put } from '../api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('nc_user')
    return getToken() && stored ? JSON.parse(stored) : null
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem('nc_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('nc_user')
      localStorage.removeItem('nc_token')
    }
  }, [user])


  // =========================
  // LOGIN
  // =========================
  async function login({ email, password, role }) {

    const result = await post('/api/auth/login', {
      email,
      password
    })

    if (role && result.role !== role) {
      throw new Error(`This account is not a ${role}`)
    }

    localStorage.setItem('nc_token', result.token)

    const nextUser = {
      email: result.email,
      role: result.role,
      name: result.name
    }

    setUser(nextUser)

    window.dispatchEvent(new Event('nc-auth-changed'))

    return nextUser
  }


  // =========================
  // REGISTER
  // =========================
  async function register({ name, email, password }) {

    const result = await post('/api/auth/register', {
      name,
      email,
      password
    })

    localStorage.setItem('nc_token', result.token)

    const nextUser = {
      email: result.email,
      role: result.role,
      name: result.name
    }

    setUser(nextUser)

    window.dispatchEvent(new Event('nc-auth-changed'))

    return nextUser
  }


  // =========================
  // LOGOUT
  // =========================
  function logout() {
    setUser(null)
  }


  // =========================
  // UPDATE PROFILE
  // =========================
  async function updateProfile(patch) {

    const result = await put('/api/auth/me', patch)

    if (result.token) {
      localStorage.setItem('nc_token', result.token)
    }

    const nextUser = {
      email: result.email,
      role: result.role,
      name: result.name
    }

    setUser(nextUser)

    window.dispatchEvent(new Event('nc-auth-changed'))

    return nextUser
  }


  // =========================
  // CHECK CURRENT USER
  // =========================
  useEffect(() => {

    if (getToken()) {

      api('/api/auth/me')
        .then(setUser)
        .catch(() => setUser(null))

    }

  }, [])


  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}


export function useAuth() {

  const ctx = useContext(AuthContext)

  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return ctx
}