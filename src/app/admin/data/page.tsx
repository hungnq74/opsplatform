import { createClient } from '@/utils/supabase/server'
import { DataTable } from './components/data-table'

export const dynamic = 'force-dynamic';

export default async function AdminDataPage() {
  const supabase = await createClient()

  const { data: submissions } = await supabase
    .from('submissions')
    .select(`
      *,
      form:forms(name, version),
      organization:organizations(name, code),
      submitter:profiles(full_name)
    `)
    .order('submitted_at', { ascending: false })

  return (
    <div className="flex flex-col gap-[18px]">
      <div className="overflow-hidden rounded-[10px] bg-white" style={{ border: '1px solid #dde3ea' }}>
        <DataTable data={submissions || []} />
      </div>
    </div>
  )
}
