'use server';

import { db } from '@/lib/db';
import { members } from '@/lib/db/schema';
import { eq, ilike, and, count } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/role-guards';
import type { Member, MemberFormData } from '@/types/member';

interface GetMembersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  year?: number | null;
  memberType?: 'EXECUTIVE' | 'CORE' | 'all';
}

export interface GetMembersResponse {
  members: Member[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export async function getAllMembers(params: GetMembersParams = {}): Promise<GetMembersResponse> {
  await requireAdmin();

  const { page = 1, pageSize = 10, search = '', year = null, memberType = 'all' } = params;
  const offset = (page - 1) * pageSize;

  const conditions: unknown[] = [];

  if (search) {
    conditions.push(ilike(members.name, `%${search}%`));
  }

  if (year) {
    conditions.push(eq(members.year, year));
  }

  if (memberType && memberType !== 'all') {
    conditions.push(eq(members.memberType, memberType));
  }

  // `and` expects typed expressions; cast locally and suppress explicit any rule for this line
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const whereClause = conditions.length > 0 ? and(...(conditions as any)) : undefined;

  const [{ value: totalCount }] = await db
    .select({ value: count() })
    .from(members)
    .where(whereClause);

  const allMembers = await db.query.members.findMany({
    where: whereClause,
    limit: pageSize,
    offset,
    orderBy: (m, { desc: d }) => [d(m.createdAt)],
  });

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    members: allMembers,
    totalCount,
    totalPages,
    currentPage: page,
  };
}

export async function getMemberById(memberId: number) {
  await requireAdmin();

  const member = await db.query.members.findFirst({ where: eq(members.id, memberId) });

  if (!member) {
    return { success: false, error: 'Member not found' };
  }

  return { success: true, member };
}

export async function createMember(data: MemberFormData) {
  await requireAdmin();

  try {
    if (!data.name?.trim()) {
      return { success: false, error: 'Name is required' };
    }

    if (!data.imageUrl?.trim()) {
      return { success: false, error: 'Image URL is required' };
    }

    const [newMember] = await db
      .insert(members)
      .values({
        name: data.name,
        year: data.year,
        memberType: data.memberType,
        designation: data.designation ?? null,
        role: data.role ?? null,
        imageUrl: data.imageUrl,
        linkedinUrl: data.linkedinUrl ?? null,
        githubUrl: data.githubUrl ?? null,
        twitterUrl: data.twitterUrl ?? null,
      })
      .returning();

    revalidatePath('/dashboard/admin');

    return { success: true, member: newMember };
  } catch (error) {
    console.error('Error creating member:', error);
    return { success: false, error: 'Failed to create member' };
  }
}

export async function updateMember(memberId: number, data: MemberFormData) {
  await requireAdmin();

  try {
    const [updated] = await db
      .update(members)
      .set({
        name: data.name,
        year: data.year,
        memberType: data.memberType,
        designation: data.designation ?? null,
        role: data.role ?? null,
        imageUrl: data.imageUrl,
        linkedinUrl: data.linkedinUrl ?? null,
        githubUrl: data.githubUrl ?? null,
        twitterUrl: data.twitterUrl ?? null,
        // updatedAt is handled by DB $onUpdate
      })
      .where(eq(members.id, memberId))
      .returning();

    if (!updated) {
      return { success: false, error: 'Member not found' };
    }

    revalidatePath('/dashboard/admin');

    return { success: true, member: updated };
  } catch (error) {
    console.error('Error updating member:', error);
    return { success: false, error: 'Failed to update member' };
  }
}

export async function deleteMember(memberId: number) {
  await requireAdmin();

  try {
    await db.delete(members).where(eq(members.id, memberId));
    revalidatePath('/dashboard/admin');
    return { success: true };
  } catch (error) {
    console.error('Error deleting member:', error);
    return { success: false, error: 'Failed to delete member' };
  }
}
