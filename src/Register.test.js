import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import Register from './connexion_pages/Register';
// Mock the router hook
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

// Mock the image import
jest.mock('../assets/illustration_reg.png', () => 'mocked-image.png');

describe('Register Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    useNavigate.mockImplementation(() => mockNavigate);
    global.fetch = jest.fn();
  });

  it('renders register form correctly', () => {
    render(<Register />);
    
    expect(screen.getByText('Votre meilleur travail commence ici')).toBeInTheDocument();
    expect(screen.getByLabelText('Nom')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmez le mot de passe')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Créer un compte' })).toBeInTheDocument();
  });

  it('shows error messages for empty form submission', async () => {
    render(<Register />);
    
    const submitButton = screen.getByRole('button', { name: 'Créer un compte' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Le nom est requis.")).toBeInTheDocument();
      expect(screen.getByText("L'email est requis.")).toBeInTheDocument();
    });
  });

  it('validates password length', async () => {
    render(<Register />);
    
    const passwordInput = screen.getByLabelText('Mot de passe');
    fireEvent.change(passwordInput, { target: { value: '123' } });

    await waitFor(() => {
      expect(screen.getByText('Mot de passe trop court, 8 caractères requis.')).toBeInTheDocument();
    });

    fireEvent.change(passwordInput, { target: { value: '12345678' } });

    await waitFor(() => {
      expect(screen.getByText('Longueur suffisante.')).toBeInTheDocument();
    });
  });

  it('validates matching passwords', async () => {
    render(<Register />);
    
    const passwordInput = screen.getByLabelText('Mot de passe');
    const confirmPasswordInput = screen.getByLabelText('Confirmez le mot de passe');

    fireEvent.change(passwordInput, { target: { value: '12345678' } });
    fireEvent.change(confirmPasswordInput, { target: { value: '12345677' } });

    const submitButton = screen.getByRole('button', { name: 'Créer un compte' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Les mots de passe ne correspondent pas.')).toBeInTheDocument();
    });
  });

  it('checks for existing email', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ exists: true }),
      })
    );

    render(<Register />);
    
    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    await waitFor(() => {
      expect(screen.getByText('Cet email est déjà utilisé.')).toBeInTheDocument();
    });
  });

  it('handles successful registration', async () => {
    global.fetch
      .mockImplementationOnce(() => // Email check
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ exists: false }),
        })
      )
      .mockImplementationOnce(() => // Registration
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: 'Success' }),
        })
      );

    render(<Register />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText('Nom'), { 
      target: { value: 'Test User' } 
    });
    fireEvent.change(screen.getByLabelText('Email'), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.change(screen.getByLabelText('Mot de passe'), { 
      target: { value: '12345678' } 
    });
    fireEvent.change(screen.getByLabelText('Confirmez le mot de passe'), { 
      target: { value: '12345678' } 
    });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: 'Créer un compte' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('handles registration error', async () => {
    global.fetch
      .mockImplementationOnce(() => // Email check
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ exists: false }),
        })
      )
      .mockImplementationOnce(() => // Registration
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ error: 'Registration failed' }),
        })
      );

    render(<Register />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText('Nom'), { 
      target: { value: 'Test User' } 
    });
    fireEvent.change(screen.getByLabelText('Email'), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.change(screen.getByLabelText('Mot de passe'), { 
      target: { value: '12345678' } 
    });
    fireEvent.change(screen.getByLabelText('Confirmez le mot de passe'), { 
      target: { value: '12345678' } 
    });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: 'Créer un compte' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Registration failed')).toBeInTheDocument();
    });
  });

  it('shows loading state during registration', async () => {
    global.fetch.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

    render(<Register />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText('Nom'), { 
      target: { value: 'Test User' } 
    });
    fireEvent.change(screen.getByLabelText('Email'), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.change(screen.getByLabelText('Mot de passe'), { 
      target: { value: '12345678' } 
    });
    fireEvent.change(screen.getByLabelText('Confirmez le mot de passe'), { 
      target: { value: '12345678' } 
    });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: 'Créer un compte' });
    fireEvent.click(submitButton);

    expect(screen.getByText('Création en cours...')).toBeInTheDocument();
  });
});