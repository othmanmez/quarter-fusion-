import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  
  // Vérifier si c'est une route admin protégée
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    // Vérifier l'authentification
    if (!req.auth) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    
    // Vérifier le rôle admin
    if (req.auth.user?.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/admin/((?!login|api).*)' // Toutes les routes admin sauf /admin/login et /admin/api
  ],
}; 