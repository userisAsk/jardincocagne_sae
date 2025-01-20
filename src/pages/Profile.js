// Profile.js
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { AlertCircle, User, Phone, MapPin, Mail, Check, X, Edit2 } from "lucide-react";

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedFields, setEditedFields] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) return;
      try {
        const response = await fetch(`http://localhost:4000/adherents/${user.id}`, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données.");
        }

        const data = await response.json();
        setProfileData(data);
        setEditedFields(data);
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
    setIsEditing(true);
    setEditedFields({ ...profileData });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedFields(profileData);
    setError(null);
    setUpdateSuccess(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedFields(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getChangedFields = () => {
    const changes = {};
    Object.keys(editedFields).forEach(key => {
      // Ne prend que les champs qui ont été réellement modifiés et non vides
      if (editedFields[key] !== profileData[key] && editedFields[key] !== "") {
        changes[key] = editedFields[key];
      }
    });
    return changes;
  };

  const handleSave = async () => {
    try {
      setError(null);
      setUpdateSuccess(false);
      
      const changedFields = getChangedFields();
      if (Object.keys(changedFields).length === 0) {
        setIsEditing(false);
        return;
      }

      const response = await fetch(`http://localhost:4000/adherents/${user.id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(changedFields),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la mise à jour des données.');
      }

      setProfileData(prev => ({
        ...prev,
        ...data
      }));
      setEditedFields(data);
      setIsEditing(false);
      setUpdateSuccess(true);

      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);

    } catch (err) {
      console.error('Erreur de sauvegarde:', err);
      setError(err.message);
    }
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

  const renderField = (label, name, icon, type = "text", required = false) => {
    const value = editedFields[name] || "";
    
    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          {icon}
          <label className="text-sm font-medium text-gray-500">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        </div>
        {isEditing ? (
          <input
            type={type}
            name={name}
            value={value}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={required}
          />
        ) : (
          <p className="text-gray-900 pl-7">{value || "Non renseigné"}</p>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <User className="w-6 h-6" />
            Mon Profil
          </h1>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          )}

          {updateSuccess && (
            <div className="mb-4 bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-2">
              <Check className="w-5 h-5" />
              <p>Vos informations ont été mises à jour avec succès.</p>
            </div>
          )}

          {profileData && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderField("Email", "email", <Mail className="w-5 h-5 text-gray-400" />, "email", true)}
                {renderField("Nom", "name", <User className="w-5 h-5 text-gray-400" />, "text", true)}
                {renderField("Téléphone", "Telephone", <Phone className="w-5 h-5 text-gray-400" />, "tel")}
              </div>

              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Adresse
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {renderField("Rue", "Rue", <MapPin className="w-5 h-5 text-gray-400" />)}
                  {renderField("Code Postal", "Code_Postal", <MapPin className="w-5 h-5 text-gray-400" />)}
                  {renderField("Ville", "Ville", <MapPin className="w-5 h-5 text-gray-400" />)}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Sauvegarder
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Annuler
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Modifier mes informations
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;