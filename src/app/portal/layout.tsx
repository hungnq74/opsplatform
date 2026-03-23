import Link from 'next/link'
import { Building2, FileEdit, LogOut, History } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function UserPortalLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase.from('profiles').select('*, organization:organizations(name)').eq('id', user.id).single()

  if (profile?.role !== 'user') {
    // Ensure admins do not use this interface by mistake (or let them view it anyway)
    // redirect('/admin')
  }

  const handleLogout = async () => {
    'use server'
    const logoutClient = await createClient()
    await logoutClient.auth.signOut()
    redirect('/login')
  }

  const initial = profile?.full_name?.charAt(0)?.toUpperCase() || 'U'

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f1f5f9]">
      {/* Header NavBar */}
      <header className="sticky top-0 z-30 flex h-[57px] items-center gap-4 border-b border-[#e2e8f0] bg-white px-6">
        <Link href="/portal" className="flex items-center gap-2.5 mr-6">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2563eb]">
            <Building2 className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-[14px] font-semibold text-[#0f172a] tracking-tight">Ops Platform</span>
        </Link>

        <nav className="hidden sm:flex flex-1 items-center gap-1 text-[13px] font-medium">
          <Link href="/portal" className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[#2563eb] bg-[#eff6ff] transition-colors">
            <FileEdit className="h-3.5 w-3.5" /> Báo cáo định kỳ
          </Link>
          <Link href="/portal/history" className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[#64748b] hover:bg-[#f8fafc] hover:text-[#334155] transition-colors">
            <History className="h-3.5 w-3.5" /> Lịch sử đã nộp
          </Link>
        </nav>

        <div className="flex items-center gap-3 ml-auto">
          <div className="hidden sm:flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] text-white text-xs font-semibold">
              {initial}
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[12px] font-medium text-[#0f172a] leading-tight">{profile?.full_name}</span>
              <span className="text-[11px] text-[#94a3b8] leading-tight">{profile?.organization?.name || 'Chưa thuộc đơn vị'}</span>
            </div>
          </div>
          <form action={handleLogout}>
            <button type="submit" className="flex h-8 w-8 items-center justify-center rounded-lg text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#ef4444] transition-colors" title="Đăng xuất">
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 px-6 py-6 max-w-5xl mx-auto w-full">
        {children}
      </main>
    </div>
  )
}
