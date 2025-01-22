import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from "../assets/cocagne-vert.png";

function Header() {
  const { isAuthenticated, logout, user } = useAuth();
  
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hidden, setHidden] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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

  const handleNavigation = (path) => {
    if (!isAuthenticated && ['/delivery', '/calendrier', '/abonnement'].includes(path)) {
      navigate('/register');
      return;
    }

    if (['/delivery', '/calendrier'].includes(path) && !user?.admin) {
      alert('Accès réservé aux administrateurs.');
      return;
    }
    navigate(path);
  };

  

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
              <button 
                onClick={() => navigate('/')} 
                className="hover:text-blue-400"
              >
                Accueil
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavigation('/delivery')} 
                className="hover:text-blue-400"
              >
                Créer tournée livraison
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavigation('/calendrier')} 
                className="hover:text-blue-400"
              >
                Créer un Calendrier
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavigation('/abonnement')} 
                className="hover:text-blue-400"
              >
                Abonnement
              </button>
            </li>
          </ul>
        </nav>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => navigate('/profile')}
                className="text-white hover:text-blue-400"
              >
                Mon compte
              </button>
              <button
                onClick={logout}
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => navigate('/login')}
                className="bg-white text-[#68956b] py-2 px-4 rounded-full transition duration-300 ease-in-out hover:bg-[#68956b] hover:text-white"
              >
                Connexion
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="bg-white text-[#68956b] py-2 px-4 rounded-full transition duration-300 ease-in-out hover:bg-[#68956b] hover:text-white"
              >
                Créer un compte
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;