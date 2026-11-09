import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    // Even without Supabase configured, protect admin routes
    const isDashboardRoute = request.nextUrl.pathname.startsWith('/admin') && 
                              !request.nextUrl.pathname.startsWith('/admin/login');
    if (isDashboardRoute) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    return supabaseResponse;
  }

  const supabase = createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, { ...options, maxAge: 3153600000 })
          );
        },
      },
      cookieOptions: {
        maxAge: 3153600000,
      },
    }
  );

  // Refresh user session by checking Supabase auth
  const { data: { user } } = await supabase.auth.getUser();

  // If trying to access admin dashboard (except login) and user is not authenticated, redirect to login
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/admin') && 
                            !request.nextUrl.pathname.startsWith('/admin/login');

  if (isDashboardRoute && !user) {
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If user is logged in and tries to go to login page, redirect them to dashboard
  if (request.nextUrl.pathname.startsWith('/admin/login') && user) {
    const dashUrl = new URL('/admin/dashboard', request.url);
    return NextResponse.redirect(dashUrl);
  }

  return supabaseResponse;
}
