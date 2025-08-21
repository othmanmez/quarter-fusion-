import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    // Vérifier si l'utilisateur est admin
    if (req.nextauth.token?.role !== 'admin') {
      return Response.redirect(new URL('/admin/login', req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/admin/dashboard/:path*',
    '/admin/menu/:path*',
    '/admin/categories/:path*',
    '/admin/orders/:path*',
    '/admin/delivery/:path*',
    '/admin/settings/:path*',
  ],
}; 