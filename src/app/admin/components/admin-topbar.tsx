'use client'

import { usePathname } from 'next/navigation'

const routeTitles: Record<string, { title: string; subtitle?: string }> = {
  '/admin': { title: 'Tổng quan', subtitle: 'Theo dõi hoạt động nộp báo cáo và quản lý Đơn vị' },
  '/admin/organizations': { title: 'Quản lý Đơn vị', subtitle: 'Danh sách các đơn vị trực thuộc hệ thống' },
  '/admin/users': { title: 'Tài khoản Người dùng', subtitle: 'Quản lý tài khoản người dùng hệ thống' },
  '/admin/forms': { title: 'Biểu mẫu Báo cáo', subtitle: 'Quản lý các biểu mẫu thu thập dữ liệu' },
  '/admin/data': { title: 'Dữ liệu thu thập', subtitle: 'Xem và xuất dữ liệu báo cáo đã nộp' },
  '/admin/settings': { title: 'Cài đặt', subtitle: 'Cấu hình hệ thống' },
}

export function AdminTopBar() {
  const pathname = usePathname()

  const matchedRoute = routeTitles[pathname] ||
    Object.entries(routeTitles)
      .filter(([key]) => pathname.startsWith(key) && key !== '/admin')
      .sort(([a], [b]) => b.length - a.length)[0]?.[1] ||
    routeTitles['/admin']

  return (
    <header className="sticky top-0 z-20 flex h-[57px] items-center px-7 bg-white border-b border-[#e2e8f0]">
      <div className="flex-1">
        <h1 className="text-[15px] font-semibold text-[#0f172a] leading-tight">
          {matchedRoute.title}
        </h1>
        {matchedRoute.subtitle && (
          <p className="text-[12px] text-[#94a3b8] mt-0.5 leading-tight">
            {matchedRoute.subtitle}
          </p>
        )}
      </div>
    </header>
  )
}
