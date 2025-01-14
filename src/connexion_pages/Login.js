import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Importer le hook personnalisé
import MyImage from "../assets/illustration_reg.png"; // Assurez-vous que l'image est disponible

function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Si l'utilisateur est déjà authentifié, rediriger vers la page d'accueil
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); // Rediriger vers la page d'accueil après connexion
    }
  }, [isAuthenticated, navigate]);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false); // Etat pour "Se souvenir de moi"

  const handleManualLogin = async (e) => {
    e.preventDefault();
    try {
      // Utiliser la fonction login du contexte
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        navigate("/");
      } else {
        alert(`Erreur : ${result.error}`);
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    }
  };
  
  

 
  return (
    <div className="bg-[#080b13] text-gray-200 h-screen flex">
      {/* Section gauche */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 z-10">
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-6">Se connecter</h1>

          {/* Formulaire de connexion */}
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Entrez votre email"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm mb-1">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                placeholder="Entrez votre mot de passe"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            {/* Case à cocher "Se souvenir de moi" */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="w-4 h-4 text-blue-600 border-gray-600 rounded"
              />
              <label htmlFor="rememberMe" className="text-sm text-gray-300">
                Se souvenir de moi
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Connexion
            </button>
          </form>


          {/* Lien pour inscription */}
          <div className="text-center mt-4">
            <span className="text-gray-300">
              Pas encore de compte ?{" "}
              <a href="/register" className="text-blue-500 hover:text-blue-400">
                Inscrivez-vous
              </a>
            </span>
          </div>
        </div>
      </div>

      {/* Section droite */}
      <div className="flex-1 bg-blue-700 text-white flex flex-col justify-center items-center p-8 relative z-0">
        <img src={MyImage} alt="Illustration" className="w-3/4 max-w-sm mb-6" />
        <h2 className="text-3xl font-bold mb-4">Découvrez les avantages de notre plateforme</h2>
        <p className="text-gray-300 text-sm">
          Rejoignez des milliers d'utilisateurs qui utilisent notre plateforme pour gérer et créer des projets
          collaboratifs.
        </p>
        <p className="text-gray-300 text-sm mt-2">+15.7k utilisateurs satisfaits.</p>
      </div>
    </div>
  );
}

export default Login;
