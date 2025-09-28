"use client"

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {apiFetch} from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      const data = await apiFetch('/auth/login', {method: 'POST', body: JSON.stringify({email, password})})
      if (data?.ok) {
        router.push('/resident/dashboard')
      } else {
        setError(data?.message || 'Login failed')
      }
    } catch (e:any) {
      setError(e.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Sign in</h1>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <input className="w-full border rounded p-2" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
        <input className="w-full border rounded p-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
        <button disabled={loading} className="w-full rounded p-2 border">{loading? 'Signing in...' : 'Sign in'}</button>
      </form>
    </div>
  )
}
