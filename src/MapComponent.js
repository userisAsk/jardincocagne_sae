import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix des icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapComponent = ({ tourId }) => {
  const [points, setPoints] = useState([]); // Initialisé à un tableau vide
  const [itineraire, setItineraire] = useState([]); // Initialisé à un tableau vide
  const [allDepots, setAllDepots] = useState([]); // Initialisé à un tableau vide
  const [selectedDepot, setSelectedDepot] = useState(null); // Dépôt sélectionné

  // Charger les points de la tournée
  useEffect(() => {
    if (!tourId) {
      console.error('tourId est undefined. Impossible de charger les données.');
      return;
    }
    fetch(`http://localhost:4000/tours/${tourId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.points) {
          setPoints(data.points);
          setItineraire(data.points.map((point) => [point.Latitude, point.Longitude]));
        }
      })
      .catch((err) => {
        console.error('Erreur lors de la récupération des points:', err);
      });
  }, [tourId]);
  

  // Charger tous les dépôts disponibles
  useEffect(() => {
    fetch('http://localhost:4000/depots')
      .then((res) => res.json())
      .then((data) => setAllDepots(data))
      .catch((err) => {
        console.error('Erreur lors de la récupération des dépôts:', err);
      });
  }, []);

  const handleAddDepot = () => {
    if (!tourId) {
      alert('tourId est undefined. Impossible d\'ajouter un point.');
      return;
    }
  
    if (selectedDepot) {
      const ordre = points.length + 1;
      fetch(`http://localhost:4000/tours/${tourId}/points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pointId: selectedDepot, ordre }),
      })
        .then(() => {
          return fetch(`http://localhost:4000/tours/${tourId}`);
        })
        .then((res) => res.json())
        .then((data) => {
          if (data.points) {
            setPoints(data.points);
            setItineraire(data.points.map((point) => [point.Latitude, point.Longitude]));
            alert('Point ajouté avec succès !');
          } else {
            alert('Aucun point trouvé après l\'ajout.');
          }
        })
        .catch((err) => {
          console.error('Erreur lors de l\'ajout du point ou de la récupération des données:', err);
        });
    } else {
      alert('Veuillez sélectionner un dépôt à ajouter.');
    }
  };
  

  return (
    <div>
      <h2>Carte des tournées</h2>
      <MapContainer
        center={[48.8566, 2.3522]} // Coordonnées par défaut (Paris)
        zoom={12}
        style={{ width: '100%', height: '500px' }}
      >
        {/* Fond de carte OpenStreetMap */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {/* Affichage des points de dépôt */}
        {points && points.map((point, idx) => (
          <Marker key={idx} position={[point.Latitude, point.Longitude]}>
            <Popup>
              {point.Nom}
              <br />
              {point.Adresse}
            </Popup>
          </Marker>
        ))}
        {/* Affichage de l'itinéraire */}
        {itineraire.length > 1 && <Polyline positions={itineraire} color="blue" />}
      </MapContainer>

      {/* Formulaire pour ajouter un point */}
      <div style={{ marginTop: '20px' }}>
        <h3>Ajouter un point à la tournée</h3>
        <select onChange={(e) => setSelectedDepot(e.target.value)}>
          <option value="">Sélectionnez un dépôt</option>
          {allDepots && allDepots.map((depot) => (
            <option key={depot.ID_Point_Depot} value={depot.ID_Point_Depot}>
              {depot.Nom} - {depot.Adresse}
            </option>
          ))}
        </select>
        <button onClick={handleAddDepot} style={{ marginLeft: '10px' }}>
          Ajouter
        </button>
      </div>
    </div>
  );
};

export default MapComponent;
