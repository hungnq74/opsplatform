'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createForm(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  
  if (!name) return { error: "Tên Form là bắt buộc" }

  const { data, error } = await supabase.from('forms').insert({
    name,
    description,
    created_by: user?.id,
    status: 'draft'
  }).select('id').single()
  
  if (error) return { error: error.message }
  
  // Tránh việc cache ở các list cũ
  revalidatePath('/admin/forms')
  // Trả về id để redirect sang trang builder
  return { success: true, formId: data.id }
}

export async function publishForm(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('forms').update({ status: 'published' }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/forms')
  return { success: true }
}

export async function deleteForm(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('forms').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/forms')
  return { success: true }
}
