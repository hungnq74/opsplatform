'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { createUser } from "../actions"

export function SetupUserDialog({ organizations }: { organizations: any[] }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function onSubmit(formData: FormData) {
    setLoading(true)
    setError("")

    const res = await createUser(formData)

    if (res?.error) {
      setError(res.error)
      setLoading(false)
    } else {
      setOpen(false)
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Mở Tài khoản
          </Button>
        }
      />
      <DialogContent>
        <form action={onSubmit}>
          <DialogHeader>
            <DialogTitle>Mở Tài khoản Mới</DialogTitle>
            <DialogDescription>
              Điền thông tin email và gán đơn vị trực thuộc để họ có thể đăng nhập.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-[14px] px-5 py-[18px]">
            <div className="flex flex-col gap-[6px]">
              <Label htmlFor="fullName" className="text-[12px] font-medium">Họ và tên</Label>
              <Input id="fullName" name="fullName" placeholder="VD: Nguyễn Văn A" required />
            </div>
            <div className="flex flex-col gap-[6px]">
              <Label htmlFor="email" className="text-[12px] font-medium">Email đăng nhập</Label>
              <Input id="email" name="email" type="email" placeholder="VD: nv.a@donvi.com" required />
            </div>
            <div className="flex flex-col gap-[6px]">
              <Label htmlFor="password" className="text-[12px] font-medium">Mật khẩu khởi tạo</Label>
              <Input id="password" name="password" minLength={6} placeholder="Tối thiểu 6 ký tự" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-[6px]">
                <Label htmlFor="role" className="text-[12px] font-medium">Vai trò</Label>
                <Select name="role" defaultValue="user">
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Người dùng (Đơn vị)</SelectItem>
                    <SelectItem value="admin">Quản trị viên (Admin)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-[6px]">
                <Label htmlFor="organizationId" className="text-[12px] font-medium">Thuộc Đơn vị</Label>
                <Select name="organizationId" defaultValue="none">
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn Đơn vị" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">-- Không thuộc Đơn vị --</SelectItem>
                    {organizations.map(org => (
                      <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && <p className="text-[11px] text-[#c0392b] bg-[#fdedec] p-3 rounded-[6px] border border-[#c0392b]/20">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>Hủy</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang xử lý..." : "Khởi tạo Tài khoản"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
