import { createClient } from '@/utils/supabase/server'
import { UsersTable } from './components/users-table'
import { SetupUserDialog } from './components/setup-user-dialog'

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const supabase = await createClient()

  const { data: profiles } = await supabase
    .from('profiles')
    .select(`
      *,
      organization:organizations(name)
    `)
    .order('created_at', { ascending: false })

  const { data: organizations } = await supabase
    .from('organizations')
    .select('id, name')
    .eq('status', 'active')

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-end">
        <SetupUserDialog organizations={organizations || []} />
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] ring-1 ring-black/[0.05]">
        <UsersTable data={profiles || []} />
      </div>
    </div>
  )
}
