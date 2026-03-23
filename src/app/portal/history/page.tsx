import { createClient } from '@/utils/supabase/server'
import { HistoryTable } from './components/history-table'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single()

  const { data: submissions } = await supabase
    .from('submissions')
    .select(`
      *,
      form:forms(name)
    `)
    .eq('organization_id', profile?.organization_id)
    .order('submitted_at', { ascending: false })

  return (
    <div className="flex flex-col gap-[18px]">
      <div>
        <h1 className="text-[19px] font-bold text-[#1c2b3a]">Lịch sử Báo cáo</h1>
        <p className="text-[12px] text-[#7f8fa0] mt-[3px]">Xem lại các biểu mẫu và dữ liệu mà Đơn vị của bạn đã nộp</p>
      </div>

      <div className="overflow-hidden rounded-[10px] border border-[#dde3ea] bg-white">
        <HistoryTable data={submissions || []} />
      </div>
    </div>
  )
}
