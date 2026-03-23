'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Building2, LayoutDashboard, Settings, Users, FileText, Database } from 'lucide-react'

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Tổng quan', exact: true },
  { href: '/admin/organizations', icon: Building2, label: 'Đơn vị' },
  { href: '/admin/users', icon: Users, label: 'Tài khoản' },
  { href: '/admin/forms', icon: FileText, label: 'Biểu mẫu' },
  { href: '/admin/data', icon: Database, label: 'Dữ liệu thu thập' },
]

export function AdminSidebarNav() {
  const pathname = usePathname()

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <nav className="flex-1 overflow-auto px-3 py-4 space-y-1">
      {navItems.map((item) => {
        const active = isActive(item.href, item.exact)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-200 ${
              active
                ? 'bg-[#eff6ff] text-[#1e3a5f]'
                : 'text-[#64748b] hover:bg-[#f8fafc] hover:text-[#334155]'
            }`}
          >
            <item.icon className={`h-[18px] w-[18px] transition-colors duration-200 ${
              active ? 'text-[#2563eb]' : 'text-[#94a3b8] group-hover:text-[#64748b]'
            }`} />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

export function AdminSettingsNav() {
  const pathname = usePathname()
  const active = pathname === '/admin/settings'

  return (
    <Link
      href="/admin/settings"
      className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-200 ${
        active
          ? 'bg-[#eff6ff] text-[#1e3a5f]'
          : 'text-[#64748b] hover:bg-[#f8fafc] hover:text-[#334155]'
      }`}
    >
      <Settings className={`h-[18px] w-[18px] transition-colors duration-200 ${
        active ? 'text-[#2563eb]' : 'text-[#94a3b8] group-hover:text-[#64748b]'
      }`} />
      Cài đặt
    </Link>
  )
}
