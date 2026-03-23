'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { createOrganization } from "../actions"

export function SetupOrganizationDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function onSubmit(formData: FormData) {
    setLoading(true)
    setError("")

    const res = await createOrganization(formData)

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
            Thêm Đơn vị
          </Button>
        }
      />
      <DialogContent>
        <form action={onSubmit}>
          <DialogHeader>
            <DialogTitle>Thêm Đơn vị Mới</DialogTitle>
            <DialogDescription>
              Điền thông tin định danh cho đơn vị trực thuộc.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-[14px] px-5 py-[18px]">
            <div className="flex flex-col gap-[6px]">
              <Label htmlFor="code" className="text-[12px] font-medium">Mã Đơn vị (Duy nhất)</Label>
              <Input
                id="code"
                name="code"
                placeholder="VD: DV01, DVN_HCM"
                required
                className="font-mono"
              />
            </div>
            <div className="flex flex-col gap-[6px]">
              <Label htmlFor="name" className="text-[12px] font-medium">Tên Đơn vị</Label>
              <Input
                id="name"
                name="name"
                placeholder="VD: Chi nhánh Hồ Chí Minh"
                required
              />
            </div>
            {error && <p className="text-[11px] text-[#c0392b] bg-[#fdedec] p-3 rounded-[6px] border border-[#c0392b]/20">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>Hủy</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang lưu..." : "Lưu Đơn vị"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
