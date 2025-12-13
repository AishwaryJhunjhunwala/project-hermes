import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import type { Role } from '@/types/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Require authentication - redirects to sign in if not authenticated
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect('/auth/signin');
  }
  return session;
}

/**
 * Get fresh user roles from database (avoids JWT cache issues)
 */
async function getFreshUserRoles(email: string): Promise<Role[]> {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
    with: {
      roles: true,
    },
  });

  if (!user) {
    return [];
  }

  return user.roles.map((r: { role: Role }) => r.role);
}

/**
 * Require user to have at least one of the allowed roles
 */
export async function requireRole(allowedRoles: Role[]) {
  const session = await requireAuth();

  // Always get fresh roles from database
  const freshRoles = await getFreshUserRoles(session.user.email!);

  // Check if user has at least one of the allowed roles
  const hasRequiredRole = freshRoles.some((role) => allowedRoles.includes(role));

  if (!hasRequiredRole) {
    redirect('/unauthorized');
  }

  // Return session with fresh roles
  return {
    ...session,
    user: {
      ...session.user,
      roles: freshRoles,
    },
  };
}

/**
 * Require user to have ALL specified roles
 */
export async function requireAllRoles(requiredRoles: Role[]) {
  const session = await requireAuth();

  // Always get fresh roles from database
  const freshRoles = await getFreshUserRoles(session.user.email!);

  // Check if user has all required roles
  const hasAllRoles = requiredRoles.every((role) => freshRoles.includes(role));

  if (!hasAllRoles) {
    redirect('/unauthorized');
  }

  // Return session with fresh roles
  return {
    ...session,
    user: {
      ...session.user,
      roles: freshRoles,
    },
  };
}

/**
 * Require admin role
 */
export async function requireAdmin() {
  return await requireRole(['admin']);
}

/**
 * Require investor role
 */
export async function requireInvestor() {
  return await requireRole(['investor', 'admin']);
}

/**
 * Require startup role
 */
export async function requireStartup() {
  return await requireRole(['startup', 'admin']);
}

/**
 * Require normal user role (any authenticated user)
 */
export async function requireUser() {
  return await requireRole(['normal_user', 'investor', 'startup', 'admin']);
}

/**
 * Non-redirecting version for checking access
 * Useful for conditional rendering or API responses
 */
export async function checkAccess(allowedRoles: Role[]) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { hasAccess: false, error: 'Not authenticated' };
    }

    const freshRoles = await getFreshUserRoles(session.user.email);
    const hasAccess = freshRoles.some((role) => allowedRoles.includes(role));

    return {
      hasAccess,
      roles: freshRoles,
      session: {
        ...session,
        user: {
          ...session.user,
          roles: freshRoles,
        },
      },
    };
  } catch (error) {
    console.error('checkAccess error:', error);
    return { hasAccess: false, error: 'Internal error' };
  }
}
