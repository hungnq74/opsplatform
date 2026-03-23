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
    <div className="flex flex-col gap-5">
      <div className="overflow-hidden rounded-xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] ring-1 ring-black/[0.05]">
        <DataTable data={submissions || []} />
      </div>
    </div>
  )
}
