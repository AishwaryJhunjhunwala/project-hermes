'use server';

import { db } from '@/lib/db';
import { members } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function getMembers(year?: number | null) {
  if (year) {
    const rows = await db.query.members.findMany({
      where: eq(members.year, year),
      orderBy: (m, { asc }) => [asc(m.role)],
    });
    return rows;
  }

  const rows = await db.query.members.findMany({
    orderBy: (m, { desc, asc }) => [desc(m.year), asc(m.role)],
  });

  return rows;
}

export async function getAvailableYears() {
  const rows = await db.query.members.findMany({
    columns: { year: true },
  });

  const years = Array.from(new Set(rows.map((r) => r.year))).sort((a, b) => b - a);

  return years;
}
