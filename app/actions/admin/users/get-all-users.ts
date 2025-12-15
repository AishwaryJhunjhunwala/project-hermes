'use server';

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq, ilike, or, and, count } from 'drizzle-orm';
import type { Role } from '@/types/auth';

export interface GetUsersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  roleFilter?: Role[];
  statusFilter?: 'banned' | 'active' | 'all';
}

export interface UserWithRoles {
  id: number;
  email: string;
  name: string;
  isBanned: boolean;
  createdAt: Date;
  updatedAt: Date;
  roles: { id: number; role: Role; createdAt: Date }[];
}

export interface GetUsersResponse {
  users: UserWithRoles[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export async function getAllUsers(params: GetUsersParams = {}): Promise<GetUsersResponse> {
  const { page = 1, pageSize = 10, search = '', roleFilter = [], statusFilter = 'all' } = params;

  const offset = (page - 1) * pageSize;

  // Build where conditions
  const conditions = [];

  // Search filter
  if (search) {
    conditions.push(or(ilike(users.email, `%${search}%`), ilike(users.name, `%${search}%`)));
  }

  // Status filter
  if (statusFilter === 'banned') {
    conditions.push(eq(users.isBanned, true));
  } else if (statusFilter === 'active') {
    conditions.push(eq(users.isBanned, false));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Get total count
  const [{ value: totalCount }] = await db
    .select({ value: count() })
    .from(users)
    .where(whereClause);

  // Get paginated users with roles
  const usersQuery = db.query.users.findMany({
    where: whereClause,
    with: {
      roles: true,
    },
    limit: pageSize,
    offset: offset,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  });

  let allUsers = await usersQuery;

  // Filter by roles if specified
  if (roleFilter.length > 0) {
    allUsers = allUsers.filter((user) =>
      user.roles.some((userRole) => roleFilter.includes(userRole.role))
    );
  }

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    users: allUsers,
    totalCount,
    totalPages,
    currentPage: page,
  };
}
