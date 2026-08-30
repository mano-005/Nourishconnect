import { createContext, useContext, useEffect, useState } from 'react'
import { api, getToken, post, put, remove } from '../api.js'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const [data, setData] = useState({ homes: [], donors: [], donations: [] })

  async function refresh() {
    const [homes, donations] = await Promise.all([api('/homes'), api('/donations')])
    let donors = []
    const storedUser = localStorage.getItem('nc_user')
    let currentUser = null
    try { currentUser = storedUser ? JSON.parse(storedUser) : null } catch { currentUser = null }
    if (currentUser?.role === 'admin') donors = await api('/admin/donors')
    setData({ homes, donations, donors })
  }

  useEffect(() => {
    if (getToken()) refresh().catch(() => {})
    const onAuth = () => refresh().catch(() => {})
    window.addEventListener('nc-auth-changed', onAuth)
    return () => window.removeEventListener('nc-auth-changed', onAuth)
  }, [])

  async function addHome(home) { await post('/homes', home); await refresh() }
  async function updateHome(id, patch) { await put(`/homes/${id}`, patch); await refresh() }
  async function deleteHome(id) { await remove(`/homes/${id}`); await refresh() }
  async function addDonor(donor) { await post('/admin/donors', donor); await refresh() }
  async function updateDonor(id, patch) { await put(`/admin/donors/${id}`, patch); await refresh() }
  async function deleteDonor(id) { await remove(`/admin/donors/${id}`); await refresh() }
  async function ensureDonor() { await refresh() }
  async function addDonation(donation) { await post('/donations', donation); await refresh() }
  async function updateDonation(id, patch) { await put(`/donations/${id}`, patch); await refresh() }
  async function deleteDonation(id) { await remove(`/donations/${id}`); await refresh() }
  async function approveDonation(id) { await put(`/donations/${id}/status/delivered`, {}); await refresh() }
  async function declineDonation(id) { await put(`/donations/${id}/status/declined`, {}); await refresh() }
  async function resetToSeed() { await refresh() }

  const value = { ...data, addHome, updateHome, deleteHome, addDonor, updateDonor, deleteDonor, ensureDonor, addDonation, updateDonation, deleteDonation, approveDonation, declineDonation, resetToSeed }
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
