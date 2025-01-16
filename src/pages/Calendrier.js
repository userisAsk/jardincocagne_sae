import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

const Calendrier = () => {
  const [selectedTourDay, setSelectedTourDay] = useState("");
  const [holidays, setHolidays] = useState([]);
  const [closureWeeks, setClosureWeeks] = useState([]);
  const [frequency, setFrequency] = useState("hebdomadaire");
  const [basketsCount, setBasketsCount] = useState(50);
  const [calendar, setCalendar] = useState([]);
  const [loading, setLoading] = useState(false);

  const days = ["mardi", "jeudi", "vendredi"]; // Jours disponibles pour les tournées.

  // Fonction pour générer le calendrier automatiquement.
  const generateCalendar = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:4000/tours/generate", {
        tourDay: selectedTourDay,
        holidays,
        closureWeeks,
        frequency,
        basketsCount,
      });
      setCalendar(response.data.calendar); // Récupère les données du calendrier généré.
    } catch (error) {
      console.error("Erreur lors de la génération du calendrier :", error);
    } finally {
      setLoading(false);
    }
  };

  // Ajout d'une date de jour férié
  const addHoliday = (date) => {
    if (!holidays.includes(date)) setHolidays([...holidays, date]);
  };

  // Suppression d'une date de jour férié
  const removeHoliday = (date) => {
    setHolidays(holidays.filter((d) => d !== date));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestion du calendrier des tournées</h1>

      {/* Sélection des jours de tournée */}
      <div className="mb-4">
        <label htmlFor="tourDay" className="block mb-2 font-medium">
          Sélectionnez le jour de tournée :
        </label>
        <select
          id="tourDay"
          className="border p-2 rounded w-full"
          value={selectedTourDay}
          onChange={(e) => setSelectedTourDay(e.target.value)}
        >
          <option value="">Choisir un jour</option>
          {days.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      </div>

      {/* Saisie des jours fériés */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Jours fériés :</label>
        <DatePicker
          selected={null}
          onChange={(date) => addHoliday(date.toISOString().split("T")[0])}
          dateFormat="dd/MM/yyyy"
          placeholderText="Ajouter un jour férié"
          className="border p-2 rounded w-full"
        />
        <ul className="mt-2">
          {holidays.map((holiday, index) => (
            <li key={index} className="flex justify-between items-center">
              {holiday}
              <button
                className="text-red-500"
                onClick={() => removeHoliday(holiday)}
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Fréquence et nombre de paniers */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Fréquence de livraison :</label>
        <select
          className="border p-2 rounded w-full"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
        >
          <option value="hebdomadaire">Hebdomadaire</option>
          <option value="bimensuel">Bimensuel</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="basketsCount" className="block mb-2 font-medium">
          Nombre de paniers :
        </label>
        <input
          type="number"
          id="basketsCount"
          className="border p-2 rounded w-full"
          value={basketsCount}
          onChange={(e) => setBasketsCount(Number(e.target.value))}
        />
      </div>

      {/* Bouton pour générer le calendrier */}
      <button
        onClick={generateCalendar}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={!selectedTourDay || loading}
      >
        {loading ? "Chargement..." : "Générer le calendrier"}
      </button>

      {/* Affichage du calendrier */}
      {calendar.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Calendrier généré :</h2>
          <ul className="border p-4 rounded bg-gray-100">
            {calendar.map((entry, index) => (
              <li key={index} className="mb-2">
                {entry.date} - {entry.adjusted ? "Ajusté" : "Normal"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Calendrier;
