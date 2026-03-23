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
    <div className="flex flex-col gap-[18px]">
      <div className="flex items-center justify-end">
        <CreateFormDialog />
      </div>

      <div className="overflow-hidden rounded-[10px] bg-white" style={{ border: '1px solid #dde3ea' }}>
        <FormsTable data={forms || []} />
      </div>
    </div>
  )
}
