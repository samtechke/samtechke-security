import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login successful!');
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};