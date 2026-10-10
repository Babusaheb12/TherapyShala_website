import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MOCK_USER_PROFILE } from '../data/spaData';
import { OWNER_TOKEN_KEY } from '../services/apiClient';
import { getSpaOwnerProfile } from '../services/spaOwner.service';

const AuthContext = createContext(null);

const STORAGE_KEY = 'therapyshala_auth_user';
const OWNER_STORAGE_KEY = 'therapyshala_owner_user';

export function AuthProvider({ children }) {
  // Customer User State
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Spa Owner State
  const [ownerToken, setOwnerToken] = useState(() => {
    try {
      return localStorage.getItem(OWNER_TOKEN_KEY) || null;
    } catch {
      return null;
    }
  });

  const [ownerProfile, setOwnerProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(OWNER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Sync Customer User to storage
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } catch (e) {
        console.error('Failed to save user session', e);
      }
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  // Sync Owner Profile & Token to storage
  useEffect(() => {
    if (ownerToken) {
      try {
        localStorage.setItem(OWNER_TOKEN_KEY, ownerToken);
      } catch (e) {
        console.error('Failed to save owner token', e);
      }
    } else {
      localStorage.removeItem(OWNER_TOKEN_KEY);
    }
  }, [ownerToken]);

  useEffect(() => {
    if (ownerProfile) {
      try {
        localStorage.setItem(OWNER_STORAGE_KEY, JSON.stringify(ownerProfile));
      } catch (e) {
        console.error('Failed to save owner profile', e);
      }
    } else {
      localStorage.removeItem(OWNER_STORAGE_KEY);
    }
  }, [ownerProfile]);

  // Refresh Owner Profile
  const refreshOwnerProfile = useCallback(async () => {
    const token = localStorage.getItem(OWNER_TOKEN_KEY);
    if (!token) return null;
    try {
      const res = await getSpaOwnerProfile();
      if (res?.success && res?.data) {
        setOwnerProfile(res.data);
        return res.data;
      }
    } catch (err) {
      console.warn('Failed to refresh owner profile', err);
      if (err?.status === 401) {
        logoutOwner();
      }
    }
    return null;
  }, []);

  // Listen for unauthorized 401 events on owner APIs
  useEffect(() => {
    const handleUnauthorized = () => {
      logoutOwner();
    };
    window.addEventListener('owner:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('owner:unauthorized', handleUnauthorized);
  }, []);

  // Hydrate fresh owner profile on mount only if not already loaded from storage
  useEffect(() => {
    if (ownerToken && !ownerProfile) {
      refreshOwnerProfile();
    }
  }, [ownerToken]);

  // Owner Auth Methods
  const loginOwner = (token, profile) => {
    setOwnerToken(token);
    setOwnerProfile(profile);
    try {
      localStorage.setItem(OWNER_TOKEN_KEY, token);
      if (profile) {
        localStorage.setItem(OWNER_STORAGE_KEY, JSON.stringify(profile));
      }
    } catch (e) {
      console.error('Failed to persist owner auth', e);
    }
  };

  const logoutOwner = () => {
    setOwnerToken(null);
    setOwnerProfile(null);
    localStorage.removeItem(OWNER_TOKEN_KEY);
    localStorage.removeItem(OWNER_STORAGE_KEY);
  };

  // Customer Auth Methods
  const login = (userData) => {
    const fullUser = {
      id: userData.id || `user_${Date.now()}`,
      name: userData.name || 'Valued Guest',
      email: userData.email || 'guest@therapyshala.com',
      phone: userData.phone || '+91 98765 43210',
      role: userData.role || 'customer',
      tier: userData.tier || 'VIP Gold Member',
      avatar: userData.avatar || null,
      token: userData.token || `auth_token_${Date.now()}`,
      createdAt: userData.createdAt || new Date().toISOString()
    };
    setUser(fullUser);
    return fullUser;
  };

  const loginWithDemo = () => {
    return login({
      id: 'usr-demo-1',
      name: MOCK_USER_PROFILE.name,
      email: MOCK_USER_PROFILE.email,
      phone: MOCK_USER_PROFILE.phone,
      tier: MOCK_USER_PROFILE.tier,
      role: 'customer'
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateProfile = (fields) => {
    setUser((prev) => (prev ? { ...prev, ...fields } : prev));
  };

  return (
    <AuthContext.Provider
      value={{
        // Customer auth
        user,
        isAuthenticated: !!user,
        login,
        loginWithDemo,
        logout,
        updateProfile,

        // Owner auth
        ownerToken,
        ownerProfile,
        isOwnerAuthenticated: !!ownerToken,
        loginOwner,
        logoutOwner,
        refreshOwnerProfile,
        setOwnerProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;

