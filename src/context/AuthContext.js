// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
 const [isAuthenticated, setIsAuthenticated] = useState(false);
 const [user, setUser] = useState(null);


 


useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    setUser(user);
    setIsAuthenticated(true);
  }
}, []);


// AuthContext.js
const login = async (email, password) => {
  try {
    const response = await fetch('http://localhost:4000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Mettre à jour l'état immédiatement
      setUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(data.user));
      return { success: true };
    } else {
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    return { success: false, error: 'Erreur de connexion' };
  }
};


 const logout = () => {
  localStorage.removeItem("user");
  setIsAuthenticated(false);
  setUser(null);
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