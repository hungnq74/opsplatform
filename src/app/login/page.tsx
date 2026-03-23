'use client'

import { login } from './actions'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Building2 } from 'lucide-react'

function LoginForm() {
  const searchParams = useSearchParams()
  const urlMessage = searchParams.get('message')

  const [errorMsg, setErrorMsg] = useState(urlMessage || '')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    const formData = new FormData(e.currentTarget)

    const res = await login(formData)

    if (res?.error) {
      setErrorMsg(res.error)
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) {
      setErrorMsg(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 bg-[#f1f5f9]">
      <div className="w-full max-w-[360px]">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2563eb] shadow-[0_4px_14px_rgba(37,99,235,0.3)]">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-[18px] font-bold text-[#0f172a] tracking-tight">Ops Platform</h1>
            <p className="text-[13px] text-[#64748b] mt-0.5">Hệ thống quản lý báo cáo</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_20px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] overflow-hidden">
          <div className="px-6 pt-6 pb-2">
            <h2 className="text-[15px] font-semibold text-[#0f172a]">Đăng nhập</h2>
            <p className="text-[12px] text-[#64748b] mt-0.5">Sử dụng tài khoản của bạn để tiếp tục.</p>
          </div>

          <div className="px-6 pb-6 mt-4 grid gap-4">
            <Button type="button" variant="outline" onClick={handleGoogleLogin} disabled={loading} className="w-full h-10 relative">
              <svg className="absolute left-4 h-4 w-4" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
              </svg>
              <span className="text-[13px] font-medium">Tiếp tục với Google</span>
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#e2e8f0]" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase">
                <span className="bg-white px-2.5 text-[#94a3b8] font-medium tracking-wider">Hoặc đăng nhập bằng email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-3.5">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email" className="text-[12px] font-medium text-[#374151]">Email</Label>
                <Input id="email" name="email" type="email" placeholder="m@example.com" defaultValue="admin@opsplatform.com" required disabled={loading} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password" className="text-[12px] font-medium text-[#374151]">Mật khẩu</Label>
                <Input id="password" name="password" type="password" defaultValue="admin123" required disabled={loading} />
              </div>
              {errorMsg && (
                <p className="text-[11px] text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] px-3 py-2 rounded-lg text-center font-medium">{errorMsg}</p>
              )}
              <Button type="submit" className="w-full mt-1" disabled={loading}>
                {loading ? "Đang xử lý..." : "Đăng nhập"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
