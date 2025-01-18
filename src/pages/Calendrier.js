import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronDown,
  ChevronLeft,
  ChevronRight 
} from 'lucide-react';
import { format, isWithinInterval, startOfWeek, endOfWeek, getWeek, getYear } from 'date-fns';
import { fr } from 'date-fns/locale';

const DeliverySchedule = () => {
  const [selectedTour, setSelectedTour] = useState('');
  const [frequency, setFrequency] = useState('hebdomadaire');
  const [tours, setTours] = useState([]);
  const [selectedDates, setSelectedDates] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());

  // Jours fériés fixes
  const fixedHolidays = [
    { day: 1, month: 1 },   // Jour de l'an
    { day: 1, month: 5 },   // Fête du travail
    { day: 8, month: 5 },   // Victoire 1945
    { day: 14, month: 7 },  // Fête nationale
    { day: 15, month: 8 },  // Assomption
    { day: 1, month: 11 },  // Toussaint
    { day: 11, month: 11 }, // Armistice
    { day: 25, month: 12 }, // Noël
  ];

  const isHoliday = (date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return fixedHolidays.some(
      holiday => holiday.day === day && holiday.month === month
    );
  };

  const isClosureWeek = (date) => {
    const weekNumber = getWeek(date, { locale: fr });
    return weekNumber === 1 || weekNumber >= 52;
  };

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch('http://localhost:4000/tours');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des tournées');
        }
        const data = await response.json();
        setTours(data);
      } catch (error) {
        setError('Impossible de charger les tournées');
        console.error(error);
      }
    };
    
    fetchTours();
  }, []);

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!selectedTour || !frequency) return;

      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:4000/tours/${selectedTour}/schedule?frequency=${frequency}`
        );
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération du calendrier');
        }
        const data = await response.json();
        const scheduleArray = Array.isArray(data) ? data : [];
        const dates = new Set(
          scheduleArray.map(schedule => format(new Date(schedule.DeliveryDate), 'yyyy-MM-dd'))
        );
        setSelectedDates(dates);
      } catch (error) {
        setError('Impossible de charger le calendrier');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [selectedTour, frequency]);

  const handleDateClick = async (date) => {
    // Logs pour le débogage
    console.log('--- Début handleDateClick ---');
    console.log('Date cliquée:', date);
    console.log('Format de la date:', format(date, 'yyyy-MM-dd'));
    console.log('Tournée sélectionnée:', selectedTour);
    console.log('Fréquence:', frequency);
    console.log('Dates déjà sélectionnées:', Array.from(selectedDates));

    // Vérification de la tournée
    if (!selectedTour) {
        console.log('Erreur: Aucune tournée sélectionnée');
        setError('Veuillez sélectionner une tournée');
        return;
    }

    // Vérifications existantes
    if (isHoliday(date) || isClosureWeek(date)) {
        console.log('Date non valide:', isHoliday(date) ? 'Jour férié' : 'Semaine de fermeture');
        return;
    }

    const dateStr = format(date, 'yyyy-MM-dd');
    const newSelectedDates = new Set(selectedDates);

    try {
        if (selectedDates.has(dateStr)) {
            console.log('Tentative de suppression de la date:', dateStr);
            const response = await fetch(
                `http://localhost:4000/tours/${selectedTour}/schedule/${dateStr}`,
                { method: 'DELETE' }
            );
            console.log('Réponse DELETE:', response.status);
            
            if (response.ok) {
                newSelectedDates.delete(dateStr);
                setSelectedDates(newSelectedDates);
                console.log('Date supprimée avec succès');
            }
        } else {
            console.log('Tentative d\'ajout de la date:', dateStr);
            const requestBody = {
                DeliveryDate: dateStr,
                Frequency: frequency,
                IsHoliday: false
            };
            console.log('Données envoyées:', requestBody);
            
            const response = await fetch(
                `http://localhost:4000/tours/${selectedTour}/schedule`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody)
                }
            );
            console.log('Réponse POST:', response.status);
            
            if (response.ok) {
                newSelectedDates.add(dateStr);
                setSelectedDates(newSelectedDates);
                console.log('Date ajoutée avec succès');
            } else {
                const errorData = await response.text();
                console.log('Erreur détaillée:', errorData);
            }
        }
    } catch (error) {
        console.error('Erreur complète:', error);
        setError('Erreur lors de la modification du calendrier');
    }
    
    console.log('--- Fin handleDateClick ---');
  };

  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const calendarDays = Array(firstDayOfMonth).fill(null);
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(new Date(currentYear, currentMonth, day));
    }
    return calendarDays;
  };

  const getCellStyle = (date) => {
    if (!date) return 'bg-transparent';
    
    const dateStr = format(date, 'yyyy-MM-dd');
    const baseStyle = 'h-16 flex items-center justify-center rounded-lg text-sm transition-colors duration-200';
    
    if (isHoliday(date)) {
      return `${baseStyle} bg-red-200 text-red-800 font-bold cursor-not-allowed`;
    }
    
    if (isClosureWeek(date)) {
      return `${baseStyle} bg-red-100 text-red-600 cursor-not-allowed`;
    }
    
    if (selectedDates.has(dateStr)) {
      return `${baseStyle} bg-green-200 text-green-800 font-bold cursor-pointer hover:bg-green-300`;
    }
    
    return `${baseStyle} bg-gray-100 text-gray-600 cursor-pointer hover:bg-gray-200`;
  };

  const changeMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(prev => prev - 1);
      } else {
        setCurrentMonth(prev => prev - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(prev => prev + 1);
      } else {
        setCurrentMonth(prev => prev + 1);
      }
    }
  };

  const daysOfWeek = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const calendarDays = generateCalendarDays();

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="border-b pb-4 mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-blue-600" />
          Planification des livraisons
        </h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Tournée
          </label>
          <div className="relative">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={selectedTour}
              onChange={(e) => setSelectedTour(e.target.value)}
              disabled={loading}
            >
              <option value="">Sélectionner une tournée</option>
              {tours.map((tour) => (
                <option key={tour.ID_Tournee} value={tour.ID_Tournee}>
                  {tour.Parcours}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Fréquence
          </label>
          <div className="relative">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              disabled={loading}
            >
              <option value="hebdomadaire">Hebdomadaire (50 paniers/an)</option>
              <option value="bimensuel">Bimensuel (25 paniers/an)</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <button
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
            onClick={() => changeMonth('prev')}
          >
            <ChevronLeft className="w-4 h-4" />
            Mois précédent
          </button>
          <h3 className="text-lg font-semibold">
            {format(new Date(currentYear, currentMonth), 'MMMM yyyy', { locale: fr })}
          </h3>
          <button
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
            onClick={() => changeMonth('next')}
          >
            Mois suivant
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 mb-2">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center text-gray-600 font-semibold py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((date, index) => (
            <div
              key={index}
              className={getCellStyle(date)}
              onClick={() => date && handleDateClick(date)}
            >
              {date ? date.getDate() : ''}
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-200 rounded"></div>
            <span>Jours fériés</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 rounded"></div>
            <span>Semaines de fermeture</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-200 rounded"></div>
            <span>Jours de livraison sélectionnés</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliverySchedule;