import { User as FirebaseUser } from 'firebase/auth';

export interface User {
  id: string;
  email: string | null;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  firebaseUser: FirebaseUser;
}

export type UserRole = 'admin' | 'teacher' | 'nurse';

export interface AuthContextType {
  currentUser: FirebaseUser | null;
  userRole: UserRole | null;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  googleSignIn: () => Promise<any>;
}

export interface RoleRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export interface PrivateRouteProps {
  children: React.ReactNode;
} 