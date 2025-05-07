import axios from "axios";
import React, { useEffect, useState } from "react";
import { CONFIG } from "../config/config";

const NewAnimal = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [chipNumber, setChipNumber] = useState("");
  const [tattoo, setTattoo] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedSpecie, setSelectedSpecie] = useState("");
  const [selectedRace, setSelectedRace] = useState("");
  const [species, setSpecies] = useState([]);
  const [races, setRaces] = useState([]);
  const [filteredRaces, setFilteredRaces] = useState([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const genders = [
    { value: "mâle", label: "Mâle" },
    { value: "femelle", label: "Femelle" },
  ];

  useEffect(() => {
    // Charger les espèces depuis l'API
    axios
      .get(`${CONFIG.API_BASE_URL}/specie`, { withCredentials: true })
      .then((response) => setSpecies(response.data))
      .catch((error) => console.error("Erreur lors de la récupération des espèces:", error));
  }, []);

  useEffect(() => {
    // Charger les races depuis l'API
    axios
      .get(`${CONFIG.API_BASE_URL}/race`, { withCredentials: true })
      .then((response) => setRaces(response.data))
      .catch((error) => console.error("Erreur lors de la récupération des races:", error));
  }, []);

  useEffect(() => {
    // Filtrer les races en fonction de l'espèce sélectionnée
    if (selectedSpecie) {
      const filtered = races.filter((race) => race.id_specie === parseInt(selectedSpecie));
      setFilteredRaces(filtered);
    } else {
      setFilteredRaces([]);
    }
  }, [selectedSpecie, races]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file); // Stocke le fichier dans l'état
      setSelectedImage(URL.createObjectURL(file)); // Prévisualisation de l'image
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    // Ajouter les champs texte
    formData.append("name", name);
    formData.append("birth_date", birthDate);
    formData.append("gender", selectedGender);
    formData.append("num_chip", chipNumber);
    formData.append("tattoo", tattoo);
    formData.append("id_race", selectedRace);
    formData.append("id_client", "1");

    // Ajouter l'image si elle est sélectionnée
    if (selectedFile) {
      formData.append("photo", selectedFile);
    } else {
      console.error("Aucune image sélectionnée !");
      return;
    }

    try {
      const response = await axios.post(`${CONFIG.API_BASE_URL}/animal`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Animal ajouté avec succès:", response.data);
      // Rediriger ou afficher un message de succès
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'animal:", error);
    }
  };

  const steps = [
    {
      title: "Informations générales",
      content: (
        <div>
          <label className="block">
            <span className="text-[#ff3769] font-medium">Nom de l'animal</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Rex"
              className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-[#ff3769] focus:border-[#ff3769] px-4 py-2"
            />
          </label>
          <label className="block mt-4">
            <span className="text-[#ff3769] font-medium">Date de naissance</span>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-[#ff3769] focus:border-[#ff3769] px-4 py-2"
            />
          </label>
          <label className="block mt-4">
            <span className="text-[#ff3769] font-medium">Le sexe</span>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-[#ff3769] focus:border-[#ff3769] px-4 py-2"
            >
              <option value="">Sélectionnez le sexe</option>
              {genders.map((gender) => (
                <option key={gender.value} value={gender.value}>
                  {gender.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      ),
    },
    {
      title: "Identification",
      content: (
        <div>
          <label className="block">
            <span className="text-[#ff3769] font-medium">Numéro de puce</span>
            <input
              type="text"
              value={chipNumber}
              onChange={(e) => setChipNumber(e.target.value)}
              placeholder="Entrez le numéro de puce"
              className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-[#ff3769] focus:border-[#ff3769] px-4 py-2"
            />
          </label>
          <label className="block mt-4">
            <span className="text-[#ff3769] font-medium">Tatouage</span>
            <input
              type="text"
              value={tattoo}
              onChange={(e) => setTattoo(e.target.value)}
              placeholder="Entrez le tatouage"
              className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-[#ff3769] focus:border-[#ff3769] px-4 py-2"
            />
          </label>
        </div>
      ),
    },
    {
      title: "Espèce et Race",
      content: (
        <div>
          <label className="block">
            <span className="text-[#ff3769] font-medium">L'espèce</span>
            <select
              value={selectedSpecie}
              onChange={(e) => setSelectedSpecie(e.target.value)}
              className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-[#ff3769] focus:border-[#ff3769] px-4 py-2"
            >
              <option value="">Sélectionnez l'espèce</option>
              {species.map((specie) => (
                <option key={specie.id} value={specie.id}>
                  {specie.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block mt-4">
            <span className="text-[#ff3769] font-medium">Race</span>
            <select
              value={selectedRace}
              onChange={(e) => setSelectedRace(e.target.value)}
              disabled={!selectedSpecie}
              className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-[#ff3769] focus:border-[#ff3769] px-4 py-2"
            >
              <option value="">Sélectionnez la race</option>
              {filteredRaces.map((race) => (
                <option key={race.id} value={race.id}>
                  {race.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      ),
    },
    {
      title: "Photo",
      content: (
        <div>
          <label className="block">
            <span className="text-[#ff3769] font-medium">Ajouter une photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-[#ff3769] focus:border-[#ff3769] px-4 py-2"
            />
          </label>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Prévisualisation"
              className="mt-4 w-32 h-32 object-cover rounded-lg"
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-[#ff3769] mb-8">Ajouter un Animal</h1>
      <div className="mb-8">{steps[currentStep].content}</div>
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
          disabled={currentStep === 0}
          className="px-6 py-3 bg-gray-300 rounded-lg hover:bg-gray-400 disabled:opacity-50"
        >
          Retour
        </button>
        {currentStep === steps.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-[#ff3769] text-white rounded-lg hover:bg-[#e0325e]"
          >
            Soumettre
          </button>
        ) : (
          <button
            onClick={() => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))}
            className="px-6 py-3 bg-[#ff3769] text-white rounded-lg hover:bg-[#e0325e]"
          >
            Suivant
          </button>
        )}
      </div>
    </div>
  );
};

export default NewAnimal;
