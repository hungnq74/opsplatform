import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { DynamicForm } from './components/dynamic-form'
import { ArrowLeft, FileText } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic';

export default async function SubmitFormPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single()

  const { data: form } = await supabase.from('forms').select('*').eq('id', params.id).single()
  if (!form || form.status !== 'published') redirect('/portal')

  const { data: fields } = await supabase
    .from('form_fields')
    .select('*')
    .eq('form_id', params.id)
    .order('display_order', { ascending: true })

  const { data: existing } = await supabase.from('submissions')
    .select('id')
    .eq('form_id', params.id)
    .eq('organization_id', profile?.organization_id)
    .single()

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-[18px] w-full pb-12">
      <div className="flex items-start gap-4">
        <Link href="/portal" className="p-2 bg-white border border-[#dde3ea] hover:bg-[#f4f6f8] rounded-[6px] transition-colors mt-1">
          <ArrowLeft className="h-5 w-5 text-[#5a7085]" />
        </Link>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="info">Cần thực hiện</Badge>
          </div>
          <h1 className="text-[19px] font-bold text-[#1c2b3a] leading-tight">{form.name}</h1>
          <p className="text-[12px] text-[#7f8fa0] mt-2 leading-relaxed">{form.description}</p>
        </div>
      </div>

      {existing ? (
        <div className="bg-[#fef9e7] border border-[#f39c12]/20 p-8 rounded-[10px] text-center">
          <FileText className="h-16 w-16 text-[#f39c12] mx-auto mb-4" />
          <h3 className="text-[16px] font-bold text-[#1c2b3a] mb-2">Đơn vị của bạn đã nộp báo cáo này</h3>
          <p className="text-[12px] text-[#5a7085] mb-8 max-w-md mx-auto">Dữ liệu đã được ghi nhận an toàn trên hệ thống. Bạn có thể xem lại trong thẻ Lịch sử.</p>
          <Link href="/portal/history">
            <button className="px-6 py-3 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-[6px] text-[13px] font-semibold transition-colors duration-150">
              Xem lại dữ liệu đã gửi
            </button>
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-[#dde3ea] rounded-[10px] overflow-hidden p-6 sm:p-8">
          <DynamicForm formId={form.id} formVersion={form.version} fields={fields || []} />
        </div>
      )}
    </div>
  )
}
