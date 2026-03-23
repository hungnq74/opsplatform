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

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f4f6f8]">
      {/* Header NavBar */}
      <header className="sticky top-0 z-30 flex h-[61px] items-center gap-4 border-b border-[#dde3ea] bg-white px-4 sm:px-6">
        <Link href="/portal" className="flex items-center gap-[10px] mr-6">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-navy)]">
            <Building2 className="h-4 w-4 text-white" />
          </div>
          <span className="text-[13px] font-bold text-[var(--color-navy)]">Ops Platform</span>
        </Link>
        <nav className="hidden sm:flex flex-1 items-center gap-6 text-[12px] font-medium">
          <Link href="/portal" className="flex items-center gap-2 text-[var(--color-navy)] transition-colors">
            <FileEdit className="h-4 w-4" /> Báo cáo định kỳ
          </Link>
          <Link href="/portal/history" className="flex items-center gap-2 text-[#5a7085] hover:text-[#1c2b3a] transition-colors">
            <History className="h-4 w-4" /> Lịch sử đã nộp
          </Link>
        </nav>
        <div className="flex items-center gap-4 ml-auto">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[12px] font-medium text-[#1c2b3a]">{profile?.full_name}</span>
            <span className="text-[11px] text-[#5a7085]">{profile?.organization?.name || 'Chưa thuộc đơn vị'}</span>
          </div>
          <form action={handleLogout}>
            <button type="submit" className="p-2 text-[#5a7085] hover:bg-[#f4f6f8] hover:text-[#c0392b] rounded-[6px] transition-colors duration-150" title="Đăng xuất">
              <LogOut className="h-5 w-5" />
            </button>
          </form>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 px-6 py-5 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  )
}
