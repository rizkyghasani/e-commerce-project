import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsLoggedIn(true);
        setUserName(decoded.name || decoded.email);
        setUserRole(decoded.role);
      } catch (error) {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUserName('');
        setUserRole('');
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    setIsLoggedIn(true);
    setUserName(decoded.name || decoded.email);
    setUserRole(decoded.role);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserName('');
    setUserRole('');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
