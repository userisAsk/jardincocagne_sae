import React, { useState } from "react";
import MyImage from "../assets/illustration_reg.png";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [passwordHint, setPasswordHint] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = async (email) => {
    if (!email) {
      setErrors((prev) => ({ ...prev, email: "L'email est requis." }));
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.exists) {
        setErrors((prev) => ({ ...prev, email: "Cet email est déjà utilisé." }));
      } else {
        setErrors((prev) => ({ ...prev, email: "" }));
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de l'email :", error);
      setErrors((prev) => ({
        ...prev,
        email: "Erreur lors de la vérification. Réessayez plus tard."
      }));
    }
  };

  const handlePasswordChange = (password) => {
    setFormData((prev) => ({ ...prev, password }));

    if (password.length >= 8) {
      setPasswordHint(
        <span className="text-green-500">
          <i className="fa-solid fa-check"></i> Longueur suffisante.
        </span>
      );
    } else {
      setPasswordHint(
        <span className="text-red-400">
          <i className="fa-solid fa-xmark"></i> Mot de passe trop court, 8 caractères requis.
        </span>
      );
    }
  };

  const handleManualRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validation
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis.";
    }
    if (formData.password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères.";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Inscription réussie !");
        navigate("/");
      } else {
        setErrors((prev) => ({
          ...prev,
          global: data.error || "Une erreur est survenue."
        }));
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      setErrors((prev) => ({
        ...prev,
        global: "Erreur de connexion. Veuillez réessayer."
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#080b13] text-gray-200 h-screen flex flex-col">
      <div className="flex flex-1 relative">
        {/* Section gauche */}
        <div className="flex-1 flex flex-col justify-center items-center px-8 z-10">
          <div className="max-w-md w-full">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Votre meilleur travail commence ici
            </h2>

            <div className="flex items-center justify-between my-6">
              <hr className="flex-1 border-gray-600" />
              <span className="text-sm text-gray-500 mx-4">ou</span>
              <hr className="flex-1 border-gray-600" />
            </div>

            <form onSubmit={handleManualRegister}>
              {/* Nom */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm mb-2">
                  Nom
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Entrez votre nom"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                {errors.name && <div className="text-sm text-red-400 mt-1">{errors.name}</div>}
              </div>

              {/* Email */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Entrez votre email"
                  className={`w-full px-4 py-2 rounded-lg bg-gray-700 text-white border ${
                    errors.email ? "border-red-500" : "border-gray-600"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    validateEmail(e.target.value);
                  }}
                  required
                />
                {errors.email && <div className="text-sm text-red-400 mt-1">{errors.email}</div>}
              </div>

              {/* Mot de passe */}
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm mb-2">
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Créez un mot de passe"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  required
                />
                <div className="text-sm mt-1">{passwordHint}</div>
              </div>

              {/* Confirmation de mot de passe */}
              <div className="mb-4">
                <label htmlFor="confirm-password" className="block text-sm mb-2">
                  Confirmez le mot de passe
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirmez votre mot de passe"
                  className={`w-full px-4 py-2 rounded-lg bg-gray-700 text-white border ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-600"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  required
                />
                {errors.confirmPassword && (
                  <div className="text-sm text-red-400 mt-1">{errors.confirmPassword}</div>
                )}
              </div>

              {/* Message global */}
              {errors.global && (
                <div className="mb-4 text-sm text-red-400">
                  <i className="fa-solid fa-xmark"></i> {errors.global}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Création en cours..." : "Créer un compte"}
              </button>
            </form>
            <div className="text-center">
              <span className="text-gray-300 mt-4">
                Déjà un compte ?{" "}
                <a href="/login" className="text-blue-500 hover:text-blue-400">
                  Login
                </a>
              </span>
            </div>
          </div>
        </div>

        {/* Section droite */}
        <div className="flex-1 bg-blue-700 text-white flex flex-col justify-center items-center p-8 relative z-0">
          <img src={MyImage} alt="Illustration" className="w-3/4 max-w-sm mb-6" />
          <h2 className="text-3xl font-bold mb-4">
            Explorez les meilleurs portfolios design
          </h2>
          <p className="text-gray-300 text-sm">
            Découvrez des millions de designers et agences du monde entier qui
            utilisent Flowbite pour partager leurs projets.
          </p>
          <p className="text-gray-300 text-sm mt-2">+15.7k utilisateurs satisfaits.</p>
        </div>
      </div>
    </div>
  );
}

export default Register;