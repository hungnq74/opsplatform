import { createClient } from '@/utils/supabase/server'
import { OrganizationTable } from './components/organization-table'
import { SetupOrganizationDialog } from './components/setup-organization-dialog'

export const dynamic = 'force-dynamic';

export default async function OrganizationsPage() {
  const supabase = await createClient()

  const { data: organizations } = await supabase
    .from('organizations')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-end">
        <SetupOrganizationDialog />
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] ring-1 ring-black/[0.05]">
        <OrganizationTable data={organizations || []} />
      </div>
    </div>
  )
}
