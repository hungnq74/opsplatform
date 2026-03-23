'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download, Eye } from "lucide-react"
import * as XLSX from 'xlsx'

export function DataTable({ data }: { data: any[] }) {
  const handleExport = () => {
    const exportData = data.map(sub => {
      const flatData: Record<string, any> = {
        'Mã Đơn vị': sub.organization?.code,
        'Tên Đơn vị': sub.organization?.name,
        'Biểu mẫu': sub.form?.name,
        'Người nộp': sub.submitter?.full_name,
        'Ngày nộp': new Date(sub.submitted_at).toLocaleString('vi-VN'),
        'Trạng thái': sub.status,
      }

      if (sub.data && typeof sub.data === 'object') {
        Object.keys(sub.data).forEach(key => {
          flatData[`Giá trị (${key})`] = sub.data[key]
        })
      }
      return flatData
    })

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tong hop")
    XLSX.writeFile(workbook, `TongHieuDuLieu_${new Date().toISOString().slice(0,10)}.xlsx`)
  }

  return (
    <div>
      <div className="px-[18px] py-[13px] border-b border-[#f0f3f6] flex justify-end">
        <Button onClick={handleExport} variant="outline" disabled={data.length === 0} style={{ borderColor: '#8e44ad', color: '#8e44ad' }}>
          <Download className="mr-2 h-4 w-4" /> Xuất Excel
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Đơn vị nộp</TableHead>
            <TableHead>Biểu mẫu</TableHead>
            <TableHead>Lời khai (Data)</TableHead>
            <TableHead>Thời gian nộp</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12 text-[#a0b0be] italic">
                Chưa có dữ liệu báo cáo nào được ghi nhận trên hệ thống.
              </TableCell>
            </TableRow>
          ) : (
            data.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell>
                  <div className="font-medium">{sub.organization?.name}</div>
                  <div className="text-[11px] text-[#5a7085] font-mono mt-0.5">{sub.organization?.code}</div>
                </TableCell>
                <TableCell className="font-medium">
                  {sub.form?.name}
                </TableCell>
                <TableCell>
                  <div className="text-[12px] text-[#5a7085] truncate max-w-[250px] bg-[#f4f6f8] px-2 py-1 rounded-[4px] font-mono">
                    {JSON.stringify(sub.data)}
                  </div>
                </TableCell>
                <TableCell className="text-[#5a7085]">
                  {new Date(sub.submitted_at).toLocaleDateString('vi-VN')} <span className="text-[11px]">{new Date(sub.submitted_at).toLocaleTimeString('vi-VN')}</span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-primary hover:bg-accent font-medium">
                    <Eye className="mr-2 h-4 w-4" /> Chi tiết
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
