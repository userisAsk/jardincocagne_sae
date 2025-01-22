import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { ArrowRight, MapPin, Truck, ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";

// Fix des icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png"
});

// Composant Loading
const Loading = () => (
  <div className="fixed inset-0 bg-black/25 flex items-center justify-center">
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="mt-2 text-gray-600">Chargement...</p>
    </div>
  </div>
);

// Composant RoutingMachine
const RoutingMachine = ({ points, color, setRouteInstructions, setTotalTime, setTotalDistance }) => {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!map) return;

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

    if (!points || points.length < 2) {
      return cleanup;
    }

    const waypoints = points
      .filter(point => point && point.Latitude && point.Longitude)
      .map(point => L.latLng(point.Latitude, point.Longitude));

    if (waypoints.length < 2) {
      return cleanup;
    }

    routingControlRef.current = L.Routing.control({
      waypoints,
      lineOptions: {
        styles: [{ color, opacity: 0.8, weight: 4 }]
      },
      router: L.Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1"
      }),
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      createMarker: () => null
    })
      .on("routesfound", (e) => {
        const route = e.routes[0];
        if (route) {
          const instructions = route.instructions.map((instruction) => ({
            text: instruction.text,
            distance: instruction.distance,
            time: instruction.time
          }));
          setRouteInstructions(instructions);
          setTotalTime(Math.round(route.summary.totalTime / 60));
          setTotalDistance(route.summary.totalDistance / 1000);
        }
      });

    routingControlRef.current.addTo(map);

    return cleanup;
  }, [map, points, color, setRouteInstructions, setTotalTime, setTotalDistance]);

  return null;
};

// Composant FitBounds
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

const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center" style={{ zIndex: 9999 }}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-96" style={{ zIndex: 10000 }}>
        <p className="text-lg mb-4">{message}</p>
        <div className="flex justify-end gap-4">
          <button onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded-md">Annuler</button>
          <button onClick={onConfirm} className="bg-red-500 text-white px-4 py-2 rounded-md">Confirmer</button>
        </div>
      </div>
    </div>
  );
};

