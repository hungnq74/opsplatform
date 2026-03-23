import Link from 'next/link'
import { Building2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { AdminTopBar } from './components/admin-topbar'
import { AdminSidebarNav, AdminSettingsNav } from './components/admin-sidebar-nav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase.from('profiles').select('role, full_name').eq('id', user.id).single()

  const handleLogout = async () => {
    'use server'
    const logoutClient = await createClient()
    await logoutClient.auth.signOut()
    redirect('/login')
  }

  const initial = profile?.full_name?.charAt(0)?.toUpperCase() || 'A'

  return (
    <div className="flex min-h-screen w-full bg-[#f8fafc]">
      {/* Sidebar — 240px */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-[#e2e8f0] bg-white sm:flex">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-[#e2e8f0]">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1e3a5f] shadow-sm">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <span className="text-[15px] font-bold text-[#0f172a] tracking-tight">Ops Platform</span>
          </Link>
        </div>

        {/* Navigation */}
        <AdminSidebarNav />

        {/* Footer */}
        <div className="border-t border-[#e2e8f0] p-3">
          <AdminSettingsNav />
          {/* User row */}
          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 mt-1">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#2563eb] text-white text-xs font-semibold shadow-sm">
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium text-[#0f172a] truncate">
                {profile?.full_name || 'Admin'}
              </div>
              <form action={handleLogout}>
                <button type="submit" className="text-xs text-[#94a3b8] hover:text-[#ef4444] transition-colors cursor-pointer">
                  Đăng xuất
                </button>
              </form>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col sm:pl-60">
        {/* Topbar */}
        <AdminTopBar />

        {/* Content */}
        <main className="flex-1 px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  )
}
