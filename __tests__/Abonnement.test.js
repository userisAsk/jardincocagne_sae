import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import Abonnement from "../src/pages/Abonnement";
// Mock fetch pour les données de dépôt
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([
      {
        ID_Point_Depot: 1,
        Nom: "Dépôt Centre",
        Adresse: "123 rue Example"
      },
      {
        ID_Point_Depot: 2,
        Nom: "Dépôt Nord",
        Adresse: "456 avenue Test"
      }
    ])
  })
);

// Mock window.alert
const mockAlert = jest.fn();
window.alert = mockAlert;

describe("Composant Abonnement", () => {
  beforeEach(() => {
    // Réinitialiser tous les mocks avant chaque test
    jest.clearAllMocks();
  });

  test("affiche l'étape initiale avec le formulaire d'abonnement", () => {
    render(<Abonnement />);
    
    expect(
      screen.getByRole("heading", { name: /Formules d'abonnement/i })
    ).toBeInTheDocument();
    
    expect(
      screen.getByRole("button", { name: /Valider/i })
    ).toBeInTheDocument();
  });

  test("affiche une erreur si l'abonnement n'est pas sélectionné", async () => {
    render(<Abonnement />);
    
    fireEvent.click(screen.getByRole("button", { name: /Valider/i }));
    
    expect(mockAlert).toHaveBeenCalledWith("L'adhésion est obligatoire.");
  });

  test("passe à l'étape de sélection du dépôt lorsque l'abonnement est sélectionné", async () => {
    render(<Abonnement />);

    // Sélectionner l'option d'abonnement en utilisant une requête plus spécifique
    const subscriptionInputs = screen.getAllByRole('radio', { name: /Cotisation de 5 €(?!\s*avec)/i });
    fireEvent.click(subscriptionInputs[0]);

    // Cliquer sur le bouton de validation
    fireEvent.click(screen.getByRole("button", { name: /Valider/i }));

    // Attendre que l'étape de sélection du dépôt apparaisse
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /Sélectionnez un dépôt/i })
      ).toBeInTheDocument();
    });
  });

  test("affiche une erreur si aucun dépôt n'est sélectionné", async () => {
    render(<Abonnement />);

    // Sélectionner l'abonnement avec une requête plus spécifique
    const subscriptionInputs = screen.getAllByRole('radio', { name: /Cotisation de 5 €(?!\s*avec)/i });
    fireEvent.click(subscriptionInputs[0]);
    
    fireEvent.click(screen.getByRole("button", { name: /Valider/i }));

    // Attendre que l'étape de sélection du dépôt se charge
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /Sélectionnez un dépôt/i })
      ).toBeInTheDocument();
    });

    // Essayer de confirmer sans sélectionner de dépôt
    fireEvent.click(screen.getByRole("button", { name: /Confirmer/i }));

    expect(mockAlert).toHaveBeenCalledWith("Veuillez sélectionner un dépôt.");
  });

  test("passe à l'étape du calendrier lorsque un dépôt est sélectionné", async () => {
    render(<Abonnement />);

    // Sélectionner l'abonnement avec une requête plus spécifique
    const subscriptionInputs = screen.getAllByRole('radio', { name: /Cotisation de 5 €(?!\s*avec)/i });
    fireEvent.click(subscriptionInputs[0]);
    
    fireEvent.click(screen.getByRole("button", { name: /Valider/i }));

    // Attendre que les dépôts se chargent et soient affichés
    await waitFor(() => {
      expect(screen.getByText("Dépôt Centre")).toBeInTheDocument();
    });

    // Sélectionner un dépôt
    fireEvent.click(screen.getByText("Dépôt Centre"));

    // Cliquer sur le bouton de confirmation
    fireEvent.click(screen.getByRole("button", { name: /Confirmer/i }));

    // Vérifier que l'étape du calendrier est affichée
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /Sélectionnez une date de livraison/i })
      ).toBeInTheDocument();
    });
  });
});
