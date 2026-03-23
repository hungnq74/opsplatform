'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Trash2, UserCog } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { deleteUser } from "../actions"

export function UsersTable({ data }: { data: any[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Họ và tên</TableHead>
          <TableHead>Trực thuộc Đơn vị</TableHead>
          <TableHead>Vai trò</TableHead>
          <TableHead>Ngày tạo</TableHead>
          <TableHead className="text-right">Hành động</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-12 text-[#a0b0be] italic">
              Chưa có tài khoản nào trong hệ thống.
            </TableCell>
          </TableRow>
        ) : (
          data.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.full_name || 'Admin root'}</TableCell>
              <TableCell className="text-[#5a7085]">
                {user.organization?.name || <span className="text-[#a0b0be] italic">Quản trị Hệ thống</span>}
              </TableCell>
              <TableCell>
                {user.role === 'admin' ? (
                  <Badge variant="info">Quản trị viên</Badge>
                ) : (
                  <Badge variant="secondary">Người dùng</Badge>
                )}
              </TableCell>
              <TableCell className="text-[#5a7085] tabular-nums">
                {new Date(user.created_at).toLocaleDateString('vi-VN')}
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
                    <DropdownMenuLabel>Tùy chọn tài khoản</DropdownMenuLabel>
                    <DropdownMenuItem className="cursor-pointer">
                      <UserCog className="mr-2 h-4 w-4" /> Đổi mật khẩu
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      if(confirm('Chắc chắn muốn xóa tài khoản này? Sẽ không thể hoàn tác!')) {
                        deleteUser(user.id)
                      }
                    }} variant="destructive" className="cursor-pointer">
                      <Trash2 className="mr-2 h-4 w-4" /> Xóa tài khoản
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
