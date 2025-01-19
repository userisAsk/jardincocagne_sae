// DeliveryManagement.js
import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import "leaflet-routing-machine";
import { ArrowRight, MapPin, Truck, ChevronLeft, ChevronRight } from "lucide-react"; 

// Fix des icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Composant pour le chargement
const Loading = () => (
  <div className="fixed inset-0 bg-black/25 flex items-center justify-center">
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="mt-2 text-gray-600">Chargement...</p>
    </div>
  </div>
);

// Composant RoutingMachine (inchangé)
const RoutingMachine = ({ points, color, setRouteInstructions, setTotalTime, setTotalDistance }) => {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    // Fonction de nettoyage
    const cleanup = () => {
      if (routingControlRef.current) {
        try {
          routingControlRef.current.getPlan().setWaypoints([]); // Supprime les waypoints
          routingControlRef.current.remove(); // Supprime le contrôle de routage
        } catch (error) {
          console.error("Erreur lors du nettoyage du routage :", error);
        } finally {
          routingControlRef.current = null;
        }
      }
    };

    // Nettoyer les couches existantes sur la carte
    const cleanupLayers = () => {
      map.eachLayer((layer) => {
        if (layer.options && layer.options.pane === "overlayPane") {
          map.removeLayer(layer);
        }
      });
    };

    // Nettoyer avant de créer un nouveau routage
    cleanup();
    cleanupLayers();

    // Vérifier les points
    if (!points || points.length < 2) {
      return cleanup; // Pas assez de points pour afficher une route
    }

    const waypoints = points
      .filter(point => point && point.Latitude && point.Longitude)
      .map(point => L.latLng(point.Latitude, point.Longitude));

    if (waypoints.length < 2) {
      return cleanup; // Toujours pas assez de waypoints valides
    }

    // Ajouter le contrôle de routage
    try {
      routingControlRef.current = L.Routing.control({
        waypoints,
        lineOptions: {
          styles: [{ color, opacity: 0.8, weight: 4 }],
        },
        router: L.Routing.osrmv1({
          serviceUrl: "https://router.project-osrm.org/route/v1",
        }),
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        showAlternatives: false,
        createMarker: () => null,
      })
        .on("routesfound", (e) => {
          const route = e.routes[0];
          if (route) {
            const instructions = route.instructions.map((instruction) => ({
              text: instruction.text,
              distance: instruction.distance,
              time: instruction.time,
            }));
            setRouteInstructions(instructions);
            setTotalTime(Math.round(route.summary.totalTime / 60));
            setTotalDistance(route.summary.totalDistance / 1000);
          }
        });

      routingControlRef.current.addTo(map);
    } catch (error) {
      console.error("Erreur lors de la création du contrôle de routage :", error);
    }

    // Cleanup à la fin
    return cleanup;
  }, [map, points, color, setRouteInstructions, setTotalTime, setTotalDistance]);

  return null;
};


// Composant FitBounds (inchangé)
const FitBounds = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (points && points.length > 0) {
      const bounds = L.latLngBounds(
        points
          .filter(point => point && point.Latitude && point.Longitude)
          .map((point) => [point.Latitude, point.Longitude])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, points]);

  return null;
};

