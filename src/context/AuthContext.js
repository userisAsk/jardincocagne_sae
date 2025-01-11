// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
 const [isAuthenticated, setIsAuthenticated] = useState(false);
 const [user, setUser] = useState(null);



 const login = async (email, password, rememberMe) => {
   try {
     const response = await fetch('http://localhost:4000/login', {
       method: 'POST',
       credentials: 'include',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ email, password, rememberMe })
     });

     const data = await response.json();

     if (response.ok) {
       setUser(data.user);
       setIsAuthenticated(true);
       return { success: true };
     } else {
       return { success: false, error: data.error };
     }
   } catch (error) {
     console.error('Login error:', error);
     return { success: false, error: 'Erreur de connexion' };
   }
 };

 const logout = async () => {
   try {
     await fetch('http://localhost:4000/logout', {
       method: 'GET',
       credentials: 'include'
     });
     setIsAuthenticated(false);
     setUser(null);
     window.location.href = '/login';
   } catch (error) {
     console.error('Logout error:', error);
   }
 };

 return (
   <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
     {children}
   </AuthContext.Provider>
 );
}

export function useAuth() {
 return React.useContext(AuthContext);
}