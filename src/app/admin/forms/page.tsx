import { createClient } from '@/utils/supabase/server'
import { FormsTable } from './components/forms-table'
import { CreateFormDialog } from './components/create-form-dialog'

export const dynamic = 'force-dynamic';

export default async function FormsPage() {
  const supabase = await createClient()

  const { data: forms } = await supabase
    .from('forms')
    .select(`
      *,
      creator:profiles(full_name)
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-end">
        <CreateFormDialog />
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] ring-1 ring-black/[0.05]">
        <FormsTable data={forms || []} />
      </div>
    </div>
  )
}
