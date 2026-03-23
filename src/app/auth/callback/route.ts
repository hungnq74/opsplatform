import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // --- SAFETY NET: Đảm bảo Profile luôn tồn tại ---
        // Đôi khi Trigger DB bị chậm hoặc lỗi, ta chủ động upsert ở đây.
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle()

        if (!profile && !profileError) {
          // Chưa có profile -> Tạo mới mặc định là 'user'
          await supabase.from('profiles').insert({
            id: user.id,
            full_name: user.user_metadata.full_name || user.email?.split('@')[0],
            role: 'user'
          })
        }

        // Điều hướng dựa trên role (giờ đã chắc chắn có profile)
        if (profile?.role === 'admin') {
          return NextResponse.redirect(`${origin}/admin`)
        } else {
          return NextResponse.redirect(`${origin}/portal`)
        }
      }
    }
  }

  // Nếu process code lỗi hoặc bị null
  return NextResponse.redirect(`${origin}/login?message=Xác nhận tài khoản Google bị từ chối hoặc lỗi`)
}
