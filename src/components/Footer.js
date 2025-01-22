import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-white py-4 px-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-sm mb-3 md:mb-0">
          © 2025 Jardin de cocagne. Tous droits réservés.
        </div>
        <div className="flex gap-6">
          <a href="#" className="text-white hover:text-gray-300 transition-colors">
            Facebook
          </a>
          <a href="#" className="text-white hover:text-gray-300 transition-colors">
            Twitter
          </a>
          <a href="#" className="text-white hover:text-gray-300 transition-colors">
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
