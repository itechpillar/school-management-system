import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { auth, db, googleProvider } from '../config/firebase';
import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
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
  const [tempUser, setTempUser] = useState<FirebaseUser | null>(null);

  async function getUserRole(uid: string): Promise<UserRole | null> {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data().role as UserRole;
    }
    return null;
  }

  async function googleSignIn() {
    const result = await signInWithPopup(auth, googleProvider);
    const role = await getUserRole(result.user.uid);
    
    if (!role) {
      // Store the user temporarily until role is selected
      setTempUser(result.user);
      return { newUser: true, user: result.user };
    }
    
    // Update last login for existing users
    await setDoc(doc(db, 'users', result.user.uid), {
      lastLogin: new Date().toISOString()
    }, { merge: true });
    
    setUserRole(role);
    return { newUser: false, user: result.user };
  }

  async function completeRegistration(user: FirebaseUser, selectedRole: UserRole) {
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      role: selectedRole,
      id: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    });
    setUserRole(selectedRole);
    setTempUser(null);
  }

  async function login(email: string, password: string) {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const role = await getUserRole(result.user.uid);
    setUserRole(role);
    return result;
  }

  function logout(): Promise<void> {
    setUserRole(null);
    setTempUser(null);
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const role = await getUserRole(user.uid);
        setUserRole(role);
      }
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userRole,
    tempUser,
    login,
    logout,
    googleSignIn,
    completeRegistration
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 