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
    <div className="flex flex-col gap-[18px]">
      <div className="flex items-center justify-end">
        <SetupOrganizationDialog />
      </div>

      <div className="overflow-hidden rounded-[10px] bg-white" style={{ border: '1px solid #dde3ea' }}>
        <OrganizationTable data={organizations || []} />
      </div>
    </div>
  )
}
