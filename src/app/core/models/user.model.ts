export type UserRole = 'visitor' | 'designer';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  emailVerified: boolean;
}

