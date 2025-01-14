import React, { useState } from "react";

const Abonnement = () => {
  const [membership, setMembership] = useState(false);
  const [donation, setDonation] = useState("");
  const [frequency, setFrequency] = useState("");
  const [formula, setFormula] = useState("");
  const [eggsFrequency, setEggsFrequency] = useState("");
  const [eggsFormula, setEggsFormula] = useState("");
  const [fruitFrequency, setFruitFrequency] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Votre choix :
      - Adhésion : ${membership ? "Oui" : "Non"}
      - Don : ${donation}
      - Fréquence légumes : ${frequency}
      - Formule légumes : ${formula}
      - Fréquence œufs : ${eggsFrequency}
      - Formule œufs : ${eggsFormula}
      - Fréquence fruit : ${fruitFrequency}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 w-full max-w-3xl border border-gray-300 rounded-lg shadow-md"
        style={{ background: "#fdfaf5" }}
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-green-700">
          Formules
        </h1>

        {/* Adhésion */}
        <div className="mb-6">
          <h2 className="font-semibold text-green-700 mb-4">
            • J'adhère à l'association (obligatoire)
          </h2>
          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="membership"
                value="5€"
                onChange={() => setMembership(true)}
                className="mr-2"
              />
              Cotisation de 5 €
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="membership"
                value="donation"
                onChange={() => setMembership(true)}
                className="mr-2"
              />
              Cotisation de 5 € avec un don de
              <input
                type="number"
                onChange={(e) => setDonation(e.target.value)}
                placeholder="€"
                className="ml-2 p-1 border rounded w-16"
              />
            </label>
          </div>
        </div>

        {/* Paniers de légumes */}
        <div className="mb-6">
          <h2 className="font-semibold text-green-700 mb-4">
            • Je souhaite recevoir des paniers de légumes
          </h2>
          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="frequency"
                value="Oui"
                onChange={(e) => setFrequency(e.target.value)}
                className="mr-2"
              />
              Oui
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="frequency"
                value="Non"
                onChange={(e) => setFrequency(e.target.value)}
                className="mr-2"
              />
              Non
            </label>
          </div>

          {/* Fréquence légumes */}
          <h3 className="font-semibold text-green-700 mt-4">
            Choisissez la fréquence
          </h3>
          <div className="grid grid-cols-2 gap-4 mt-2">
              <label
                className={`flex items-center justify-center border ${
                  frequency === "Hebdomadaire"
                    ? "bg-green-200 border-green-600"
                    : "border-green-600"
                } rounded-md p-3 cursor-pointer hover:bg-green-100`}
              >
                <input
                  type="radio"
                  name="frequency"
                  value="Hebdomadaire"
                  onChange={(e) => setFrequency(e.target.value)}
                  className="hidden"
                />
                <span className="text-green-700 font-medium">Hebdomadaire</span>
              </label>
              <label
                className={`flex items-center justify-center border ${
                  frequency === "Bimensuelle"
                    ? "bg-green-200 border-green-600"
                    : "border-green-600"
                } rounded-md p-3 cursor-pointer hover:bg-green-100`}
              >
                <input
                  type="radio"
                  name="frequency"
                  value="Bimensuelle"
                  onChange={(e) => setFrequency(e.target.value)}
                  className="hidden"
                />
                <span className="text-green-700 font-medium">Bimensuelle</span>
              </label>
            </div>


          {/* Formule légumes */}
          <h3 className="font-semibold text-green-700 mt-4">
            Choisissez la formule
          </h3>
          <div className="grid grid-cols-2 gap-4 mt-2">
              <label
                className={`flex items-center justify-center border ${
                  formula === "Panier simple"
                    ? "bg-green-200 border-green-600"
                    : "border-green-600"
                } rounded-md p-3 cursor-pointer hover:bg-green-100`}
              >
                <input
                  type="radio"
                  name="formula"
                  value="Panier simple"
                  onChange={(e) => setFormula(e.target.value)}
                  className="hidden"
                />
                <span className="text-green-700 font-medium">Panier simple</span>
              </label>
              <label
                className={`flex items-center justify-center border ${
                  formula === "Panier familial"
                    ? "bg-green-200 border-green-600"
                    : "border-green-600"
                } rounded-md p-3 cursor-pointer hover:bg-green-100`}
              >
                <input
                  type="radio"
                  name="formula"
                  value="Panier familial"
                  onChange={(e) => setFormula(e.target.value)}
                  className="hidden"
                />
                <span className="text-green-700 font-medium">Panier familial</span>
              </label>
            </div>
        </div>

        {/* Boîtes d'œufs */}
        <div className="mb-6">
          <h2 className="font-semibold text-green-700 mb-4">
            • Je souhaite recevoir des boîtes d'œufs
          </h2>
          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="eggsFrequency"
                value="Oui"
                onChange={(e) => setEggsFrequency(e.target.value)}
                className="mr-2"
              />
              Oui
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="eggsFrequency"
                value="Non"
                onChange={(e) => setEggsFrequency(e.target.value)}
                className="mr-2"
              />
              Non
            </label>
          </div>

          {/* Fréquence œufs */}
          <h3 className="font-semibold text-green-700 mt-4">
            Choisissez la fréquence
          </h3>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <label
              className={`flex items-center justify-center border ${
                eggsFrequency === "Hebdomadaire"
                  ? "bg-green-200 border-green-600"
                  : "border-green-600"
              } rounded-md p-3 cursor-pointer hover:bg-green-100`}
            >
              <input
                type="radio"
                name="eggsFrequency"
                value="Hebdomadaire"
                onChange={(e) => setEggsFrequency(e.target.value)}
                className="hidden"
              />
              <span className="text-green-700 font-medium">Hebdomadaire</span>
            </label>
            <label
              className={`flex items-center justify-center border ${
                eggsFrequency === "Bimensuelle"
                  ? "bg-green-200 border-green-600"
                  : "border-green-600"
              } rounded-md p-3 cursor-pointer hover:bg-green-100`}
            >
              <input
                type="radio"
                name="eggsFrequency"
                value="Bimensuelle"
                onChange={(e) => setEggsFrequency(e.target.value)}
                className="hidden"
              />
              <span className="text-green-700 font-medium">Bimensuelle</span>
            </label>
          </div>



          {/* Formule œufs */}
          <h3 className="font-semibold text-green-700 mt-4">
            Choisissez la formule
          </h3>
          <div className="grid grid-cols-3 gap-4 mt-2">
            <label
              className={`flex items-center justify-center border ${
                eggsFormula === "1 boîte de 6 œufs"
                  ? "bg-green-200 border-green-600"
                  : "border-green-600"
              } rounded-md p-3 cursor-pointer hover:bg-green-100`}
            >
              <input
                type="radio"
                name="eggsFormula"
                value="1 boîte de 6 œufs"
                onChange={(e) => setEggsFormula(e.target.value)}
                className="hidden"
              />
              <span className="text-green-700 font-medium">
                1 boîte de 6 œufs
              </span>
            </label>
            <label
              className={`flex items-center justify-center border ${
                eggsFormula === "2 boîtes de 6 œufs"
                  ? "bg-green-200 border-green-600"
                  : "border-green-600"
              } rounded-md p-3 cursor-pointer hover:bg-green-100`}
            >
              <input
                type="radio"
                name="eggsFormula"
                value="2 boîtes de 6 œufs"
                onChange={(e) => setEggsFormula(e.target.value)}
                className="hidden"
              />
              <span className="text-green-700 font-medium">
                2 boîtes de 6 œufs
              </span>
            </label>
            <label
              className={`flex items-center justify-center border ${
                eggsFormula === "3 boîtes de 6 œufs"
                  ? "bg-green-200 border-green-600"
                  : "border-green-600"
              } rounded-md p-3 cursor-pointer hover:bg-green-100`}
            >
              <input
                type="radio"
                name="eggsFormula"
                value="3 boîtes de 6 œufs"
                onChange={(e) => setEggsFormula(e.target.value)}
                className="hidden"
              />
              <span className="text-green-700 font-medium">
                3 boîtes de 6 œufs
              </span>
            </label>
          </div>

        </div>
        {/* Paniers de fruits */}
<div className="mb-6">
  <h2 className="font-semibold text-green-700 mb-4">
    • Je souhaite recevoir des paniers de fruits
  </h2>
  <div className="flex items-center space-x-6">
    <label className="flex items-center">
      <input
        type="radio"
        name="fruitFrequency"
        value="Oui"
        onChange={(e) => setFruitFrequency(e.target.value)}
        className="mr-2"
      />
      Oui
    </label>
    <label className="flex items-center">
      <input
        type="radio"
        name="fruitFrequency"
        value="Non"
        onChange={(e) => setFruitFrequency(e.target.value)}
        className="mr-2"
      />
      Non
    </label>
  </div>

  {/* Fréquence des paniers de fruits */}
  <h3 className="font-semibold text-green-700 mt-4">
    Choisissez la fréquence
  </h3>
  <div className="grid grid-cols-2 gap-4 mt-2">
    <label
      className={`flex items-center justify-center border ${
        fruitFrequency === "Hebdomadaire"
          ? "bg-green-200 border-green-600"
          : "border-green-600"
      } rounded-md p-3 cursor-pointer hover:bg-green-100`}
    >
      <input
        type="radio"
        name="fruitFrequency"
        value="Hebdomadaire"
        onChange={(e) => setFruitFrequency(e.target.value)}
        className="hidden"
      />
      <span className="text-green-700 font-medium">Hebdomadaire</span>
    </label>
    <label
      className={`flex items-center justify-center border ${
        fruitFrequency === "Bimensuelle"
          ? "bg-green-200 border-green-600"
          : "border-green-600"
      } rounded-md p-3 cursor-pointer hover:bg-green-100`}
    >
      <input
        type="radio"
        name="fruitFrequency"
        value="Bimensuelle"
        onChange={(e) => setFruitFrequency(e.target.value)}
        className="hidden"
      />
      <span className="text-green-700 font-medium">Bimensuelle</span>
    </label>
  </div>
</div>


        <button
          type="submit"
          className="w-full bg-green-600 text-white p-3 rounded font-bold hover:bg-green-700"
        >
          Valider
        </button>
      </form>
    </div>
  );
};

export default Abonnement;
