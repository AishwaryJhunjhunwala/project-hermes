export interface Member {
  id: number;
  name: string;
  year: number;
  memberType: 'EXECUTIVE' | 'CORE';
  designation?: string | null;
  role?: string | null;
  imageUrl: string;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  twitterUrl?: string | null;
  createdAt: Date;
}

export type MemberFormData = Omit<Partial<Member>, 'id' | 'createdAt'> & {
  name: string;
  year: number;
  memberType: 'EXECUTIVE' | 'CORE';
  imageUrl: string;
};
