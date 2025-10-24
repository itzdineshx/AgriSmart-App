import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, signInWithGoogle, isFirebaseConfigured } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

export type UserRole = 'admin' | 'seller' | 'user' | null;

interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  preferences?: {
    theme: string;
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
      weather: boolean;
      market: boolean;
    };
  };
  lastLogin?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  userRole: UserRole;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  isClerkUser: boolean;
  isLoading: boolean;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = 'http://localhost:3002/api';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase auth state changes - only if Firebase is configured
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          setFirebaseUser(firebaseUser);
          setIsAuthenticated(true);

          // Create a user object from Firebase user
          const userData: User = {
            _id: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            email: firebaseUser.email || '',
            role: 'user', // Default role, could be enhanced with custom claims
            avatar: firebaseUser.photoURL || undefined,
            createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
            lastLogin: firebaseUser.metadata.lastSignInTime || new Date().toISOString(),
          };

          setUser(userData);
        } else {
          setFirebaseUser(null);
          setUser(null);
          setIsAuthenticated(false);
        }
        setIsLoading(false);
      });

      return () => unsubscribe();
    } else {
      // Firebase not configured, set loading to false
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole = 'user'): Promise<boolean> => {
    if (!auth) {
      throw new Error('Firebase authentication is not configured.');
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Note: Display name will be set when user signs in
      // await userCredential.user.updateProfile({
      //   displayName: name,
      // });

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      await signInWithGoogle();
      return true;
    } catch (error) {
      console.error('Google login error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    try {
      if (!firebaseUser) return false;

      // Update Firebase profile if name is being updated
      if (data.name && firebaseUser) {
        // Note: Profile updates require Firebase configuration
        // await updateProfile(firebaseUser, {
        //   displayName: data.name,
        // });
      }

      // Update local user state
      setUser(prev => prev ? { ...prev, ...data } : null);
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    // Firebase handles token refresh automatically
    return true;
  };

  return (
    <AuthContext.Provider value={{
      user,
      firebaseUser,
      userRole: user?.role || null,
      isAuthenticated,
      login,
      register,
      loginWithGoogle,
      logout,
      isClerkUser: false,
      isLoading,
      updateProfile,
      refreshToken
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}