export type Role = 'admin' | 'investor' | 'startup' | 'normal_user';

export interface UserRole {
  id: number;
  userId: number;
  role: Role;
  createdAt: Date;
}

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  roles: Role[];
}

export interface ExtendedSession {
  user: AuthUser;
  expires: string;
}
