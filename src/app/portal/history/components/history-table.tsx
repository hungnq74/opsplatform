'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

export function HistoryTable({ data }: { data: any[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Tên Biểu mẫu</TableHead>
          <TableHead>Tóm tắt Dữ liệu kê khai</TableHead>
          <TableHead className="w-[180px]">Ngày gửi</TableHead>
          <TableHead className="w-[150px]">Trạng thái</TableHead>
          <TableHead className="text-right">Hành động</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-12 text-[#a0b0be] italic">
              Chưa có dữ liệu. Đơn vị của bạn chưa gửi báo cáo nào.
            </TableCell>
          </TableRow>
        ) : (
          data.map((sub) => (
            <TableRow key={sub.id}>
              <TableCell className="font-medium">
                {sub.form?.name}
              </TableCell>
              <TableCell>
                <div className="text-[12px] text-[#5a7085] truncate max-w-[400px] bg-[#f4f6f8] px-2 py-1 rounded-[4px] font-mono">
                  {JSON.stringify(sub.data).substring(0, 100)}...
                </div>
              </TableCell>
              <TableCell className="text-[#5a7085] tabular-nums">
                {new Date(sub.submitted_at).toLocaleDateString('vi-VN')} <span className="text-[11px]">{new Date(sub.submitted_at).toLocaleTimeString('vi-VN')}</span>
              </TableCell>
              <TableCell>
                <Badge variant="success">Đã tiếp nhận</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" className="text-primary hover:bg-accent font-medium whitespace-nowrap">
                  <Eye className="mr-2 h-4 w-4" /> Xem chi tiết
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
