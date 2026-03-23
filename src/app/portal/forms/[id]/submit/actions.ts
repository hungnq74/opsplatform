'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitFormData(formId: string, formVersion: number, payload: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn." }

  const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single()
  
  if (!profile?.organization_id) {
    return { error: "Tài khoản của bạn chưa được cấp phát cho Đơn vị cụ thể nào. Vui lòng liên hệ Admin của hệ thống." }
  }

  // Check if already submitted
  const { count } = await supabase.from('submissions')
    .select('*', { count: 'exact', head: true })
    .eq('form_id', formId)
    .eq('organization_id', profile.organization_id)
    
  if (count && count > 0) {
    return { error: "Đơn vị của bạn đã nộp báo cáo cho biểu mẫu này rồi!" }
  }

  // Insert submission
  const { error } = await supabase.from('submissions').insert({
    form_id: formId,
    form_version: formVersion,
    organization_id: profile.organization_id,
    submitted_by: user.id,
    data: payload,
    status: 'submitted'
  })

  if (error) {
    console.error("Lỗi insert Submission:", error)
    return { error: "Đã xảy ra lỗi hệ thống: " + error.message }
  }
  
  // Xóa cache màn hình Dashboard và History
  revalidatePath('/portal/history')
  revalidatePath('/portal')
  
  return { success: true }
}
