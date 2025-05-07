import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CONFIG } from '../config/config';

const ClientPage = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientRes, animalsRes] = await Promise.all([
          axios.get(`${CONFIG.API_BASE_URL}/client/${id}`, { withCredentials: true }),
          axios.get(`${CONFIG.API_BASE_URL}/animal/id-client/${id}`, { withCredentials: true }),
        ]);

        setClient(clientRes.data.userAccount);
        setAnimals(animalsRes.data);
      } catch (error) {
        console.error('Erreur lors du chargement des données client :', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (loading) return <div className="p-10 text-lg">Chargement...</div>;
  if (!client) return <div className="p-10 text-lg text-red-500">Client introuvable</div>;

  return (
    <div className="p-10 space-y-10">
      <div className="flex items-center space-x-6">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border">
          <img
            src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1zSUt4Q1qJW8_NoptikuujTxSlHqviolVBQ&s`}
            alt={client.first_name}
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">
            {client.civility} {client.first_name} {client.last_name}
          </h2>
          <p className="text-base text-gray-700">
            {client.email} • {client.phone}
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Animaux</h3>
        {animals.length === 0 ? (
          <p className="text-gray-500 text-base">Aucun animal associé à ce client.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {animals.map((animal) => (
              <div
                key={animal.id}
                className="p-6 space-y-4 rounded shadow-sm border cursor-pointer"
                style={{ backgroundColor: JSON.parse(animal.card_color)?.[0] || '#f0f0f0' }}
                onClick={() => navigate(`/info-animal/${animal.id}`)}
              >
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-white border">
                    <img
                      src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRr_28T0vcjNLgvzRYpQRXDU6jD8HOJzF8nDQ&s`}
                      alt={animal.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">{animal.name}</h4>
                    <p className="text-white/80">
                      {animal.gender} • {new Date(animal.birth_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-white/90 text-base">
                  <p>
                    <strong>Puce:</strong> {animal.num_chip}
                  </p>
                  <p>
                    <strong>Tatouage:</strong> {animal.tattoo}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientPage;
