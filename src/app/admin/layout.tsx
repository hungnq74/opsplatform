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
    <div className="flex min-h-screen w-full bg-[#f1f5f9]">
      {/* Sidebar — 240px dark */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col bg-[#0f172a] sm:flex">
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-[57px] border-b border-white/[0.07]">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2563eb]">
              <Building2 className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-[14px] font-semibold text-white tracking-tight">Ops Platform</span>
          </Link>
        </div>

        {/* Navigation */}
        <AdminSidebarNav />

        {/* Footer */}
        <div className="border-t border-white/[0.07] px-2 py-3 space-y-0.5">
          <AdminSettingsNav />
          {/* User row */}
          <div className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 mt-1">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] text-white text-xs font-semibold">
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-medium text-[#e2e8f0] truncate leading-tight">
                {profile?.full_name || 'Admin'}
              </div>
              <form action={handleLogout}>
                <button type="submit" className="text-[11px] text-[#4e6680] hover:text-[#f87171] transition-colors cursor-pointer leading-tight mt-0.5">
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
        <main className="flex-1 px-7 py-6">
          {children}
        </main>
      </div>
    </div>
  )
}
