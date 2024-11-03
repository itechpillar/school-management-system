import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { auth, db } from '../config/firebase';
import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { AuthContextType, UserRole } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  async function getUserRole(uid: string): Promise<UserRole | null> {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data().role as UserRole;
    }
    return null;
  }

  async function login(email: string, password: string) {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const role = await getUserRole(result.user.uid);
    setUserRole(role);
    return result;
  }

  async function googleSignIn() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const role = await getUserRole(result.user.uid);
    if (!role) {
      await setDoc(doc(db, 'users', result.user.uid), {
        email: result.user.email,
        role: 'teacher' as UserRole,
        id: result.user.uid,
        firebaseUser: result.user
      });
      setUserRole('teacher');
    } else {
      setUserRole(role);
    }
    return result;
  }

  function logout(): Promise<void> {
    setUserRole(null);
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const role = await getUserRole(user.uid);
        setUserRole(role);
      } else {
        setUserRole(null);
      }
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userRole,
    login,
    logout,
    googleSignIn
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 