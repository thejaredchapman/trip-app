import React, { createContext, useContext, useState, useCallback } from 'react';
import { TRAVELERS, Traveler } from '../data/tripData';

interface AuthContextType {
  currentUser: Traveler | null;
  isAuthenticated: boolean;
  login: (travelerId: string, code: string) => boolean;
  logout: () => void;
  canEdit: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
  canEdit: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Traveler | null>(null);

  const login = useCallback((travelerId: string, code: string): boolean => {
    const traveler = TRAVELERS.find((t) => t.id === travelerId);
    if (!traveler) return false;

    const validCodes = [
      traveler.confirmationCode,
      traveler.returnConfirmationCode,
    ].filter(Boolean);

    if (validCodes.includes(code.toUpperCase().trim())) {
      setCurrentUser(traveler);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        logout,
        canEdit: !!currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
