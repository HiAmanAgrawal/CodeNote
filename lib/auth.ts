import { type GetServerSidePropsContext } from 'next';
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/lib/email';
import { Role } from '@prisma/client';

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: Role;
    } & DefaultSession['user'];
  }

  interface User {
    role: Role;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user || !user.password) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          if (!user.isVerified) {
            throw new Error('Please verify your email before signing in');
          }

          if (!user.isActive) {
            throw new Error('Your account has been deactivated');
          }

          // Update last login
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          };
        } catch (error) {
          console.error('Database error during authentication:', error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      try {
        // Handle OAuth sign-ins
        if (account?.provider === 'google' || account?.provider === 'github') {
          // Check if user exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (existingUser) {
            // Update last login
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { 
                lastLogin: new Date(),
                isVerified: true, // OAuth users are automatically verified
              },
            });
          } else {
            // Create new user with OAuth data
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name!,
                image: user.image!,
                isVerified: true,
                role: Role.USER,
              },
            });
          }
        }

        return true;
      } catch (error) {
        console.error('Database error during OAuth sign-in:', error);
        return false;
      }
    },
  },
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
    error: '/auth/error',
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      if (isNewUser && account?.provider === 'credentials') {
        try {
          // Send verification email for new credential users
          await sendVerificationEmail(user.email!);
        } catch (error) {
          console.error('Failed to send verification email during sign-in:', error);
          // Don't fail the sign-in if email fails
        }
      }
    },
  },
  debug: process.env.NODE_ENV === 'development',
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext['req'] | Request;
  res?: GetServerSidePropsContext['res'];
}) => {
  if (ctx.req instanceof Request) {
    // App Router
    return getServerSession(authOptions);
  } else {
    // Pages Router
    return getServerSession(ctx.req, ctx.res!, authOptions);
  }
};

// Role-based access control helper
export const requireRole = (allowedRoles: Role[]) => {
  return (req: any, res: any, next: any) => {
    const userRole = req.session?.user?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};

// Admin-only middleware
export const requireAdmin = requireRole([Role.ADMIN]);

// User or admin middleware
export const requireAuth = requireRole(['USER', 'ADMIN']);