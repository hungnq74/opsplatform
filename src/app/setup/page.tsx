'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function SetupPage() {
  const [email, setEmail] = useState('admin@opsplatform.com')
  const [password, setPassword] = useState('admin123')
  const [msg, setMsg] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSetup = async () => {
    const supabase = createClient()
    setLoading(true)
    setMsg('Đang gửi yêu cầu khởi tạo Server Signup...')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: 'Quản trị viên Hệ thống' }
      }
    })

    setLoading(false)
    if (error) {
      setMsg('Lỗi: ' + error.message)
      setIsSuccess(false)
    } else {
      setMsg('Tạo tài khoản gốc thành công! Bảng Profiles đã ghi nhận.')
      setIsSuccess(true)
    }
  }

  return (
    <div className="p-4 flex h-screen items-center justify-center bg-[#f4f6f8]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center border-b-0">
          <CardTitle className="text-[19px]">Cài đặt Tài khoản Gốc</CardTitle>
          <CardDescription>Tiện ích Bypass - Dành cho môi trường nội bộ</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">

          {!isSuccess ? (
            <>
              <div className="flex flex-col gap-[6px]">
                <label className="text-[12px] font-medium text-[#1c2b3a]">Email Khởi tạo</label>
                <Input value={email} onChange={e => setEmail(e.target.value)} disabled={loading} />
              </div>
              <div className="flex flex-col gap-[6px]">
                <label className="text-[12px] font-medium text-[#1c2b3a]">Mật khẩu</label>
                <Input value={password} onChange={e => setPassword(e.target.value)} disabled={loading} />
              </div>

              <Button onClick={handleSetup} disabled={loading} className="w-full mt-4">
                {loading ? "Đang xử lý..." : "Bấm vào đây để Ép tạo tài khoản"}
              </Button>

              {msg && (
                <div className="mt-4 p-3 bg-[#fdedec] text-[#c0392b] rounded-[6px] text-[12px] flex gap-2 items-start font-medium">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>{msg}</p>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <CheckCircle2 className="h-16 w-16 text-[#27ae60] mb-4" />
              <h2 className="text-[16px] font-bold text-[#1c2b3a] mb-2">Đăng ký vào Database Thành công!</h2>
              <div className="bg-[#fef9e7] border border-[#f39c12]/20 p-4 rounded-[6px] my-6 text-[12px] text-[#1c2b3a] text-left">
                <strong>BƯỚC CHÓT: Để nâng cấp lên Admin</strong>
                <ul className="list-decimal pl-5 mt-2 space-y-1">
                  <li>Mở bảng điều khiển <strong>Supabase</strong> của bạn</li>
                  <li>Vào <strong>Table Editor</strong> {'>'} bảng <code>profiles</code></li>
                  <li>Tìm dòng chứa email này, click đúp vào cột <code>role</code> và gõ đổi thành chữ <strong>admin</strong></li>
                  <li>Nhấn Lưu (Save)</li>
                </ul>
              </div>
              <Link href="/login" className="w-full">
                <Button className="w-full">
                  Đã hiểu, chuyển đến Đăng nhập ngay
                </Button>
              </Link>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  )
}