// Composant principal
const DeliveryManagement = () => {
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [selectedTourId, setSelectedTourId] = useState(null);
  const [points, setPoints] = useState([]);
  const [routeInstructions, setRouteInstructions] = useState([]);
  const [totalTime, setTotalTime] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [currentColor, setCurrentColor] = useState("#2563eb");
  const [mapKey, setMapKey] = useState(0);
  const [loading, setLoading] = useState(false);

  const tourColors = {
    "Mardi": "#2563eb",
    "Mercredi": "#059669",
    "Vendredi": "#dc2626",
  };

  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:4000/tours");
        const data = await response.json();
        setTours(data);
        setFilteredTours(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des tournées:", error);
      }
      setLoading(false);
    };
    fetchTours();
  }, []);

  useEffect(() => {
    if (deliveryDate) {
      const filtered = tours.filter((tour) => tour.Jour_Livraison.startsWith(deliveryDate));
      setFilteredTours(filtered);
    } else {
      setFilteredTours(tours);
    }
  }, [deliveryDate, tours]);

  useEffect(() => {
    const fetchTourDetails = async () => {
      if (!selectedTourId) return;
      
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:4000/tours/${selectedTourId}`);
        const data = await response.json();
        if (data.points) {
          setPoints(data.points);
          setMapKey((prev) => prev + 1);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des points:", error);
      }
      setLoading(false);
    };
    fetchTourDetails();
  }, [selectedTourId]);

  const handleSelectTour = (tour) => {
    setSelectedTourId(tour.ID_Tournee);
    setCurrentColor(tourColors[tour.Parcours] || "#2563eb");
    setRouteInstructions([]);
    setTotalTime(0);
    setTotalDistance(0);
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Gestion des Tournées de Livraison
        </h1>

        {loading && <Loading />}

        <div className="flex flex-col md:flex-row gap-4">
          {/* Sidebar */}
          <div className="w-full md:w-1/4 bg-white rounded-lg shadow p-4">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de livraison
              </label>
              <input
                type="date"
                className="w-full p-2 border rounded-md"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <h2 className="font-semibold mb-4">Tournées disponibles</h2>
              {filteredTours.map((tour) => (
                <button
                  key={tour.ID_Tournee}
                  onClick={() => handleSelectTour(tour)}
                  className={`w-full p-3 text-left rounded-md transition-all ${
                    selectedTourId === tour.ID_Tournee
                      ? "bg-blue-50 border-2 border-blue-500"
                      : "border hover:bg-gray-50"
                  }`}
                  style={{
                    borderLeftWidth: "4px",
                    borderLeftColor: tourColors[tour.Parcours] || "#000"
                  }}
                >
                  <div className="font-medium">{tour.Parcours}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(tour.Jour_Livraison).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Map and Info */}
          <div className="flex flex-col w-full md:w-3/4">
            {selectedTourId ? (
              <>
                <div className="h-[600px] bg-white rounded-lg shadow overflow-hidden">
                  <MapContainer
                    key={mapKey}
                    center={[46.603354, 1.888334]}
                    zoom={5}
                    className="h-full w-full"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    {points.map((point, idx) => (
                      <Marker
                        key={`${point.Latitude}-${point.Longitude}-${idx}`}
                        position={[point.Latitude, point.Longitude]}
                        icon={L.divIcon({
                          className: "custom-icon",
                          html: `<div style="background-color: ${currentColor}; width: 24px; height: 24px; border-radius: 50%; text-align: center; line-height: 24px; color: white; font-weight: bold;">${idx + 1}</div>`,
                        })}
                      >
                        <Tooltip permanent direction="top" offset={[0, -20]}>
                          <span>{point.Nom}</span>
                        </Tooltip>
                      </Marker>
                    ))}
                    {points.length >= 2 && (
                      <RoutingMachine
                        points={points}
                        color={currentColor}
                        setRouteInstructions={setRouteInstructions}
                        setTotalTime={setTotalTime}
                        setTotalDistance={setTotalDistance}
                      />
                    )}
                    <FitBounds points={points} />
                  </MapContainer>
                </div>

                {/* Route Information */}
                {(totalTime > 0 || totalDistance > 0) && (
                  <div className="mt-4 bg-white rounded-lg shadow p-4">
                    <h3 className="text-lg font-semibold mb-4">Informations de la tournée</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <span className="text-gray-600">Temps estimé :</span>
                        <div className="text-xl font-bold">{Math.round(totalTime)} minutes</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Distance totale :</span>
                        <div className="text-xl font-bold">{totalDistance.toFixed(1)} km</div>
                      </div>
                    </div>
                    {routeInstructions.length > 0 && (
  <div>
    <h4 className="font-medium mb-2">Instructions :</h4>
    <ul className="space-y-2">
      {routeInstructions.map((instruction, idx) => {
        let Icon;
        const lowerText = instruction.text.toLowerCase();

            // Déterminer l'icône en fonction du texte
            if (lowerText.includes("turn right")) {
              Icon = ChevronRight; // Flèche à droite
            } else if (lowerText.includes("turn left")) {
              Icon = ChevronLeft; // Flèche à gauche
            } else if (lowerText.includes("keep right")) {
              Icon = ArrowRight; // Flèche droite pour "garder à droite"
            } else if (lowerText.includes("keep left")) {
              Icon = ChevronLeft; // Flèche gauche pour "garder à gauche"
            } else if (lowerText.includes("merge")) {
              Icon = Truck; // Camion pour "fusionner sur une voie"
            } else {
              Icon = MapPin; // Épingle par défaut
            }

            return (
              <li key={idx} className="flex items-center text-sm text-gray-700 space-x-2">
                <Icon className="w-4 h-4 text-blue-500" /> {/* Affiche l'icône déterminée */}
                <span>{instruction.text}</span>
                <span className="ml-auto text-xs text-gray-500">
                  ({Math.round(instruction.distance)}m)
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    )}
                  </div>
                )}
              </>
            ) : (
              <div className="h-[600px] bg-white rounded-lg shadow flex items-center justify-center">
                <p className="text-gray-500">Sélectionnez une tournée pour afficher la carte</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryManagement;