import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { FormBuilderClient } from './components/form-builder-client'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic';

export default async function FormBuilderPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: form } = await supabase.from('forms').select('*').eq('id', params.id).single()

  if (!form) redirect('/admin/forms')

  const { data: fields } = await supabase
    .from('form_fields')
    .select('*')
    .eq('form_id', params.id)
    .order('display_order', { ascending: true })

  return (
    <div className="flex flex-col gap-[18px] w-full max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/forms" className="p-2 bg-white border border-[#e2e8f0] hover:bg-[#f8fafc] rounded-[6px] transition-colors">
          <ArrowLeft className="h-5 w-5 text-[#475569]" />
        </Link>
        <div>
          <h1 className="text-[19px] font-bold text-[#0f172a]">Thiết kế: {form.name}</h1>
          <p className="text-[12px] text-[#64748b] mt-[3px]">{form.description || 'Không có mô tả'}</p>
        </div>
      </div>

      <FormBuilderClient form={form} initialFields={fields || []} />
    </div>
  )
}
