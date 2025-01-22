import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Step = ({ number, title, description, isActive, isCompleted }) => (
  <div className="flex items-start space-x-4">
    <div 
      className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 transition-colors duration-200
      ${isActive ? 'bg-green-600 text-white' : 
        isCompleted ? 'bg-green-100 text-green-600' : 
        'bg-gray-100 text-gray-500'}`}
    >
      {isCompleted ? '✓' : number}
    </div>
    <div>
      <h3 className={`font-medium ${isActive ? 'text-green-600' : 'text-gray-900'}`}>
        {title}
      </h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  </div>
);

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

  // Étape actuelle
  const [step, setStep] = useState(1);

  // Dépôts
  const [depots, setDepots] = useState([]);
  const [selectedDepot, setSelectedDepot] = useState(null);
  const [loadingDepots, setLoadingDepots] = useState(true);

  // Date sélectionnée
  const [selectedDate, setSelectedDate] = useState(null);

  // Récupération des dépôts
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
        } catch (error) {
          console.error(error);
        } finally {
          setLoadingDepots(false);
        }
      };

      fetchDepots();
    }
  }, [step]);

  const getLabelClass = (isSelected) =>
    `border p-4 rounded-lg transition-all duration-200 hover:border-green-200 hover:bg-green-50 cursor-pointer
    ${isSelected ? "border-green-500 bg-green-50" : "border-gray-200"}`;

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
    const selectedDepotInfo = depots.find(depot => depot.ID_Point_Depot === selectedDepot);
    alert(
      `Votre abonnement est confirmé : Dépôt : ${selectedDepotInfo.Nom}, ${selectedDepotInfo.Adresse}`
    );
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

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Barre de progression verticale */}
          <div className="col-span-12 lg:col-span-3">
            <nav className="flex flex-col space-y-8 bg-white p-6 rounded-lg shadow-sm">
              <Step
                number="1"
                title="Abonnement"
                description="Choisissez vos formules"
                isActive={step === 1}
                isCompleted={step > 1}
              />
              <Step
                number="2"
                title="Point de dépôt"
                description="Sélectionnez votre lieu de retrait"
                isActive={step === 2}
                isCompleted={step > 2}
              />
              <Step
                number="3"
                title="Calendrier"
                description="Choisissez votre date de livraison"
                isActive={step === 3}
                isCompleted={step > 3}
              />
            </nav>
          </div>

          {/* Contenu principal */}
          <div className="col-span-12 lg:col-span-9">
            <div className="bg-white shadow-sm rounded-lg p-8">
              {step === 1 && (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <h1 className="text-2xl font-bold text-gray-900 mb-8">
                    Formules d'abonnement
                  </h1>

                  {/* Adhésion */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-medium text-gray-900">
                      Adhésion à l'association (obligatoire)
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className={getLabelClass(membership && !donation)}>
                        <input
                          type="radio"
                          name="membership"
                          className="hidden"
                          onChange={() => {
                            setMembership(true);
                            setDonation("");
                          }}
                        />
                        <div className="p-2">
                          <div className="font-medium">Cotisation simple</div>
                          <div className="text-sm text-gray-500">5 €</div>
                        </div>
                      </label>
                      <div className={getLabelClass(membership && donation)}>
                        <input
                          type="radio"
                          name="membership"
                          className="hidden"
                          onChange={() => setMembership(true)}
                        />
                        <div className="p-2">
                          <div className="font-medium">Cotisation avec don</div>
                          <div className="flex items-center mt-2">
                            <span className="mr-2">5 € +</span>
                            <input
                              type="number"
                              value={donation}
                              onChange={(e) => setDonation(e.target.value)}
                              className="border rounded p-1 w-20"
                              placeholder="€"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Légumes */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-medium text-gray-900">
                      Paniers de légumes
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <label className={getLabelClass(wantsVegetables)}>
                        <input
                          type="radio"
                          name="vegetables"
                          className="hidden"
                          onChange={() => setWantsVegetables(true)}
                        />
                        <div className="p-2">Oui</div>
                      </label>
                      <label className={getLabelClass(!wantsVegetables)}>
                        <input
                          type="radio"
                          name="vegetables"
                          className="hidden"
                          onChange={() => {
                            setWantsVegetables(false);
                            setVegetableFrequency("");
                            setVegetableFormula("");
                          }}
                        />
                        <div className="p-2">Non</div>
                      </label>
                    </div>
                    {wantsVegetables && (
                      <div className="space-y-4 pl-4 border-l-2 border-green-100">
                        <div>
                          <h3 className="font-medium mb-2">Fréquence</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <label className={getLabelClass(vegetableFrequency === "Hebdomadaire")}>
                              <input
                                type="radio"
                                className="hidden"
                                value="Hebdomadaire"
                                onChange={(e) => setVegetableFrequency(e.target.value)}
                              />
                              <div className="p-2">Hebdomadaire</div>
                            </label>
                            <label className={getLabelClass(vegetableFrequency === "Bimensuelle")}>
                              <input
                                type="radio"
                                className="hidden"
                                value="Bimensuelle"
                                onChange={(e) => setVegetableFrequency(e.target.value)}
                              />
                              <div className="p-2">Bimensuelle</div>
                            </label>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium mb-2">Formule</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <label className={getLabelClass(vegetableFormula === "Simple")}>
                              <input
                                type="radio"
                                className="hidden"
                                value="Simple"
                                onChange={(e) => setVegetableFormula(e.target.value)}
                              />
                              <div className="p-2">Simple</div>
                            </label>
                            <label className={getLabelClass(vegetableFormula === "Familial")}>
                              <input
                                type="radio"
                                className="hidden"
                                value="Familial"
                                onChange={(e) => setVegetableFormula(e.target.value)}
                              />
                              <div className="p-2">Familial</div>
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Œufs */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-medium text-gray-900">
                      Boîtes d'œufs
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <label className={getLabelClass(wantsEggs)}>
                        <input
                          type="radio"
                          name="eggs"
                          className="hidden"
                          onChange={() => setWantsEggs(true)}
                        />
                        <div className="p-2">Oui</div>
                      </label>
                      <label className={getLabelClass(!wantsEggs)}>
                        <input
                          type="radio"
                          name="eggs"
                          className="hidden"
                          onChange={() => {
                            setWantsEggs(false);
                            setEggFrequency("");
                            setEggFormula("");
                          }}
                        />
                        <div className="p-2">Non</div>
                      </label>
                    </div>
                    {wantsEggs && (
                      <div className="space-y-4 pl-4 border-l-2 border-green-100">
                        <div>
                          <h3 className="font-medium mb-2">Fréquence</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <label className={getLabelClass(eggFrequency === "Hebdomadaire")}>
                              <input
                                type="radio"
                                className="hidden"
                                value="Hebdomadaire"
                                onChange={(e) => setEggFrequency(e.target.value)}
                              />
                              <div className="p-2">Hebdomadaire</div>
                            </label>
                            <label className={getLabelClass(eggFrequency === "Bimensuelle")}>
                              <input
                                type="radio"
                                className="hidden"
                                value="Bimensuelle"
                                onChange={(e) => setEggFrequency(e.target.value)}
                              />
                              <div className="p-2">Bimensuelle</div>
                            </label>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium mb-2">Formule</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <label className={getLabelClass(eggFormula === "6 œufs")}>
                              <input
                                type="radio"
                                className="hidden"
                                value="6 œufs"
                                onChange={(e) => setEggFormula(e.target.value)}
                              />
                              <div className="p-2">6 œufs</div>
                            </label>
                            <label className={getLabelClass(eggFormula === "12 œufs")}>
                              <input
                                type="radio"
                                className="hidden"
                                value="12 œufs"
                                onChange={(e) => setEggFormula(e.target.value)}
                              />
                              <div className="p-2">12 œufs</div>
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Fruits */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-medium text-gray-900">
                      Paniers de fruits
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <label className={getLabelClass(wantsFruits)}>
                        <input
                          type="radio"
                          name="fruits"
                          className="hidden"
                          onChange={() => setWantsFruits(true)}
                        />
                        <div className="p-2">Oui</div>
                      </label>
                      <label className={getLabelClass(!wantsFruits)}>
                        <input
                          type="radio"
                          name="fruits"
                          className="hidden"
                          onChange={() => { setWantsFruits(false);
                            setFruitFrequency("");
                            setFruitFormula("");
                          }}
                        />
                        <div className="p-2">Non</div>
                      </label>
                    </div>
                    {wantsFruits && (
                      <div className="space-y-4 pl-4 border-l-2 border-green-100">
                        <div>
                          <h3 className="font-medium mb-2">Fréquence</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <label className={getLabelClass(fruitFrequency === "Hebdomadaire")}>
                              <input
                                type="radio"
                                className="hidden"
                                value="Hebdomadaire"
                                onChange={(e) => setFruitFrequency(e.target.value)}
                              />
                              <div className="p-2">Hebdomadaire</div>
                            </label>
                            <label className={getLabelClass(fruitFrequency === "Bimensuelle")}>
                              <input
                                type="radio"
                                className="hidden"
                                value="Bimensuelle"
                                onChange={(e) => setFruitFrequency(e.target.value)}
                              />
                              <div className="p-2">Bimensuelle</div>
                            </label>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium mb-2">Formule</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <label className={getLabelClass(fruitFormula === "Simple")}>
                              <input
                                type="radio"
                                className="hidden"
                                value="Simple"
                                onChange={(e) => setFruitFormula(e.target.value)}
                              />
                              <div className="p-2">Simple</div>
                            </label>
                            <label className={getLabelClass(fruitFormula === "Familial")}>
                              <input
                                type="radio"
                                className="hidden"
                                value="Familial"
                                onChange={(e)  => setFruitFormula(e.target.value)}
                              />
                              <div className="p-2">Familial</div>
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white p-4 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
                  >
                    Continuer
                  </button>
                </form>
              )}

              {step === 2 && (
                <div className="space-y-8">
                  <h1 className="text-2xl font-bold text-gray-900 mb-8">
                    Sélectionnez votre point de dépôt
                  </h1>
                  
                  {loadingDepots ? (
                    <div className="flex justify-center items-center min-h-[200px]">
                      <div className="text-gray-500">Chargement des dépôts...</div>
                    </div>
                  ) : depots.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {depots.map((depot) => (
  <label
    key={depot.ID_Point_Depot}
    className={getLabelClass(selectedDepot === depot.ID_Point_Depot)} // Changé de depot.Nom à depot.ID_Point_Depot
  >
    <input
      type="radio"
      name="depot"
      value={depot.ID_Point_Depot} // Changé de depot.Nom à depot.ID_Point_Depot
      onChange={() => setSelectedDepot(depot.ID_Point_Depot)} // Changé de depot.Nom à depot.ID_Point_Depot
      className="hidden"
    />
    <div className="p-4">
      <div className="font-medium text-gray-900">{depot.Nom}</div>
      <div className="text-sm text-gray-500 mt-1">{depot.Adresse}</div>
    </div>
  </label>
))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      Aucun dépôt disponible pour le moment.
                    </div>
                  )}

                  <button
                    onClick={handleDepotSubmit}
                    className="w-full bg-green-600 text-white p-4 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
                  >
                    Continuer
                  </button>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8">
                  <h1 className="text-2xl font-bold text-gray-900 mb-8">
                    Choisissez votre date de première livraison
                  </h1>
                  
                  <div className="flex flex-col items-center space-y-4">
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      minDate={new Date()}
                      dateFormat="dd/MM/yyyy"
                      className="w-full border border-gray-300 rounded-lg p-3 text-center"
                      placeholderText="Sélectionnez une date"
                    />
                    
                    <div className="text-sm text-gray-500">
                      Sélectionnez la date de votre première livraison
                    </div>
                  </div>

                  <button
                    onClick={handleDateSubmit}
                    className="w-full bg-green-600 text-white p-4 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 mt-8"
                  >
                    Confirmer mon abonnement
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Abonnement;