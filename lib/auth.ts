import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

// Force Node.js runtime to avoid Edge Runtime issues with bcrypt
export const runtime = 'nodejs';

// Schema de validation pour les credentials
const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          // Validation des credentials
          const validatedCredentials = credentialsSchema.safeParse(credentials);
          
          if (!validatedCredentials.success) {
            console.log('Invalid credentials format');
            return null;
          }

          const { email, password } = validatedCredentials.data;

          // Recherche de l'utilisateur en base
          const user = await prisma.user.findUnique({
            where: { 
              email: email.toLowerCase(),
              active: true 
            }
          });

          if (!user) {
            console.log('User not found:', email);
            return null;
          }

          // Vérification du mot de passe
          const isPasswordValid = await bcrypt.compare(password, user.password);
          
          if (!isPasswordValid) {
            console.log('Invalid password for:', email);
            return null;
          }

          // Vérification du rôle admin
          if (user.role !== 'ADMIN') {
            console.log('User is not admin:', email);
            return null;
          }

          return {
            id: user.id,
            name: user.name || 'Administrator',
            email: user.email,
            role: user.role.toLowerCase(),
          };

        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 heures
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
});

// Type pour la session étendue
declare module 'next-auth' {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }
  interface JWT {
    role?: string;
  }
}