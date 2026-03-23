'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Lock, Unlock, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toggleOrganizationStatus, deleteOrganization } from "../actions"

export function OrganizationTable({ data }: { data: any[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[120px]">Mã Đơn vị</TableHead>
          <TableHead>Tên Đơn vị</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead>Ngày tạo</TableHead>
          <TableHead className="text-right">Hành động</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-12 text-[#a0b0be] italic">
              Chưa có đơn vị nào được tạo. Nhấn &quot;+ Thêm Đơn vị&quot; để bắt đầu.
            </TableCell>
          </TableRow>
        ) : (
          data.map((org) => (
            <TableRow key={org.id}>
              <TableCell className="font-mono font-medium text-[#5a7085]">{org.code}</TableCell>
              <TableCell className="font-medium">{org.name}</TableCell>
              <TableCell>
                {org.status === 'active' ? (
                  <Badge variant="success">Hoạt động</Badge>
                ) : (
                  <Badge variant="ghost">Đã khóa</Badge>
                )}
              </TableCell>
              <TableCell className="text-[#5a7085] tabular-nums">
                {new Date(org.created_at).toLocaleDateString('vi-VN')}
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
                    <DropdownMenuLabel>Tùy chọn</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => toggleOrganizationStatus(org.id, org.status)} className="cursor-pointer">
                      {org.status === 'active' ? <><Lock className="mr-2 h-4 w-4" /> Khóa đơn vị</> : <><Unlock className="mr-2 h-4 w-4" /> Mở khóa</>}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      if(confirm('Bạn có chắc chắn muốn xóa đơn vị này? Mọi thông tin báo cáo liên quan sẽ bị xóa sạch.')) {
                        deleteOrganization(org.id)
                      }
                    }} variant="destructive" className="cursor-pointer">
                      <Trash2 className="mr-2 h-4 w-4" /> Xóa
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
