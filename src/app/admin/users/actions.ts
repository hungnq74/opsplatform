'use server'

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createUser(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const orgId = formData.get('organizationId') as string
  const role = formData.get('role') as string

  if (!email || !password || !fullName || !orgId) return { error: "Vui lòng điền đầy đủ thông tin" }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { error: "Hệ thống thiếu biến môi trường SUPABASE_SERVICE_ROLE_KEY để thực hiện quyền Admin. Vui lòng cấu hình file .env.local" }
  }

  // Khởi tạo Supabase client admin để bypass RLS
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  // 1. Tạo user trong auth.users
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      role: role
    }
  })

  if (authError) {
    return { error: "Lỗi tạo tài khoản Auth: " + authError.message }
  }

  // 2. Cập nhật record ở bảng public.profiles (trigger thường tạo tự động, ta update thêm orgId)
  if (authData.user) {
    const { error: profileError } = await supabaseAdmin.from('profiles').update({
      organization_id: orgId === 'none' ? null : orgId,
      full_name: fullName,
      role: role
    }).eq('id', authData.user.id)
    
    if (profileError) {
      return { error: "Lỗi cập nhật Profile: " + profileError.message }
    }
  }

  revalidatePath('/admin/users')
  return { success: true }
}

export async function deleteUser(id: string) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return { error: "Thiếu cấu hình SUPABASE_SERVICE_ROLE_KEY" }
  
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
  
  const { error } = await supabaseAdmin.auth.admin.deleteUser(id)
  if (error) return { error: error.message }
  
  revalidatePath('/admin/users')
  return { success: true }
}
