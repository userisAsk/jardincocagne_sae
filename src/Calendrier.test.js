import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock des modules externes
jest.mock('lucide-react', () => ({
  Calendar: () => <div data-testid="calendar-icon">Calendar Icon</div>,
  ChevronDown: () => <div>ChevronDown Icon</div>,
  ChevronLeft: () => <div>ChevronLeft Icon</div>,
  ChevronRight: () => <div>ChevronRight Icon</div>
}));



jest.mock('date-fns', () => ({
  format: jest.fn((date) => date.toISOString()),
  isWithinInterval: jest.fn(),
  startOfWeek: jest.fn(),
  endOfWeek: jest.fn(),
  getWeek: jest.fn(() => 25), // semaine normale par défaut
  getYear: jest.fn(() => 2025)
}));

jest.mock('date-fns/locale', () => ({
  fr: {}
}));

// Importer le composant après les mocks
import DeliverySchedule from './pages/Calendrier';

// Mock de fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('DeliverySchedule Component', () => {
  beforeEach(() => {
    // Reset des mocks avant chaque test
    jest.clearAllMocks();
    mockFetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { ID_Tournee: 1, Parcours: "Tournée 1" },
          { ID_Tournee: 2, Parcours: "Tournée 2" }
        ])
      })
    );
  });

  test('renders main elements', async () => {
    await act(async () => {
      render(<DeliverySchedule />);
    });

    expect(screen.getByText('Planification du calendrier')).toBeInTheDocument();
    expect(screen.getByTestId('calendar-icon')).toBeInTheDocument();
  });

  test('renders frequency selector', async () => {
    await act(async () => {
      render(<DeliverySchedule />);
    });

    const frequencyOptions = [
      'Hebdomadaire (50 paniers/an)',
      'Bimensuel (25 paniers/an)'
    ];

    frequencyOptions.forEach(option => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  test('renders delivery tour selector', async () => {
    await act(async () => {
      render(<DeliverySchedule />);
    });

    expect(screen.getByText('Sélectionner une tournée')).toBeInTheDocument();
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:4000/tours');
  });

  test('handles failed API call', async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.reject(new Error('API Error'))
    );

    await act(async () => {
      render(<DeliverySchedule />);
    });

    expect(screen.getByText('Impossible de charger les tournées')).toBeInTheDocument();
  });

  test('handles tour selection', async () => {
    await act(async () => {
      render(<DeliverySchedule />);
    });

    const select = screen.getByLabelText(/Tournée/i);
    
    await act(async () => {
      fireEvent.change(select, { target: { value: '1' } });
    });

    expect(mockFetch).toHaveBeenCalledTimes(2); // Une fois pour le chargement initial, une fois pour la sélection
  });

  test('renders calendar days', async () => {
    await act(async () => {
      render(<DeliverySchedule />);
    });

    const weekdays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    weekdays.forEach(day => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  test('renders calendar legend', async () => {
    await act(async () => {
      render(<DeliverySchedule />);
    });

    const legendItems = [
      'Jours fériés',
      'Semaines de fermeture',
      'Jours de livraison sélectionnés'
    ];

    legendItems.forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });
});