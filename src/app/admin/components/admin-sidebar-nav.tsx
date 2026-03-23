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
    <nav className="flex-1 overflow-auto px-2 py-3 space-y-0.5">
      {navItems.map((item) => {
        const active = isActive(item.href, item.exact)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-150 ${
              active
                ? 'bg-white/[0.1] text-white'
                : 'text-[#8b9eb7] hover:bg-white/[0.06] hover:text-white'
            }`}
          >
            {active && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full bg-[#3b82f6]" />
            )}
            <item.icon className={`h-4 w-4 shrink-0 transition-colors duration-150 ${
              active ? 'text-[#60a5fa]' : 'text-[#4e6680] group-hover:text-[#8b9eb7]'
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
      className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-150 ${
        active
          ? 'bg-white/[0.1] text-white'
          : 'text-[#8b9eb7] hover:bg-white/[0.06] hover:text-white'
      }`}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full bg-[#3b82f6]" />
      )}
      <Settings className={`h-4 w-4 shrink-0 transition-colors duration-150 ${
        active ? 'text-[#60a5fa]' : 'text-[#4e6680] group-hover:text-[#8b9eb7]'
      }`} />
      Cài đặt
    </Link>
  )
}
