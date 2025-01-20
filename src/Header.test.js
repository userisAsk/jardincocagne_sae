import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header';
import { useAuth } from './context/AuthContext';

// Mock du context d'authentification
jest.mock('./context/AuthContext', () => ({
  useAuth: jest.fn()
}));

// Mock de window.scrollTo pour éviter les erreurs
window.scrollTo = jest.fn();

describe('Header Component', () => {
  // Configuration par défaut avant chaque test
  beforeEach(() => {
    // Reset du mock par défaut
    useAuth.mockReturnValue({
      isAuthenticated: false,
      logout: jest.fn(),
      user: null
    });

    // Reset du mock de window.scrollTo
    window.scrollTo.mockClear();
  });

  test('should render logo text', () => {
    render(
      <Router>
        <Header />
      </Router>
    );

    expect(screen.getByText('Jardin de Cocagne')).toBeInTheDocument();
  });

  test('should render navigation links', () => {
    render(
      <Router>
        <Header />
      </Router>
    );

    expect(screen.getByText('Accueil')).toBeInTheDocument();
    expect(screen.getByText('Créer tournée livraison')).toBeInTheDocument();
    expect(screen.getByText('Calendrier')).toBeInTheDocument();
    expect(screen.getByText('Abonnement')).toBeInTheDocument();
  });

  test('should render login and register buttons when not authenticated', () => {
    render(
      <Router>
        <Header />
      </Router>
    );

    expect(screen.getByText('Connexion')).toBeInTheDocument();
    expect(screen.getByText('Créer un compte')).toBeInTheDocument();
  });

  test('should render profile and logout buttons when authenticated', () => {
    // Configure le mock pour simuler un utilisateur authentifié
    useAuth.mockReturnValue({
      isAuthenticated: true,
      logout: jest.fn(),
      user: { name: 'Test User' }
    });

    render(
      <Router>
        <Header />
      </Router>
    );

    expect(screen.getByText('Mon compte')).toBeInTheDocument();
    expect(screen.getByText('Déconnexion')).toBeInTheDocument();
  });

  test('should call logout function when logout button is clicked', () => {
    const mockLogout = jest.fn();
    useAuth.mockReturnValue({
      isAuthenticated: true,
      logout: mockLogout,
      user: { name: 'Test User' }
    });

    render(
      <Router>
        <Header />
      </Router>
    );

    fireEvent.click(screen.getByText('Déconnexion'));
    expect(mockLogout).toHaveBeenCalled();
  });

  test('should have correct navigation links', () => {
    render(
      <Router>
        <Header />
      </Router>
    );

    expect(screen.getByText('Accueil').closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText('Créer tournée livraison').closest('a')).toHaveAttribute('href', '/delivery');
    expect(screen.getByText('Calendrier').closest('a')).toHaveAttribute('href', '/calendrier');
    expect(screen.getByText('Abonnement').closest('a')).toHaveAttribute('href', '/abonnement');
  });

  test('should have correct class based on scroll position', () => {
    render(
      <Router>
        <Header />
      </Router>
    );

    // Simuler le scroll avec act()
    act(() => {
      window.scrollY = 150;
      window.dispatchEvent(new Event('scroll'));
    });

    // Vérifier que le header a la classe appropriée
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('fixed');
  });
});
