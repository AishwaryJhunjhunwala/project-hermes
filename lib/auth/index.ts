import NextAuth, { NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import Credentials from 'next-auth/providers/credentials';
import { db } from '../db/index';
import { comparePassword } from '@/utils/password';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import type { Role } from '@/types/auth';

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Find user
        const user = await db.query.users.findFirst({
          where: eq(users.email, email),
          with: {
            roles: true,
          },
        });

        if (!user) {
          return null;
        }

        // Check if user is banned
        if (user.isBanned) {
          throw new Error('Your account has been banned. Please contact support.');
        }

        // Verify password
        const isValidPassword = await comparePassword(password, user.password);
        if (!isValidPassword) {
          return null;
        }

        // Return user with roles
        return {
          id: String(user.id),
          email: user.email,
          name: user.name,
          roles: user.roles.map((r: { role: Role }) => r.role),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.roles = user.roles;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = Number(token.id);
        session.user.roles = token.roles as Role[];
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

export const auth = () => getServerSession(authOptions);
