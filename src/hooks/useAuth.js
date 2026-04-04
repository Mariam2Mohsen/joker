import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const active = localStorage.getItem('currentUser');
    if (active) setUser(JSON.parse(active));
  }, []);

  const logout = () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/joker_website/login';
  };

  return { user, isLoggedIn: !!user, logout };
};