import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MyImage from '../assets/bcc_cocagne.jpg';

function Hero() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleClick = () => {
    if (isAuthenticated) {
      navigate('/abonnement');
    } else {
      navigate('/register');
    }
  };

  return (
    <section
      className="relative text-center text-white min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${MyImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        marginTop: '-80px'
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-65"></div>
      <div className="relative container mx-auto px-4 pt-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-extrabold mb-6">
            Cultiver la terre, reconstruire des vies
          </h2>
          <p className="text-lg mb-8 bg-black bg-opacity-50 rounded-full p-4 inline-block">
            « La raison d'être des Jardins de Cocagne »
          </p>
          <div className="mt-4">
            <button
              onClick={handleClick}
              className="bg-white hover:bg-[#68956b] text-[#68956b] hover:text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg transition duration-300 inline-block"
            >
              Commencer
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;