'use client'

import { login } from './actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
    <div className="flex h-screen w-full items-center justify-center px-4 bg-[#f4f6f8]">
      <Card className="w-full max-w-sm">
        <CardHeader className="border-b-0 pb-0">
          <div className="flex items-center gap-[10px] mb-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-navy)]">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <span className="text-[13px] font-bold text-[var(--color-navy)]">Ops Platform</span>
          </div>
          <CardTitle className="text-[19px]">Đăng nhập</CardTitle>
          <CardDescription>
            Sử dụng tài khoản Google để truy cập nhanh vào hệ thống.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 pt-4">

          <Button type="button" variant="outline" onClick={handleGoogleLogin} disabled={loading} className="w-full relative h-11">
            <svg className="absolute left-4 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>
            <span className="font-semibold text-[13px]">Tiếp tục với Google</span>
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#dde3ea]" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase">
              <span className="bg-white px-2 text-[#a0b0be] font-medium tracking-[0.06em]">Hoặc Email Trực Tiếp</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-[14px]">
            <div className="flex flex-col gap-[6px]">
              <Label htmlFor="email" className="text-[12px] font-medium">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" defaultValue="admin@opsplatform.com" required disabled={loading} />
            </div>
            <div className="flex flex-col gap-[6px]">
              <Label htmlFor="password" className="text-[12px] font-medium">Mật khẩu</Label>
              <Input id="password" name="password" type="password" defaultValue="admin123" required disabled={loading} />
            </div>
            {errorMsg && (
              <p className="text-[11px] text-[#c0392b] bg-[#fdedec] p-2 rounded-[6px] text-center font-medium">{errorMsg}</p>
            )}
            <Button type="submit" className="w-full h-10" disabled={loading}>
              {loading ? "Đang xử lý..." : "Đăng nhập bằng Email"}
            </Button>
          </form>

        </CardContent>
      </Card>
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
