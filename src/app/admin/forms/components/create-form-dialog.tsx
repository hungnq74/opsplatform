'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FilePlus } from "lucide-react"
import { createForm } from "../actions"
import { Textarea } from "@/components/ui/textarea"

export function CreateFormDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  async function onSubmit(formData: FormData) {
    setLoading(true)
    setError("")

    const res = await createForm(formData)

    if (res?.error) {
      setError(res.error)
      setLoading(false)
    } else if (res?.success && res.formId) {
      setOpen(false)
      setLoading(false)
      router.push(`/admin/forms/${res.formId}/builder`)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button style={{ backgroundColor: '#f39c12' }} className="hover:opacity-90">
            <FilePlus className="mr-2 h-4 w-4" />
            Tạo Biểu mẫu
          </Button>
        }
      />
      <DialogContent>
        <form action={onSubmit}>
          <DialogHeader>
            <DialogTitle>Tạo Mới Biểu Mẫu</DialogTitle>
            <DialogDescription>
              Nhập thông tin chung. Sau đó, bạn sẽ được chuyển đến trang thiết kế các trường nhập liệu.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-[14px] px-5 py-[18px]">
            <div className="flex flex-col gap-[6px]">
              <Label htmlFor="name" className="text-[12px] font-medium">Tên Biểu mẫu</Label>
              <Input id="name" name="name" placeholder="VD: Báo cáo Doanh thu Tháng 10/2025" required />
            </div>
            <div className="flex flex-col gap-[6px]">
              <Label htmlFor="description" className="text-[12px] font-medium">Mô tả (Không bắt buộc)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="VD: Thu thập số liệu hoạt động kinh doanh hàng tháng của các chi nhánh..."
                rows={3}
              />
            </div>

            {error && <p className="text-[11px] text-[#c0392b] bg-[#fdedec] p-3 rounded-[6px] border border-[#c0392b]/20">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>Hủy</Button>
            <Button type="submit" disabled={loading} style={{ backgroundColor: '#f39c12' }} className="hover:opacity-90">
              {loading ? "Đang khởi tạo..." : "Tiếp tục thiết kế"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
