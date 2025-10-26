import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, signInWithGoogle, isFirebaseConfigured } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

export type UserRole = 'admin' | 'farmer' | 'buyer' | null;

interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  farmerProfile?: {
    farmName?: string;
    farmSize?: string;
    location?: {
      address?: string;
      city?: string;
      state?: string;
      pincode?: string;
      coordinates?: { lat: number; lng: number };
    };
    crops?: string[];
    experience?: string;
    certifications?: string[];
    contactNumber?: string;
  };
  buyerProfile?: {
    businessName?: string;
    businessType?: 'individual' | 'retail' | 'wholesale' | 'restaurant' | 'cooperative';
    preferredProducts?: string[];
    deliveryAddress?: {
      address?: string;
      city?: string;
      state?: string;
      pincode?: string;
      coordinates?: { lat: number; lng: number };
    };
    gstNumber?: string;
  };
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

type ProfileData = Partial<User['farmerProfile'] | User['buyerProfile']>;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = 'http://localhost:3002/api';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored authentication tokens
    const checkAuthStatus = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (accessToken) {
        try {
          // Validate token with backend
          const response = await fetch(`${API_BASE_URL}/auth/verify`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            setIsAuthenticated(true);
          } else if (refreshToken) {
            // Try to refresh token
            const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ refreshToken }),
            });

            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();
              localStorage.setItem('accessToken', refreshData.accessToken);
              setUser(refreshData.user);
              setIsAuthenticated(true);
            } else {
              // Clear invalid tokens
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
            }
          }
        } catch (error) {
          console.error('Auth verification error:', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }

      // Fallback to demo authentication if no backend auth
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
    };

    checkAuthStatus();
  }, [setUser, setIsAuthenticated, setIsLoading]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      
      // Store tokens
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      // Set user data
      setUser(data.user);
      setIsAuthenticated(true);
      
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

  const register = async (name: string, email: string, password: string, role: UserRole = 'buyer', profileData?: ProfileData): Promise<boolean> => {
    try {
      const endpoint = role === 'farmer' ? '/auth/register/farmer' : '/auth/register/buyer';
      const requestBody = {
        name,
        email,
        password,
        ...(role === 'farmer' && profileData && { farmerProfile: profileData }),
        ...(role === 'buyer' && profileData && { buyerProfile: profileData })
      };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      
      // Store tokens
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      // Set user data
      setUser(data.user);
      setIsAuthenticated(true);
      
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
      // Call backend logout endpoint if needed
      const token = localStorage.getItem('accessToken');
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Clear authentication data
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('demoAuth');
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token || !user) return false;

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Profile update failed');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return false;

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        // Clear invalid tokens
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        setIsAuthenticated(false);
        return false;
      }

      const data = await response.json();
      localStorage.setItem('accessToken', data.accessToken);
      setUser(data.user);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      setIsAuthenticated(false);
      return false;
    }
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