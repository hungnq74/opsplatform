'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createOrganization(formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const code = formData.get('code') as string
  
  if (!name || !code) return { error: "Mã và Tên Đơn vị là bắt buộc" }

  const { error } = await supabase.from('organizations').insert({
    name,
    code,
    status: 'active'
  })
  
  if (error) {
    if (error.code === '23505') return { error: "Mã Đơn vị này đã tồn tại!" }
    return { error: error.message }
  }
  
  revalidatePath('/admin/organizations')
  return { success: true }
}

export async function toggleOrganizationStatus(id: string, currentStatus: string) {
  const supabase = await createClient()
  const newStatus = currentStatus === 'active' ? 'locked' : 'active'
  
  const { error } = await supabase.from('organizations').update({ status: newStatus }).eq('id', id)
  if (error) return { error: error.message }
  
  revalidatePath('/admin/organizations')
  return { success: true }
}

export async function deleteOrganization(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('organizations').delete().eq('id', id)
  if (error) return { error: error.message }
  
  revalidatePath('/admin/organizations')
  return { success: true }
}
