'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Trash2, Send, Edit } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { deleteForm, publishForm } from "../actions"
import Link from "next/link"

export function FormsTable({ data }: { data: any[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Tên Biểu mẫu</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead>Người tạo</TableHead>
          <TableHead>Cập nhật lúc</TableHead>
          <TableHead className="text-right">Hành động</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-12 text-[#a0b0be] italic">
              Chưa có biểu mẫu nào được tạo. Nhấn &quot;+ Tạo Biểu mẫu&quot; để bắt đầu thiết kế.
            </TableCell>
          </TableRow>
        ) : (
          data.map((form) => (
            <TableRow key={form.id}>
              <TableCell>
                <div className="font-medium">{form.name}</div>
                <div className="text-[11px] text-[#a0b0be] mt-1 truncate max-w-[280px]">{form.description}</div>
              </TableCell>
              <TableCell>
                {form.status === 'published' ? (
                  <Badge variant="success">Đang phát hành</Badge>
                ) : form.status === 'draft' ? (
                  <Badge variant="secondary">Bản nháp</Badge>
                ) : (
                  <Badge variant="ghost">Đã lưu trữ</Badge>
                )}
              </TableCell>
              <TableCell className="text-[#5a7085]">
                {form.creator?.full_name || 'Hệ thống'}
              </TableCell>
              <TableCell className="text-[#5a7085] tabular-nums">
                {new Date(form.updated_at).toLocaleDateString('vi-VN')} {new Date(form.updated_at).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="ghost" size="icon-sm">
                        <span className="sr-only">Tùy chọn</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Tùy chọn biểu mẫu</DropdownMenuLabel>
                    <Link href={`/admin/forms/${form.id}/builder`} passHref>
                      <DropdownMenuItem className="cursor-pointer">
                        <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa / Cấu hình
                      </DropdownMenuItem>
                    </Link>
                    {form.status !== 'published' && (
                      <DropdownMenuItem onClick={() => {
                        if(confirm('Phát hành biểu mẫu này cho các đơn vị điền?')) {
                          publishForm(form.id)
                        }
                      }} className="cursor-pointer text-[#27ae60]">
                        <Send className="mr-2 h-4 w-4" /> Phát hành
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => {
                      if(confirm('Xóa biểu mẫu sẽ xóa toàn bộ các trường nhập liệu và các bản ghi đã gửi của đơn vị. Bạn có chắc không?')) {
                        deleteForm(form.id)
                      }
                    }} variant="destructive" className="cursor-pointer">
                      <Trash2 className="mr-2 h-4 w-4" /> Xóa biểu mẫu
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
