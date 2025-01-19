import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Abonnement = () => {
  // États pour l'adhésion
  const [membership, setMembership] = useState(false);
  const [donation, setDonation] = useState("");

  // États pour les légumes
  const [wantsVegetables, setWantsVegetables] = useState(false);
  const [vegetableFrequency, setVegetableFrequency] = useState("");
  const [vegetableFormula, setVegetableFormula] = useState("");

  // États pour les œufs
  const [wantsEggs, setWantsEggs] = useState(false);
  const [eggFrequency, setEggFrequency] = useState("");
  const [eggFormula, setEggFormula] = useState("");

  // États pour les fruits
  const [wantsFruits, setWantsFruits] = useState(false);
  const [fruitFrequency, setFruitFrequency] = useState("");
  const [fruitFormula, setFruitFormula] = useState("");

  // Étape actuelle du formulaire
  const [step, setStep] = useState(1);

  // Dépôts
  const [depots, setDepots] = useState([]);
  const [selectedDepot, setSelectedDepot] = useState("");
  const [loadingDepots, setLoadingDepots] = useState(true);

  // Date sélectionnée
  const [selectedDate, setSelectedDate] = useState(null);

  // Récupération des dépôts depuis l'API
  useEffect(() => {
    if (step === 2) {
      const fetchDepots = async () => {
        try {
          setLoadingDepots(true);
          const response = await fetch("http://localhost:4000/depots");
          if (!response.ok) {
            throw new Error("Erreur lors de la récupération des dépôts");
          }
          const data = await response.json();
          setDepots(data);
          setLoadingDepots(false);
        } catch (error) {
          console.error(error);
          setLoadingDepots(false);
        }
      };

      fetchDepots();
    }
  }, [step]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!membership) {
      alert("L'adhésion est obligatoire.");
      return;
    }

    setStep(2);
  };

  const handleDepotSubmit = () => {
    if (!selectedDepot) {
      alert("Veuillez sélectionner un dépôt.");
      return;
    }

    setStep(3);
  };

  const handleDateSubmit = () => {
    if (!selectedDate) {
      alert("Veuillez sélectionner une date de livraison.");
      return;
    }

    alert(
      `Votre abonnement est confirmé : Dépôt : ${selectedDepot}, Livraison le : ${selectedDate.toLocaleDateString()}`
    );
  };

  const getLabelClass = (isSelected) =>
    `border p-3 rounded-md flex items-center justify-center cursor-pointer transition-colors duration-200 ${
      isSelected ? "bg-green-200 border-green-500" : "border-gray-300 hover:bg-green-100"
    }`;

  const progressPercentage = () => {
    switch (step) {
      case 1:
        return 33;
      case 2:
        return 66;
      case 3:
        return 100;
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center mt-32">
      {/* Barre de progression */}
      <div className="w-full max-w-3xl mb-4 px-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Étape {step} sur 3</span>
          <span>
            {step === 1 ? "Abonnement" : step === 2 ? "Dépôt" : "Calendrier"}
          </span>
        </div>
        <div className="relative w-full h-2 bg-gray-200 rounded-full">
          <div
            className="absolute h-full bg-green-500 rounded-full"
            style={{ width: `${progressPercentage()}%` }}
          ></div>
        </div>
      </div>

      {step === 1 && (
        <form
          onSubmit={handleSubmit}
          className="p-6 w-full max-w-3xl space-y-8"
        >
          <h1 className="text-3xl font-bold mb-6 text-center text-green-700">
            Formules d'abonnement
          </h1>

          {/* Adhésion */}
          <div>
            <h2 className="font-semibold text-green-700 mb-4">
              • J'adhère à l'association (obligatoire)
            </h2>
            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="membership"
                  onChange={() => {
                    setMembership(true);
                    setDonation("");
                  }}
                  className="mr-2"
                />
                Cotisation de 5 €
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="membership"
                  onChange={() => setMembership(true)}
                  className="mr-2"
                />
                Cotisation de 5 € avec un don de
                <input
                  type="number"
                  value={donation}
                  onChange={(e) => setDonation(e.target.value)}
                  placeholder="€"
                  className="ml-2 p-1 border rounded w-16"
                />
              </label>
            </div>
          </div>

          {/* Paniers de légumes */}
          <div>
            <h2 className="font-semibold text-green-700 mb-4">
              • Paniers de légumes
            </h2>
            <div className="flex space-x-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="vegetables"
                  onChange={() => setWantsVegetables(true)}
                  className="mr-2"
                />
                Oui
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="vegetables"
                  onChange={() => {
                    setWantsVegetables(false);
                    setVegetableFrequency("");
                    setVegetableFormula("");
                  }}
                  className="mr-2"
                />
                Non
              </label>
            </div>
            {wantsVegetables && (
              <>
                <h3 className="mt-4 font-semibold">Fréquence</h3>
                <div className="flex space-x-6">
                  <label className={getLabelClass(vegetableFrequency === "Hebdomadaire")}>
                    <input
                      type="radio"
                      value="Hebdomadaire"
                      onChange={(e) => setVegetableFrequency(e.target.value)}
                      className="hidden"
                    />
                    Hebdomadaire
                  </label>
                  <label className={getLabelClass(vegetableFrequency === "Bimensuelle")}>
                    <input
                      type="radio"
                      value="Bimensuelle"
                      onChange={(e) => setVegetableFrequency(e.target.value)}
                      className="hidden"
                    />
                    Bimensuelle
                  </label>
                </div>
                <h3 className="mt-4 font-semibold">Formule</h3>
                <div className="flex space-x-6">
                  <label className={getLabelClass(vegetableFormula === "Simple")}>
                    <input
                      type="radio"
                      value="Simple"
                      onChange={(e) => setVegetableFormula(e.target.value)}
                      className="hidden"
                    />
                    Simple
                  </label>
                  <label className={getLabelClass(vegetableFormula === "Familial")}>
                    <input
                      type="radio"
                      value="Familial"
                      onChange={(e) => setVegetableFormula(e.target.value)}
                      className="hidden"
                    />
                    Familial
                  </label>
                </div>
              </>
            )}
          </div>

          {/* Boîtes d'œufs */}
          <div>
            <h2 className="font-semibold text-green-700 mb-4">• Boîtes d'œufs</h2>
            <div className="flex space-x-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="eggs"
                  onChange={() => setWantsEggs(true)}
                  className="mr-2"
                />
                Oui
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="eggs"
                  onChange={() => {
                    setWantsEggs(false);
                    setEggFrequency("");
                    setEggFormula("");
                  }}
                  className="mr-2"
                />
                Non
              </label>
            </div>
            {wantsEggs && (
              <>
                <h3 className="mt-4 font-semibold">Fréquence</h3>
                <div className="flex space-x-6">
                  <label className={getLabelClass(eggFrequency === "Hebdomadaire")}>
                    <input
                      type="radio"
                      value="Hebdomadaire"
                      onChange={(e) => setEggFrequency(e.target.value)}
                      className="hidden"
                    />
                    Hebdomadaire
                  </label>
                  <label className={getLabelClass(eggFrequency === "Bimensuelle")}>
                    <input
                      type="radio"
                      value="Bimensuelle"
                      onChange={(e) => setEggFrequency(e.target.value)}
                      className="hidden"
                    />
                    Bimensuelle
                  </label>
                </div>
                <h3 className="mt-4 font-semibold">Formule</h3>
                <div className="flex space-x-6">
                  <label className={getLabelClass(eggFormula === "6 œufs")}>
                    <input
                      type="radio"
                      value="6 œufs"
                      onChange={(e) => setEggFormula(e.target.value)}
                      className="hidden"
                    />
                    6 œufs
                  </label>
                  <label className={getLabelClass(eggFormula === "12 œufs")}>
                    <input
                      type="radio"
                      value="12 œufs"
                      onChange={(e) => setEggFormula(e.target.value)}
                      className="hidden"
                    />
                    12 œufs
                  </label>
                </div>
              </>
            )}
          </div>

          {/* Paniers de fruits */}
          <div>
            <h2 className="font-semibold text-green-700 mb-4">• Paniers de fruits</h2>
            <div className="flex space-x-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="fruits"
                  onChange={() => setWantsFruits(true)}
                  className="mr-2"
                />
                Oui
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="fruits"
                  onChange={() => {
                    setWantsFruits(false);
                    setFruitFrequency("");
                    setFruitFormula("");
                  }}
                  className="mr-2"
                />
                Non
              </label>
            </div>
            {wantsFruits && (
              <>
                <h3 className="mt-4 font-semibold">Fréquence</h3>
                <div className="flex space-x-6">
                  <label className={getLabelClass(fruitFrequency === "Hebdomadaire")}>
                    <input
                      type="radio"
                      value="Hebdomadaire"
                      onChange={(e) => setFruitFrequency(e.target.value)}
                      className="hidden"
                    />
                    Hebdomadaire
                  </label>
                  <label className={getLabelClass(fruitFrequency === "Bimensuelle")}>
                    <input
                      type="radio"
                      value="Bimensuelle"
                      onChange={(e) => setFruitFrequency(e.target.value)}
                      className="hidden"
                    />
                    Bimensuelle
                  </label>
                </div>
                <h3 className="mt-4 font-semibold">Formule</h3>
                <div className="flex space-x-6">
                  <label className={getLabelClass(fruitFormula === "Simple")}>
                    <input
                      type="radio"
                      value="Simple"
                      onChange={(e) => setFruitFormula(e.target.value)}
                      className="hidden"
                    />
                    Simple
                  </label>
                  <label className={getLabelClass(fruitFormula === "Familial")}>
                    <input
                      type="radio"
                      value="Familial"
                      onChange={(e) => setFruitFormula(e.target.value)}
                      className="hidden"
                    />
                    Familial
                  </label>
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white p-3 rounded font-bold hover:bg-green-700"
          >
            Valider
          </button>
        </form>
      )}

      {step === 2 && (
        <div className="p-6 w-full max-w-3xl space-y-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-green-700">
            Sélectionnez un dépôt
          </h1>
          {loadingDepots ? (
            <p className="text-center text-gray-500">Chargement des dépôts...</p>
          ) : depots.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {depots.map((depot) => (
                <label
                  key={depot.ID_Point_Depot}
                  className={getLabelClass(selectedDepot === depot.Nom)}
                >
                  <input
                    type="radio"
                    name="depot"
                    value={depot.Nom}
                    onChange={() => setSelectedDepot(depot.Nom)}
                    className="hidden"
                  />
                  <div className="text-center">
                    <span className="font-bold text-green-700">{depot.Nom}</span>
                    <p className="text-sm text-gray-600">{depot.Adresse}</p>
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-center text-red-500">Aucun dépôt trouvé.</p>
          )}
          <button
            onClick={handleDepotSubmit}
            className="w-full bg-green-600 text-white p-3 rounded font-bold hover:bg-green-700"
          >
            Confirmer
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="p-6 w-full max-w-3xl space-y-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-green-700">
            Sélectionnez une date de livraison
          </h1>
          <div className="flex flex-col items-center">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              minDate={new Date()}
              dateFormat="dd/MM/yyyy"
              className="border p-2 rounded-md"
            />
          </div>
          <button
            onClick={handleDateSubmit}
            className="w-full bg-green-600 text-white p-3 rounded font-bold hover:bg-green-700"
          >
            Confirmer
          </button>
        </div>
      )}
    </div>
  );
};

export default Abonnement;
