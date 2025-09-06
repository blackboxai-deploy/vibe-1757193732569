'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserStatus } from '@/types/user';
import { MOCK_USER_CREDENTIALS, DEFAULT_AVATAR_URL } from '@/lib/constants';
import { soundManager } from '@/lib/soundManager';
import { NotificationEvent } from '@/types/messenger';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUserStatus: (status: UserStatus) => void;
  updatePersonalMessage: (message: string) => void;
  updateDisplayName: (name: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('msn_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('msn_user');
      }
    }
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('msn_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('msn_user');
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simple credential validation
    if (email === MOCK_USER_CREDENTIALS.email && password === MOCK_USER_CREDENTIALS.password) {
      const newUser: User = {
        id: 'current-user',
        email: email,
        displayName: MOCK_USER_CREDENTIALS.displayName,
        personalMessage: MOCK_USER_CREDENTIALS.personalMessage,
        avatar: DEFAULT_AVATAR_URL,
        status: UserStatus.ONLINE,
        lastSeen: new Date()
      };

      setUser(newUser);
      setIsAuthenticated(true);

      // Initialize sound manager on successful login
      try {
        await soundManager.initializeSoundsOnUserAction();
        await soundManager.playSound(NotificationEvent.LOGIN);
      } catch (error) {
        console.warn('Could not initialize sounds:', error);
      }

      return { success: true };
    } else {
      return { 
        success: false, 
        error: 'Email o contraseña incorrectos. Usa: usuario@hotmail.com / 123456' 
      };
    }
  };

  const logout = () => {
    // Play logout sound before logging out
    if (soundManager.isAudioEnabled()) {
      soundManager.playSound(NotificationEvent.LOGOUT);
    }

    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('msn_user');
    localStorage.removeItem('msn_chat_windows');
    localStorage.removeItem('msn_contacts');
  };

  const updateUserStatus = (status: UserStatus) => {
    if (user) {
      const updatedUser = {
        ...user,
        status,
        lastSeen: status === UserStatus.OFFLINE ? new Date() : user.lastSeen
      };
      setUser(updatedUser);
    }
  };

  const updatePersonalMessage = (message: string) => {
    if (user) {
      const updatedUser = {
        ...user,
        personalMessage: message
      };
      setUser(updatedUser);
    }
  };

  const updateDisplayName = (name: string) => {
    if (user) {
      const updatedUser = {
        ...user,
        displayName: name
      };
      setUser(updatedUser);
    }
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    updateUserStatus,
    updatePersonalMessage,
    updateDisplayName
  };

  return (
    <AuthContext.Provider value={contextValue}>
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