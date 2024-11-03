import { User as FirebaseUser } from 'firebase/auth';

export interface User {
  id: string;
  email: string | null;
  username: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  createdAt: string;
  lastLogin?: string;
}

export type UserRole = 'super_admin' | 'admin' | 'teacher' | 'nurse' | 'parent' | 'student';

export interface AuthContextType {
  currentUser: FirebaseUser | null;
  userRole: UserRole | null;
  tempUser: FirebaseUser | null;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  googleSignIn: () => Promise<{ newUser: boolean; user: FirebaseUser }>;
  completeRegistration: (user: FirebaseUser, selectedRole: UserRole) => Promise<void>;
}

export interface RoleRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export interface PrivateRouteProps {
  children: React.ReactNode;
} 