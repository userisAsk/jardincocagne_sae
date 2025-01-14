import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch(`http://localhost:4000/adherents/${user.id}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données.");
        }

        const data = await response.json();
        setProfileData(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les données du profil.");
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchProfileData();
    }
  }, [user?.id, isAuthenticated]);

  const handleEdit = () => {
    alert("Modification des données personnelles en cours...");
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 flex justify-center items-center min-h-screen">
        <div className="text-gray-700">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6 flex justify-center items-center min-h-screen">
        <div className="text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Mon Profil</h1>
          
          {profileData && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{profileData.email}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Nom</label>
                  <p className="text-gray-900">{profileData.name}</p>
                </div>
              </div>

              <button
                onClick={handleEdit}
                className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Modifier mes informations
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;