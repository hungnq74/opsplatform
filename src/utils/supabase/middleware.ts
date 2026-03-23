import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // --- LOGIC PHÂN QUYỀN & REDIRECT ---
  const { pathname } = request.nextUrl
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/setup')
  const isPublicPage = pathname === '/' || pathname.startsWith('/auth')

  if (!user && !isAuthPage && !isPublicPage) {
    // 1. Chưa đăng nhập + cố vào trang bảo mật -> Redirect Login
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isAuthPage) {
    // 2. Đã đăng nhập + cố vào trang Login -> Redirect về Dashboard tương ứng
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
    const url = request.nextUrl.clone()
    url.pathname = profile?.role === 'admin' ? '/admin' : '/portal'
    return NextResponse.redirect(url)
  }

  // Nếu User vào các trang /admin mà không phải Admin, hoặc /portal mà không phải User?
  // Tạm thời ta để layout handle tiếp cho đơn giản, hoặc check thêm ở đây.

  return supabaseResponse
}
