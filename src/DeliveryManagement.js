import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const DeliveryManagement = () => {
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [selectedTourId, setSelectedTourId] = useState(null);
  const [selectedDay, setSelectedDay] = useState("");
  const [points, setPoints] = useState([]);
  const [itineraire, setItineraire] = useState([]);
  const [depotsByDay, setDepotsByDay] = useState([]);
  const [selectedDepot, setSelectedDepot] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [currentColor, setCurrentColor] = useState("blue");
  const [mapKey, setMapKey] = useState(0);

  const tourColors = {
    "Mardi": "blue",
    "Mercredi": "green",
    "Vendredi": "red",
  };

  useEffect(() => {
    fetch("http://localhost:4000/tours")
      .then((res) => res.json())
      .then((data) => setTours(data))
      .catch((err) => console.error("Erreur lors de la récupération des tournées:", err));
  }, []);

  useEffect(() => {
    if (selectedDay) {
      fetch(`http://localhost:4000/depots/jour/${selectedDay}`)
        .then((res) => res.json())
        .then((data) => setDepotsByDay(data))
        .catch((err) => console.error("Erreur lors de la récupération des dépôts:", err));
    }
  }, [selectedDay]);

  useEffect(() => {
    if (!selectedTourId) return;

    fetch(`http://localhost:4000/tours/${selectedTourId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.points) {
          setPoints(data.points);
          setItineraire(data.points.map((point) => [point.Latitude, point.Longitude]));
        } else {
          setPoints([]);
          setItineraire([]);
        }
        setMapKey((prevKey) => prevKey + 1);
      })
      .catch((err) => console.error("Erreur lors de la récupération des points:", err));
  }, [selectedTourId]);

  useEffect(() => {
    if (deliveryDate) {
      setFilteredTours(tours.filter((tour) => tour.Jour_Livraison.startsWith(deliveryDate)));
    } else {
      setFilteredTours(tours);
    }
  }, [deliveryDate, tours]);

  const handleSelectTour = (tour) => {
    setSelectedTourId(tour.ID_Tournee);
    setSelectedDay(tour.Parcours); // Associe le jour
    setCurrentColor(tourColors[tour.Parcours] || "blue");
  };

  const handleAddDepot = () => {
    if (!selectedDepot) {
      alert("Veuillez sélectionner un dépôt à ajouter.");
      return;
    }

    const ordre = points.length + 1;
    fetch(`http://localhost:4000/tours/${selectedTourId}/points`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pointId: selectedDepot, ordre }),
    })
      .then(() => fetch(`http://localhost:4000/tours/${selectedTourId}`))
      .then((res) => res.json())
      .then((data) => {
        if (data.points) {
          setPoints(data.points);
          setItineraire(data.points.map((point) => [point.Latitude, point.Longitude]));
          alert("Point ajouté avec succès !");
        } else {
          alert("Aucun point trouvé après l'ajout.");
        }
      })
      .catch((err) => console.error("Erreur lors de l'ajout du point:", err));
  };

  const handleDeletePoint = () => {
    if (!selectedPoint) {
      alert("Veuillez sélectionner un point à supprimer.");
      return;
    }

    fetch(`http://localhost:4000/tours/${selectedTourId}/points/${selectedPoint}`, {
      method: "DELETE",
    })
      .then(() => fetch(`http://localhost:4000/tours/${selectedTourId}`))
      .then((res) => res.json())
      .then((data) => {
        if (data.points) {
          setPoints(data.points);
          setItineraire(data.points.map((point) => [point.Latitude, point.Longitude]));
          alert("Point supprimé avec succès !");
        } else {
          alert("Aucun point trouvé après la suppression.");
        }
      })
      .catch((err) => console.error("Erreur lors de la suppression du point:", err));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Gestion des tournées de livraison</h1>

        <div className="mb-6 flex flex-col items-center">
          <label htmlFor="deliveryDate" className="mb-2 text-lg font-medium">
            Filtrer par jour de livraison :
          </label>
          <input
            type="date"
            id="deliveryDate"
            className="p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Tournées disponibles :</h2>
          {filteredTours.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredTours.map((tour) => (
                <li
                  key={tour.ID_Tournee}
                  className={`border p-4 rounded-md shadow hover:bg-gray-100`}
                  style={{
                    borderColor: tourColors[tour.Parcours] || "black",
                  }}
                >
                  <button
                    onClick={() => handleSelectTour(tour)}
                    className="w-full text-left"
                    style={{ color: tourColors[tour.Parcours] || "black" }}
                  >
                    {tour.Parcours} - {new Date(tour.Jour_Livraison).toLocaleDateString()}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Aucune tournée disponible.</p>
          )}
        </div>

        {selectedTourId && (
          <div className="mb-16">
            <h2 className="text-xl font-semibold mb-4">Carte de la tournée</h2>
            <div className="w-full h-[500px] mb-6">
              <MapContainer
                key={mapKey}
                center={[46.603354, 1.888334]}
                zoom={5}
                style={{ width: "100%", height: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                {points.map((point, idx) => (
                  <Marker
                    key={idx}
                    position={[point.Latitude, point.Longitude]}
                    icon={L.divIcon({
                      className: "custom-icon",
                      html: `<div style="background-color: ${currentColor}; width: 20px; height: 20px; border-radius: 50%; text-align: center; color: white; font-size: 12px;">${
                        idx + 1
                      }</div>`,
                    })}
                  >
                    <Tooltip direction="top" offset={[0, -20]}>
                      <span>
                        {point.Nom} <br /> {point.Adresse}
                      </span>
                    </Tooltip>
                  </Marker>
                ))}
                {itineraire.length > 1 && <Polyline positions={itineraire} color={currentColor} />}
              </MapContainer>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-4">
                <select
                  onChange={(e) => setSelectedDepot(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Sélectionnez un dépôt</option>
                  {depotsByDay.map((depot) => (
                    <option key={depot.ID_Point_Depot} value={depot.ID_Point_Depot}>
                      {depot.Nom} - {depot.Adresse}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddDepot}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Ajouter
                </button>
              </div>

              <div className="flex items-center gap-4">
                <select
                  onChange={(e) => setSelectedPoint(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Sélectionnez un point</option>
                  {points.map((point) => (
                    <option key={point.ID_Point_Depot} value={point.ID_Point_Depot}>
                      {point.Nom} - {point.Adresse}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleDeletePoint}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryManagement;
