import axios from 'axios';
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { differenceInYears, format, isAfter, isBefore } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useParams } from 'react-router-dom';
import PopupContainer from '../../src/components/popup/PopupDisplay'; // Assurez-vous du bon chemin
import { CONFIG } from '../config/config';
import { useAnimal } from '../hooks/animal/useAnimal';
import { useEvent } from '../hooks/event/useEvent';
import { removeBlackBackground } from '../utils/blackBakground';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: fr });
  } catch {
    return 'Invalid Date';
  }
};

const calculateAge = (birthDate) => {
  if (!birthDate) return 'N/A';
  try {
    const age = differenceInYears(new Date(), new Date(birthDate));
    return age > 0 ? `${age} an${age > 1 ? 's' : ''}` : '< 1 an';
  } catch {
    return 'N/A';
  }
};

const Animal = () => {
  const { id } = useParams();
  const [animalData, setAnimalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [futureAppointments, setFutureAppointments] = useState([]);
  const [imageUrl, setImageUrl] = useState('https://via.placeholder.com/150');
  const { animal, fetchAnimalById } = useAnimal();
  const { eventList, fetchEventByVeterinarian } = useEvent();
  const [weightData, setWeightData] = useState([]);
  const [pastVaccines, setPastVaccines] = useState([]);
  const [futureVaccines, setFutureVaccines] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [newDate, setNewDate] = useState('');

  const [showVaccinePopup, setShowVaccinePopup] = useState(false);
  const [selectedVaccineId, setSelectedVaccineId] = useState('');
  const [selectedVaccineDate, setSelectedVaccineDate] = useState('');

  const [isEditingAnimal, setIsEditingAnimal] = useState(false);
  const [editedAnimal, setEditedAnimal] = useState({});

  const handleAddWeight = async () => {
    if (newWeight && newDate && animalData?.id) {
      const newEntry = {
        date: newDate,
        value: parseFloat(newWeight),
      };

      try {
        // Envoi du nouveau poids à l'API
        await axios.post(
          `${CONFIG.API_BASE_URL}/animal-history`,
          {
            weight: newEntry.value,
            creation_date: newEntry.date,
            id_animal: animalData.id,
          },
          { withCredentials: true },
        );

        // Ajout local pour affichage immédiat
        setWeightData((prevData) => [...prevData, newEntry]);

        // Reset et fermeture
        setNewWeight('');
        setNewDate('');
        removeBlackBackground();
        setShowPopup(false);
      } catch (error) {
        console.error("Erreur lors de l'ajout du poids :", error);
      }
    }
  };

  const handleAddVaccine = async () => {
    if (selectedVaccineId && selectedVaccineDate && animalData?.id) {
      try {
        await axios.post(
          `${CONFIG.API_BASE_URL}/vaccination`,
          {
            rappel_date: selectedVaccineDate,
            id_vaccine: Number(selectedVaccineId),
            id_animal: animalData.id,
            id_veterinarian: 1,
          },
          {
            withCredentials: true,
          },
        );
        const today = new Date();
        const rappelDate = new Date(selectedVaccineDate);

        const newVaccine = {
          vaccine: availableVaccines.find((v) => v.id === Number(selectedVaccineId)),
          rappel_date: selectedVaccineDate,
        };

        if (rappelDate >= today) {
          setFutureVaccines((prev) => [...prev, newVaccine]);
        } else {
          setPastVaccines((prev) => [...prev, newVaccine]);
        }
        setSelectedVaccineId('');
        setSelectedVaccineDate('');
        removeBlackBackground();
        setShowVaccinePopup(false);
      } catch (error) {
        console.error("Erreur lors de l'ajout du vaccin :", error);
      }
    }
  };
  const fetchVaccinesBySpecie = async (id_specie) => {
    try {
      const response = await axios.get(`${CONFIG.API_BASE_URL}/vaccine/by-specie/${id_specie}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des vaccins :', error);
      throw error;
    }
  };

  const [availableVaccines, setAvailableVaccines] = useState([]);

  useEffect(() => {
    if (animalData?.race?.id_specie) {
      fetchVaccinesBySpecie(animalData.race?.id_specie)
        .then(setAvailableVaccines)
        .catch(() => setAvailableVaccines([]));
    }
  }, [animalData]);

  useEffect(() => {
    if (id) {
      fetchAnimalById(id);
    }
  }, [id]);

  useEffect(() => {
    if (animal) {
      setAnimalData(animal);

      // Process weights for the chart
      const weights = animal.weight.map((entry) => ({
        date: entry.creation_date,
        value: parseFloat(entry.weight),
      }));
      setWeightData(weights);

      // Process vaccinations (limit to 3 past and 3 future)
      setPastVaccines(animal.vaccination?.past_vaccin.slice(0, 3) || []);
      setFutureVaccines(animal.vaccination?.futur_vaccin.slice(0, 3) || []);

      // Process events
      const today = new Date();
      const past = animal.events
        .filter((event) => isBefore(new Date(event.start_date), today))
        .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
        .slice(0, 5);

      const future = animal.events
        .filter((event) => isAfter(new Date(event.start_date), today))
        .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
        .slice(0, 5);

      setPastAppointments(past);
      setFutureAppointments(future);
    }
  }, [animal]);

  useEffect(() => {
    if (animalData) {
      fetchEventByVeterinarian();
    }
  }, [animalData]);

  useEffect(() => {
    if (eventList.length > 0 && animalData) {
      const relatedAppointments = eventList.filter((event) => event.animal?.id === animalData.id);

      const today = new Date();
      const past = relatedAppointments
        .filter((appointment) => isBefore(new Date(appointment.start_date), today))
        .sort((a, b) => new Date(b.start_date) - new Date(a.start_date)) // Sort descending
        .slice(0, 5); // Limit to 5 most recent past appointments

      const future = relatedAppointments
        .filter((appointment) => isAfter(new Date(appointment.start_date), today))
        .sort((a, b) => new Date(a.start_date) - new Date(b.start_date)) // Sort ascending
        .slice(0, 5); // Limit to 5 upcoming future appointments

      setPastAppointments(past || []);
      setFutureAppointments(future || []);
      setLoading(false);
    }
  }, [eventList, animalData]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  const weightChartData = {
    labels: weightData?.map((entry) => formatDate(entry.date)) || [],
    datasets: [
      {
        label: 'Poids (kg)',
        data: weightData?.map((entry) => entry.value) || [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const weightOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Courbe de Poids',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: Math.max(...(weightData?.map((entry) => entry.value) || [0])) + 5, // Add padding above max weight
      },
    },
  };
  const safeFormatDate = (rawDate) => {
    if (!rawDate) return 'Date invalide';
    try {
      const date = new Date(rawDate);
      if (isNaN(date)) return 'Date invalide';
      return format(date, 'dd/MM/yyyy', { locale: fr });
    } catch {
      return 'Date invalide';
    }
  };

  const handleUpdateAnimal = async () => {
    try {
      await axios.patch(`${CONFIG.API_BASE_URL}/animal/${animalData.id}`, editedAnimal, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setIsEditingAnimal(false);
      fetchAnimalById(animalData.id); // Refresh after save
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'animal :", err);
    }
  };

  return (
    <div className="animal-page bg-gray-50 h-full p-4">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-4 h-full">
        {/* Left Column: Animal Info */}
        <div className="col-span-3 bg-white p-6 rounded-lg shadow-lg flex flex-col justify-between">
          <img
            src={imageUrl}
            alt={animalData?.name || 'Animal'}
            className="rounded-full w-28 h-28 mx-auto border-4 border-purple-500 object-cover"
            onError={(e) => {
              e.target.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfk3ikc0a2HavZq5y7SGOgSNNHDKM_W_OJ5g&s';
            }}
          />

          {isEditingAnimal ? (
            <div className="mt-4 space-y-2 text-sm text-gray-700">
              <input
                type="text"
                defaultValue={animalData.name}
                onChange={(e) => setEditedAnimal((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full p-2 border rounded"
                placeholder="Nom"
              />
              <input
                type="date"
                defaultValue={animalData.birth_date?.slice(0, 10)}
                onChange={(e) => setEditedAnimal((prev) => ({ ...prev, birth_date: e.target.value }))}
                className="w-full p-2 border rounded"
              />
              <select
                value={editedAnimal.gender || ''}
                onChange={(e) => setEditedAnimal((prev) => ({ ...prev, gender: e.target.value }))}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Sélectionner le genre</option>
                <option value="mâle">Mâle</option>
                <option value="femelle">Femelle</option>
              </select>
              <input
                type="text"
                defaultValue={animalData.num_chip}
                onChange={(e) => setEditedAnimal((prev) => ({ ...prev, num_chip: e.target.value }))}
                className="w-full p-2 border rounded"
                placeholder="Puce"
              />
              <input
                type="text"
                defaultValue={animalData.tattoo}
                onChange={(e) => setEditedAnimal((prev) => ({ ...prev, tattoo: e.target.value }))}
                className="w-full p-2 border rounded"
                placeholder="Tatouage"
              />

              <div className="flex justify-between pt-2">
                <button onClick={() => setIsEditingAnimal(false)} className="text-sm text-gray-500 hover:underline">
                  Annuler
                </button>
                <button onClick={handleUpdateAnimal} className="text-sm text-purple-600 font-semibold hover:underline">
                  Enregistrer
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-center text-xl font-bold mt-4 text-gray-800">{animalData?.name || 'Nom non disponible'}</h2>
              <ul className="mt-4 text-sm text-gray-600 space-y-2">
                <li>
                  <span className="font-semibold">Date de naissance:</span> {formatDate(animalData?.birth_date)}
                </li>
                <li>
                  <span className="font-semibold">Âge:</span> {calculateAge(animalData?.birth_date)}
                </li>
                <li>
                  <span className="font-semibold">Genre:</span> {animalData?.gender || 'N/A'}
                </li>
                <li>
                  <span className="font-semibold">Numéro de puce:</span> {animalData?.num_chip || 'N/A'}
                </li>
                <li>
                  <span className="font-semibold">Tatouage:</span> {animalData?.tattoo || 'N/A'}
                </li>
                <li>
                  <span className="font-semibold">Race:</span> {animalData?.race?.name || 'N/A'}
                </li>
                <li>
                  <span className="font-semibold">Espèce:</span> {animalData?.race?.specie?.name || 'N/A'}
                </li>
              </ul>
              <button onClick={() => setIsEditingAnimal(true)} className="mt-4 text-sm text-purple-600 font-medium hover:underline self-center">
                ✏️ Modifier
              </button>
            </>
          )}
        </div>

        {/* Middle Column: Weight Chart */}
        <div className="col-span-6 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Courbe de Poids</h3>
          <div className="h-56">
            <Line data={weightChartData} options={weightOptions} />
          </div>
          <button className="mt-4 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600" onClick={() => setShowPopup(true)}>
            Ajouter un poids
          </button>
        </div>

        {/* Right Column: RDV Sections */}
        <div className="col-span-3 h-full space-y-4 flex flex-col justify-between">
          {/* Past Appointments */}
          <div className="bg-white p-4 rounded-lg shadow-lg h-2/4 pb-2">
            <h3 className="text-lg font-bold text-gray-800"> Derniers RDV </h3>
            <ul className="mt-4 space-y-2">
              {pastAppointments.length > 0 ? (
                pastAppointments.map((appointment, index) => (
                  <li
                    key={index}
                    className="bg-purple-100 p-2 rounded-lg text-gray-700 overflow-hidden text-ellipsis whitespace-nowrap"
                    title={appointment.description || `RDV ${index + 1}`}
                  >
                    {appointment.description || `RDV ${index + 1}`} - {formatDate(appointment.start_date)}
                  </li>
                ))
              ) : (
                <p className="text-gray-500">Aucun RDV passé</p>
              )}
            </ul>
          </div>

          {/* Future Appointments */}
          <div className="bg-white p-4 rounded-lg shadow-lg h-2/4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-gray-800">Prochains RDV</h3>
              <a href="/agenda" className="text-sm bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600">
                Prendre un RDV
              </a>
            </div>
            <ul className="mt-4 space-y-2">
              {futureAppointments.length > 0 ? (
                futureAppointments.map((appointment, index) => (
                  <li
                    key={index}
                    className="bg-purple-500 text-white p-2 rounded-lg overflow-hidden text-ellipsis whitespace-nowrap"
                    title={appointment.description || `RDV ${index + 1}`}
                  >
                    {appointment.description || `RDV ${index + 1}`} - {formatDate(appointment.start_date)}
                  </li>
                ))
              ) : (
                <p className="text-gray-500">Aucun RDV futur</p>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Row: Client Info, Documents, and Vaccines */}
        <div className="col-span-4 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold text-gray-800">Informations du Client</h3>
          <ul className="mt-4 text-sm text-gray-600 space-y-2">
            <li>
              <span className="font-semibold">Email:</span> {animalData?.client?.email || 'N/A'}
            </li>
            <li>
              <span className="font-semibold">Téléphone:</span> {animalData?.client?.phone || 'N/A'}
            </li>
            <li>
              <span className="font-semibold">Nom:</span> {animalData?.client?.last_name || 'N/A'}
            </li>
            <li>
              <span className="font-semibold">Prénom:</span> {animalData?.client?.first_name || 'N/A'}
            </li>
          </ul>
        </div>

        <div className="col-span-4 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold text-gray-800">Documents</h3>
          <div className="mt-4 space-y-2">
            {animalData?.documents?.length > 0 ? (
              animalData.documents.map((document, index) => (
                <button
                  key={index}
                  className="w-full bg-purple-100 p-2 rounded-lg text-gray-700 hover:bg-purple-200"
                  onClick={() => window.open(document.url, '_blank')}
                >
                  {document.name || `Document ${index + 1}`}
                </button>
              ))
            ) : (
              <p className="text-gray-500">Aucun document disponible</p>
            )}
          </div>
        </div>

        <div className="col-span-4 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 flex justify-between">
            Vaccins{' '}
            <button onClick={() => setShowVaccinePopup(true)} className="text-sm bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600">
              Ajouter un vaccin
            </button>
          </h3>

          <div className="grid grid-cols-2 gap-4 mt-4">
            {/* Past Vaccines */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Passés:</h4>
              {pastVaccines.length > 0 ? (
                pastVaccines.map((vaccine, index) => (
                  <div key={index} className="bg-green-100 p-2 rounded-lg text-gray-700">
                    {vaccine.vaccine.name} - {vaccine.rappel_date}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Aucun vaccin passé</p>
              )}
            </div>

            {/* Future Vaccines */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Futurs:</h4>
              {futureVaccines.length > 0 ? (
                futureVaccines.map((vaccine, index) => (
                  <div key={index} className="bg-yellow-100 p-2 rounded-lg text-gray-700">
                    {vaccine.vaccine.name} - {vaccine.rappel_date}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Aucun vaccin futur</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showPopup && (
        <PopupContainer
          onClose={() => {
            removeBlackBackground();
            setShowPopup(false);
          }}
          size="w-96"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">Ajouter un poids</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddWeight();
            }}
          >
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Poids (kg)</label>
              <input
                type="number"
                step="1" // Avance par incréments de 1
                min="0" // Empêche les valeurs négatives
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Date de mesure</label>
              <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="w-full p-2 border rounded-lg" required />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                onClick={() => {
                  setShowPopup(false);
                  removeBlackBackground();
                }}
              >
                Annuler
              </button>
              <button type="submit" className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
                Ajouter
              </button>
            </div>
          </form>
        </PopupContainer>
      )}

      {showVaccinePopup && (
        <PopupContainer
          onClose={() => {
            removeBlackBackground();
            setShowVaccinePopup(false);
          }}
          size="w-96"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">Ajouter un vaccin</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddVaccine();
            }}
          >
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Vaccin</label>
              {/* Tu gères le select ici */}
              <select value={selectedVaccineId} onChange={(e) => setSelectedVaccineId(e.target.value)} className="w-full p-2 border rounded" required>
                <option value="">Sélectionner un vaccin</option>
                {availableVaccines.map((vaccine) => (
                  <option key={vaccine.id} value={vaccine.id}>
                    {vaccine.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Date de rappel</label>
              <input
                type="date"
                value={selectedVaccineDate}
                onChange={(e) => setSelectedVaccineDate(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => {
                  setShowVaccinePopup(false);
                  removeBlackBackground();
                }}
              >
                Annuler
              </button>
              <button type="submit" className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
                Ajouter
              </button>
            </div>
          </form>
        </PopupContainer>
      )}
    </div>
  );
};

export default Animal;
