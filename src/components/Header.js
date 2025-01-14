import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { isAuthenticated, logout, user } = useAuth(); // Gestion de l'authentification
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hidden, setHidden] = useState(false);
  const location = useLocation();

  // Détecter si on est sur la page "DeliveryManagement"
  const isDeliveryPage = location.pathname === '/delivery';

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
        isDeliveryPage ? 'bg-gray-800 text-white' : 'bg-transparent text-white'
      } py-4 fixed w-full top-0 z-50 transition-transform ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">Jardin de Cocagne</h1>
        </div>

        {/* Navigation */}
        <nav>
          <ul className="flex space-x-5">
            <li>
              <a href="/" className="hover:text-blue-400">
                Accueil
              </a>
            </li>
            {user?.admin === 1 && (
              <li>
                <a href="/transcribe" className="hover:text-blue-400">
                  Créer tournée livraison
                </a>
              </li>
            )}
            <li>
              <a href="/tarif" className="hover:text-blue-400">
                Tarif
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-blue-400">
                Contact
              </a>
            </li>
          </ul>
        </nav>

        {/* Boutons utilisateur */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {/* Lien vers le profil */}
              <a
                href="/profile"
                className="text-white hover:text-blue-400"
              >
                Mon compte
              </a>

              {/* Bouton déconnexion */}
              <button
                onClick={logout}
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              {/* Bouton connexion */}
              <a href="/login">
                <button className="bg-white text-[#68956b] py-2 px-4 rounded-full transition duration-300 ease-in-out hover:bg-[#68956b] hover:text-white">
                  Connexion
                </button>
              </a>

              {/* Bouton créer un compte */}
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
