import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  
  // Vérifier si c'est une route admin protégée
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    // Vérifier l'authentification
    if (!req.auth) {
      console.log('❌ Middleware: No auth found, redirecting to login');
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    
    // Vérifier le rôle admin (case insensitive)
    const userRole = req.auth.user?.role?.toLowerCase();
    if (userRole !== 'admin') {
      console.log('❌ Middleware: User role is not admin:', userRole);
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    
    console.log('✅ Middleware: Auth OK, role:', userRole);
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/admin/dashboard/:path*',
    '/admin/menu/:path*',
    '/admin/categories/:path*',
    '/admin/orders/:path*',
    '/admin/settings/:path*',
  ],
}; 