import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from "../assets/cocagne-vert.png";

function Header() {
  const { isAuthenticated, logout } = useAuth();
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hidden, setHidden] = useState(false);
  const location = useLocation();

  const HeaderBcPages = ['/delivery', '/calendrier', '/abonnement', '/profile'];
  const isHeaderbcPage = HeaderBcPages.includes(location.pathname);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <header
      className={`${
        isHeaderbcPage ? 'bg-gray-800 text-white' : 'bg-transparent text-white'
      } py-4 fixed w-full top-0 z-50 transition-transform ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="logo" className="h-10 w-10" />
          <h1 className="text-2xl font-bold">Jardin de Cocagne</h1>
        </div>

        <nav>
          <ul className="flex space-x-5">
            <li>
              <a href="/" className="hover:text-blue-400">
                Accueil
              </a>
            </li>
            <li>
              <a href="/delivery" className="hover:text-blue-400">
                Créer tournée livraison
              </a>
            </li>
            <li>
              <a href="/calendrier" className="hover:text-blue-400">
                Créer un Calendrier
              </a>
            </li>
            <li>
              <a href="/abonnement" className="hover:text-blue-400">
                Abonnement
              </a>
            </li>
          </ul>
        </nav>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <a
                href="/profile"
                className="text-white hover:text-blue-400"
              >
                Mon compte
              </a>
              <button
                onClick={logout}
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <a href="/login">
                <button className="bg-white text-[#68956b] py-2 px-4 rounded-full transition duration-300 ease-in-out hover:bg-[#68956b] hover:text-white">
                  Connexion
                </button>
              </a>
              <a href="/register">
                <button className="bg-white text-[#68956b] py-2 px-4 rounded-full transition duration-300 ease-in-out hover:bg-[#68956b] hover:text-white">
                  Créer un compte
                </button>
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;