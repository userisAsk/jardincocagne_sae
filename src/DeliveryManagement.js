import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix pour les icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Composant pour centrer la carte sur les points
const FitBounds = ({ points }) => {
  const map = useMap();
  
  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points.map(point => [point.Latitude, point.Longitude]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, points]);

  return null;
};

const DeliveryManagement = () => {
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [selectedTourId, setSelectedTourId] = useState(null);
  const [selectedDay, setSelectedDay] = useState("");
  const [points, setPoints] = useState([]);
  const [itineraire, setItineraire] = useState([]);
  const [depotsByDay, setDepotsByDay] = useState([]);
  const [selectedDepot, setSelectedDepot] = useState("");
  const [selectedPoint, setSelectedPoint] = useState("");
  const [currentColor, setCurrentColor] = useState("blue");
  const [mapKey, setMapKey] = useState(0);
  const [routeInstructions, setRouteInstructions] = useState([]);
  const [loading, setLoading] = useState(false);

  const tourColors = {
    "Mardi": "blue",
    "Mercredi": "green",
    "Vendredi": "red",
  };

  // Charger les tournées au chargement initial
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch("http://localhost:4000/tours");
        const data = await response.json();
        setTours(data);
        setFilteredTours(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des tournées:", error);
      }
    };
    fetchTours();
  }, []);

  // Filtrer les tournées par date
  useEffect(() => {
    if (deliveryDate) {
      const filtered = tours.filter(tour => 
        tour.Jour_Livraison.startsWith(deliveryDate)
      );
      setFilteredTours(filtered);
    } else {
      setFilteredTours(tours);
    }
  }, [deliveryDate, tours]);

  // Charger les dépôts disponibles pour un jour spécifique
  useEffect(() => {
    const fetchDepotsByDay = async () => {
      if (!selectedDay) return;
      
      try {
        const response = await fetch(`http://localhost:4000/depots/jour/${selectedDay}`);
        const data = await response.json();
        setDepotsByDay(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des dépôts:", error);
      }
    };
    
    fetchDepotsByDay();
  }, [selectedDay]);

  // Charger les détails d'une tournée sélectionnée
  useEffect(() => {
    const fetchTourDetails = async () => {
      if (!selectedTourId) return;
      
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:4000/tours/${selectedTourId}`);
        const data = await response.json();
        
        if (data.points) {
          setPoints(data.points);
          setItineraire(data.points.map(point => [point.Latitude, point.Longitude]));
          await fetchRouteInstructions(data.points);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des points:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTourDetails();
  }, [selectedTourId]);

  // Fonction pour récupérer les instructions d'itinéraire
  const fetchRouteInstructions = async (tourPoints) => {
    if (tourPoints.length < 2) return;

    try {
      const coordinates = tourPoints
        .map(p => `${p.Longitude},${p.Latitude}`)
        .join(';');

      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${coordinates}?steps=true&geometries=geojson&overview=full`
      );
      const data = await response.json();

      if (data.routes && data.routes[0]) {
        const steps = data.routes[0].legs.flatMap((leg, legIndex) => {
          const departPoint = tourPoints[legIndex];
          const arrivePoint = tourPoints[legIndex + 1];
          
          return leg.steps.map(step => ({
            instruction: step.maneuver.type === 'depart' 
              ? `Départ de ${departPoint.Nom}`
              : step.maneuver.type === 'arrive' 
                ? `Arrivée à ${arrivePoint.Nom}`
                : step.maneuver.instruction,
            distance: `${(step.distance / 1000).toFixed(1)} km`
          }));
        });
        
        setRouteInstructions(steps);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l'itinéraire:", error);
    }
  };

  // Gérer la sélection d'une tournée
  const handleSelectTour = (tour) => {
    setSelectedTourId(tour.ID_Tournee);
    setSelectedDay(tour.Parcours);
    setCurrentColor(tourColors[tour.Parcours] || "blue");
  };

  // Ajouter un point de dépôt
  const handleAddDepot = async () => {
    if (!selectedDepot) {
      alert("Veuillez sélectionner un dépôt à ajouter.");
      return;
    }

    try {
      const ordre = points.length + 1;
      await fetch(`http://localhost:4000/tours/${selectedTourId}/points`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pointId: selectedDepot, ordre }),
      });

      const response = await fetch(`http://localhost:4000/tours/${selectedTourId}`);
      const data = await response.json();

      if (data.points) {
        setPoints(data.points);
        setItineraire(data.points.map(point => [point.Latitude, point.Longitude]));
        await fetchRouteInstructions(data.points);
        alert("Point ajouté avec succès !");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du point:", error);
      alert("Erreur lors de l'ajout du point.");
    }
  };

  // Supprimer un point de dépôt
  const handleDeletePoint = async () => {
    if (!selectedPoint) {
      alert("Veuillez sélectionner un point à supprimer.");
      return;
    }

    try {
      await fetch(`http://localhost:4000/tours/${selectedTourId}/points/${selectedPoint}`, {
        method: "DELETE",
      });

      const response = await fetch(`http://localhost:4000/tours/${selectedTourId}`);
      const data = await response.json();

      if (data.points) {
        setPoints(data.points);
        setItineraire(data.points.map(point => [point.Latitude, point.Longitude]));
        await fetchRouteInstructions(data.points);
        alert("Point supprimé avec succès !");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du point:", error);
      alert("Erreur lors de la suppression du point.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-grow container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Gestion des tournées de livraison
        </h1>

        {/* Filtre par date */}
        <div className="mb-6 flex flex-col items-center">
          <label htmlFor="deliveryDate" className="mb-2 text-lg font-medium text-gray-700">
            Filtrer par jour de livraison :
          </label>
          <input
            type="date"
            id="deliveryDate"
            className="p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 shadow-sm"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
          />
        </div>

        {/* Liste des tournées */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Tournées disponibles :</h2>
          {filteredTours.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredTours.map((tour) => (
                <li
                  key={tour.ID_Tournee}
                  className={`border p-4 rounded-md shadow-sm transition-all hover:shadow-md cursor-pointer ${
                    selectedTourId === tour.ID_Tournee ? 'ring-2 ring-offset-2' : ''
                  }`}
                  style={{
                    borderColor: tourColors[tour.Parcours] || "black",
                  }}
                  onClick={() => handleSelectTour(tour)}
                >
                  <div
                    className="font-medium"
                    style={{ color: tourColors[tour.Parcours] || "black" }}
                  >
                    {tour.Parcours} - {new Date(tour.Jour_Livraison).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center">Aucune tournée disponible.</p>
          )}
        </div>

        {/* Carte et instructions */}
        {selectedTourId && (
          <div className="mb-16">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Carte de la tournée</h2>
            
            {loading ? (
              <div className="flex justify-center items-center h-[500px]">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="flex gap-4">
                {/* Carte */}
                <div className="w-3/4 h-[500px] rounded-lg overflow-hidden shadow-lg">
                  <MapContainer
                    key={mapKey}
                    center={[46.603354, 1.888334]}
                    zoom={5}
                    className="h-full w-full"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {points.map((point, idx) => (
                      <Marker
                        key={idx}
                        position={[point.Latitude, point.Longitude]}
                        icon={L.divIcon({
                          className: "custom-icon",
                          html: `<div style="background-color: ${currentColor}; width: 24px; height: 24px; border-radius: 50%; text-align: center; line-height: 24px; color: white; font-weight: bold;">${idx + 1}</div>`,
                        })}
                      >
                        <Tooltip permanent direction="top" offset={[0, -20]}>
                          <span className="font-medium">{point.Nom}</span>
                        </Tooltip>
                      </Marker>
                    ))}
                    {itineraire.length > 1 && (
                      <Polyline 
                        positions={itineraire} 
                        color={currentColor}
                        weight={3}
                        opacity={0.8}
                      />
                    )}
                    <FitBounds points={points} />
                  </MapContainer>
                </div>

                {/* Panel d'instructions */}
                <div className="w-1/4 bg-white p-4 rounded-lg shadow-lg overflow-y-auto h-[500px]">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    Points de livraison
                  </h3>
                  
                  {/* Liste des points */}
                  <div className="space-y-3 mb-6">
                    {points.map((point, index) => (
                      <div key={index} className="border-b pb-2">
                        <div className="flex items-center">
                          <div 
                            className="w-6 h-6 rounded-full flex items-center justify-center mr-2 text-white font-medium text-sm"
                            style={{ backgroundColor: currentColor }}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{point.Nom}</p>
                            <p className="text-sm text-gray-600">{point.Adresse}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Instructions de route */}
                  {routeInstructions.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-medium mb-3 text-gray-800">Instructions de route :</h4>
                      <ol className="space-y-2">
                        {routeInstructions.map((instruction, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start">
                            <span className="text-xs bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                              {index + 1}
                            </span>
                            <span>
                              {instruction.instruction}
                              <span className="text-gray-500 ml-1">
                                ({instruction.distance})
                              </span>
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryManagement;
