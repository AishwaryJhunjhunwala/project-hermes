'use server';

import { db } from '@/lib/db';
import { users, userRoles } from '@/lib/db/schema';
import { hashPassword } from '@/utils/password';
import { eq } from 'drizzle-orm';

export async function signUpAction(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!name || !email || !password) {
      return { error: 'All fields are required' };
    }

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return { error: 'User with this email already exists' };
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
      })
      .returning();

    // Assign default role (normal_user)
    await db.insert(userRoles).values({
      userId: newUser.id,
      role: 'normal_user',
    });

    return { success: true, userId: newUser.id };
  } catch (error) {
    console.error('Sign up error:', error);
    return { error: 'Failed to create account. Please try again.' };
  }
}
