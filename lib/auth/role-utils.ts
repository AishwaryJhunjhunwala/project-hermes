import type { Role } from '@/types/auth';

/**
 * Check if user has at least one of the allowed roles
 */
export function hasRole(userRoles: Role[], allowedRoles: Role[]): boolean {
  return userRoles.some((role) => allowedRoles.includes(role));
}

/**
 * Check if user has all required roles
 */
export function hasAllRoles(userRoles: Role[], requiredRoles: Role[]): boolean {
  return requiredRoles.every((role) => userRoles.includes(role));
}

/**
 * Check if user is admin
 */
export function isAdmin(userRoles: Role[]): boolean {
  return userRoles.includes('admin');
}

/**
 * Check if user is investor
 */
export function isInvestor(userRoles: Role[]): boolean {
  return userRoles.includes('investor');
}

/**
 * Check if user is startup
 */
export function isStartup(userRoles: Role[]): boolean {
  return userRoles.includes('startup');
}

/**
 * Check if user is normal user
 */
export function isNormalUser(userRoles: Role[]): boolean {
  return userRoles.includes('normal_user');
}

/**
 * Get highest priority role (for display purposes)
 * Priority: admin > investor > startup > normal_user
 */
export function getPrimaryRole(userRoles: Role[]): Role {
  if (userRoles.includes('admin')) return 'admin';
  if (userRoles.includes('investor')) return 'investor';
  if (userRoles.includes('startup')) return 'startup';
  return 'normal_user';
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: Role): string {
  const displayNames: Record<Role, string> = {
    admin: 'Administrator',
    investor: 'Investor',
    startup: 'Startup',
    normal_user: 'User',
  };
  return displayNames[role];
}