// Composant principal
const DeliveryManagement = () => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmCallback, setConfirmCallback] = useState(null);
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [selectedTourDay, setSelectedTourDay] = useState("");
  const [selectedTourId, setSelectedTourId] = useState(null);
  const [points, setPoints] = useState([]);
  const [routeInstructions, setRouteInstructions] = useState([]);
  const [totalTime, setTotalTime] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [currentColor, setCurrentColor] = useState("#2563eb");
  const [mapKey, setMapKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [allDepots, setAllDepots] = useState([]);
  const [originalDepots, setOriginalDepots] = useState([]);
  const daysOfWeek = ["Mardi", "Mercredi", "Jeudi", "Vendredi"];
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedDepot, setSelectedDepot] = useState("");
  const [showInstructions, setShowInstructions] = useState(true);

  const tourColors = {
    "Mardi": "#2563eb",
    "Mercredi": "#059669",
    "Vendredi": "#dc2626"
  };

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [toursResponse, depotsResponse] = await Promise.all([
          fetch("http://localhost:4000/tours"),
          fetch("http://localhost:4000/depots")
        ]);

        const toursData = await toursResponse.json();
        const depotsData = await depotsResponse.json();

        setTours(toursData);
        setFilteredTours(toursData);
        setAllDepots(depotsData);
        setOriginalDepots(depotsData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        alert("Erreur lors du chargement des données");
      }
      setLoading(false);
    };

    fetchInitialData();
  }, []);

  // Filtrer les tournées en fonction du jour sélectionné
  useEffect(() => {
    if (selectedDay) {
      const filtered = tours.filter(tour => tour.Parcours === selectedDay);
      setFilteredTours(filtered);
    } else {
      setFilteredTours(tours);
    }
  }, [selectedDay, tours]);

  // Fetch tour details when selected
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
        alert("Erreur lors du chargement des points de la tournée");
      }
      setLoading(false);
    };

    fetchTourDetails();
  }, [selectedTourId]);

  const handleSelectTour = async (tour) => {
    setLoading(true);
    try {
      setSelectedTourId(tour.ID_Tournee);
      setCurrentColor(tourColors[tour.Parcours] || "#2563eb");
      setSelectedTourDay(tour.Parcours); // Ajoutez cette ligne
  
      const response = await fetch(`http://localhost:4000/tours/${tour.ID_Tournee}`);
      const data = await response.json();
      
      if (data.points) {
        setPoints(data.points);
        setMapKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Erreur lors du chargement de la tournée:", error);
      alert("Erreur lors du chargement de la tournée");
    } finally {
      setLoading(false);
      setSelectedDepot("");
    }
  };

  // Filtre des dépôts en fonction du jour sélectionné
  useEffect(() => {
    // Utilisez d'abord le jour du filtre, sinon utilisez le jour de la tournée sélectionnée
    const activeDay = selectedDay || selectedTourDay;
    
    if (activeDay) {
      const filteredDepots = originalDepots.filter(
        (depot) => depot.Jour_Disponibilite && depot.Jour_Disponibilite.includes(activeDay)
      );
      setAllDepots(filteredDepots);
    } else {
      setAllDepots(originalDepots);
    }
  }, [selectedDay, selectedTourDay, originalDepots]);
  
  // Modifiez handleDayChange pour réinitialiser aussi selectedTourDay :
  const handleDayChange = (e) => {
    const newDay = e.target.value;
    setSelectedDay(newDay);
    setSelectedTourId(null);
    setSelectedTourDay(""); 
    setPoints([]);
    setMapKey((prev) => prev + 1);
  };

  const handleAddDepot = async () => {
    if (!selectedDepot || !selectedTourId) {
      alert("Veuillez sélectionner un dépôt");
      return;
    }

    setLoading(true);
    try {
      const ordre = points.length + 1;
      await fetch(`http://localhost:4000/tours/${selectedTourId}/points`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pointId: selectedDepot, ordre })
      });

      const response = await fetch(`http://localhost:4000/tours/${selectedTourId}`);
      const data = await response.json();
      if (data.points) {
        setPoints(data.points);
        setMapKey((prev) => prev + 1);
        setSelectedDepot("");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du point:", error);
      alert("Erreur lors de l'ajout du point");
    }
    setLoading(false);
  };

  const handleDeletePoint = async (pointId) => {
    setConfirmCallback(() => async () => {
      setLoading(true);
      try {
        await fetch(`http://localhost:4000/tours/${selectedTourId}/points/${pointId}`, {
          method: "DELETE"
        });

        const response = await fetch(`http://localhost:4000/tours/${selectedTourId}`);
        const data = await response.json();
        if (data.points) {
          setPoints(data.points);
          setMapKey((prev) => prev + 1);
        }
      } catch (error) {
        console.error("Erreur lors de la suppression du point:", error);
        alert("Erreur lors de la suppression du point");
      } finally {
        setLoading(false);
        setShowConfirmDialog(false);
        setConfirmCallback(null);
      }
    });

    setShowConfirmDialog(true);
  };

  const handleCancelConfirm = () => {
    setShowConfirmDialog(false);
    setConfirmCallback(null);
  };

  const getInstructionIcon = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes("turn right")) return ChevronRight;
    if (lowerText.includes("turn left")) return ChevronLeft;
    if (lowerText.includes("keep right")) return ArrowRight;
    if (lowerText.includes("keep left")) return ChevronLeft;
    if (lowerText.includes("merge")) return Truck;
    return MapPin;
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
          <div className="w-full md:w-1/4 space-y-4">
            <div className="bg-white rounded-lg shadow p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jour de livraison
              </label>
              <select
                className="w-full p-2 border rounded-md"
                value={selectedDay}
                onChange={handleDayChange}
              >
                <option value="">Tous les jours</option>
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            {/* Point Management */}
            {selectedTourId && (
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-medium mb-4">Gestion des points</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Sélectionner un dépôt
                    </label>
                    <select
                      value={selectedDepot}
                      onChange={(e) => setSelectedDepot(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Choisir un dépôt</option>
                      {allDepots.map((depot) => (
                        <option 
                          key={depot.ID_Point_Depot} 
                          value={depot.ID_Point_Depot}
                          className="whitespace-normal"
                        >
                          {depot.Nom} - {depot.Adresse}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleAddDepot}
                    className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
                    disabled={!selectedDepot}
                  >
                    <Plus size={16} />
                    Ajouter le point
                  </button>
                  
                  {points.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Points de la tournée</h4>
                      <div className="space-y-2">
                        {points.map((point, idx) => (
                          <div
                            key={point.ID_Point_Depot}
                            className="flex items-center justify-between p-2 border rounded-md"
                          >
                            <span className="flex items-center gap-2">
                              <span className="w-6 h-6 flex items-center justify-center bg-blue-100 rounded-full text-sm">
                                {idx + 1}
                              </span>
                              {point.Nom}
                            </span>
                            <button
                              onClick={() => handleDeletePoint(point.ID_Point_Depot)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tours List */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="font-medium mb-4">Tournées disponibles</h2>
              <div className="space-y-2">
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
          </div>

          {/* Main Content */}
          <div className="flex flex-col w-full md:w-3/4 space-y-4">
            {selectedTourId ? (
              <>
                {/* Map */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="h-[600px]">
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
                </div>

                {/* Route Information */}
                {(totalTime > 0 || totalDistance > 0) && (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Informations de la tournée</h3>
                      <button
                        onClick={() => setShowInstructions(!showInstructions)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        {showInstructions ? "Masquer les instructions" : "Afficher les instructions"}
                      </button>
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-gray-600 mb-1">Temps estimé</div>
                        <div className="text-2xl font-bold">
                          {Math.floor(totalTime / 60)}h {totalTime % 60}min
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-gray-600 mb-1">Distance totale</div>
                        <div className="text-2xl font-bold">
                          {totalDistance.toFixed(1)} km
                        </div>
                      </div>
                    </div>

                    {/* Route Instructions */}
                    {showInstructions && routeInstructions.length > 0 && (
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-4">Instructions de route :</h4>
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                          {routeInstructions.map((instruction, idx) => {
                            const Icon = getInstructionIcon(instruction.text);
                            return (
                              <div
                                key={idx}
                                className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                              >
                                <div className="flex-shrink-0">
                                  <Icon className="w-5 h-5 text-blue-500" />
                                </div>
                                <div className="flex-grow">
                                  <span className="text-gray-800">{instruction.text}</span>
                                </div>
                                <div className="flex-shrink-0 text-sm text-gray-500">
                                  {instruction.distance < 1000 
                                    ? `${Math.round(instruction.distance)}m`
                                    : `${(instruction.distance / 1000).toFixed(1)}km`
                                  }
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="h-[600px] bg-white rounded-lg shadow-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Sélectionnez une tournée pour afficher la carte
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {showConfirmDialog && (
        <ConfirmDialog
          message="Êtes-vous sûr de vouloir supprimer ce point ?"
          onConfirm={confirmCallback}
          onCancel={handleCancelConfirm}
        />
      )}
    </div>
  );
};

export default DeliveryManagement;