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
  demoLogin: (username: string, password: string, role: UserRole) => boolean;
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
      // Firebase not configured, check for demo authentication
      const demoAuth = localStorage.getItem('demoAuth');
      if (demoAuth) {
        try {
          const { user: demoUser, authenticated } = JSON.parse(demoAuth);
          if (authenticated && demoUser) {
            setUser(demoUser);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Error parsing demo auth:', error);
          localStorage.removeItem('demoAuth');
        }
      }
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

  const demoLogin = (username: string, password: string, role: UserRole): boolean => {
    // Demo credentials for role-based authentication
    const demoCredentials = {
      admin: { username: 'admin_agri', password: 'AgriAdmin@2024' },
      seller: { username: 'seller_pro', password: 'SellPro@2024' },
      user: { username: 'farmer_user', password: 'FarmUser@2024' }
    };

    const roleCredentials = demoCredentials[role as keyof typeof demoCredentials];
    if (roleCredentials && username === roleCredentials.username && password === roleCredentials.password) {
      // Create a demo user object
      const demoUser: User = {
        _id: `demo_${role}_${Date.now()}`,
        name: `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
        email: `${role}@demo.agri`,
        role: role,
        avatar: undefined,
        preferences: {
          theme: 'light',
          language: 'en',
          notifications: {
            email: true,
            push: true,
            weather: true,
            market: true
          }
        },
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      setUser(demoUser);
      setIsAuthenticated(true);
      localStorage.setItem('demoAuth', JSON.stringify({ user: demoUser, authenticated: true }));
      return true;
    }
    return false;
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
    // Clear demo authentication
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('demoAuth');
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
      demoLogin,
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