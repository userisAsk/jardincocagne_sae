import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeliveryManagement from '../src/pages/Tournee';

// Mock fetch for API calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]),
  })
);

describe('DeliveryManagement Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders header correctly', () => {
    render(<DeliveryManagement />);
    const headerElement = screen.getByText(/Gestion des Tournées de Livraison/i);
    expect(headerElement).toBeInTheDocument();
  });

  test('displays loading spinner when fetching data', async () => {
    render(<DeliveryManagement />);
    expect(screen.getByText(/Chargement.../i)).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText(/Chargement.../i)).not.toBeInTheDocument());
  });

  test('filters tours based on delivery date', async () => {
    render(<DeliveryManagement />);
    const dateInput = screen.getByLabelText(/Date de livraison/i);
    fireEvent.change(dateInput, { target: { value: '2023-01-01' } });
    await waitFor(() => {
      const tours = screen.getAllByText(/Tournée/i);
      expect(tours.length).toBeGreaterThan(0);
    });
  });

  test('selecting a tour displays its points', async () => {
    const mockTours = [
      { ID_Tournee: 1, Parcours: 'Mardi', Jour_Livraison: '2023-01-01' },
    ];
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockTours),
      })
    );

    render(<DeliveryManagement />);
    const tourButton = await screen.findByText(/Mardi/i);
    fireEvent.click(tourButton);

    await waitFor(() => {
      expect(screen.getByText(/Points de la tournée/i)).toBeInTheDocument();
    });
  });

  test('adds a depot to a tour', async () => {
    render(<DeliveryManagement />);
    const depotSelect = screen.getByLabelText(/Sélectionner un dépôt/i);

    fireEvent.change(depotSelect, { target: { value: 'Depot1' } });
    const addDepotButton = screen.getByText(/Ajouter le point/i);
    fireEvent.click(addDepotButton);

    await waitFor(() => {
      expect(screen.getByText(/Depot1/i)).toBeInTheDocument();
    });
  });

  test('removes a point from a tour', async () => {
    const mockPoints = [
      { ID_Point_Depot: 1, Nom: 'Point 1', Latitude: 48.8566, Longitude: 2.3522 },
    ];

    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ points: mockPoints }),
      })
    );

    render(<DeliveryManagement />);
    const deleteButton = await screen.findByText(/Supprimer/i);
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText(/Point 1/i)).not.toBeInTheDocument();
    });
  });
});
