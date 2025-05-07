import { AxiosError } from "axios";
import { Camera } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { default as apiClient, default as baseURL } from "../services/api/axios";
import defaultUserPhoho from "../assets/images/5856.jpg";

interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  rpps: string;
  civility: string;
  photo: string;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const token = localStorage.getItem("token");

  // 🔹 Récupération des informations utilisateur
  useEffect(() => {
    apiClient
        .get("/user-account/my-info", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((response) => {
          console.log("Données utilisateur :", response.data);
          setUser(response.data);
          setLoading(false);
        })
        .catch((error: unknown) => {
          if (error instanceof AxiosError) {
            console.error("Erreur API :", error.response?.data || error.message);
            setError("Impossible de récupérer les informations.");
          } else {
            console.error("Erreur inconnue :", error);
            setError("Une erreur inattendue est survenue.");
          }
          setLoading(false);
        });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!user) return;
    const { name, value } = e.target;
    setUser((prevUser) => (prevUser ? { ...prevUser, [name]: value } : null));
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await baseURL.post(`${user.photo}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data", // ✅ Important pour l’upload
        },
      });

      console.log("Réponse de l'API :", response.data);

      // ✅ Mettre à jour l'utilisateur avec l'URL de l'image fournie par le backend
      setUser((prevUser) => ({
        ...prevUser!,
        photo: response.data.photoUrl, // ✅ Supposons que l’API renvoie `photoUrl`
      }));
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error("Erreur API :", error.response?.data || error.message);
        alert(`Erreur API : ${JSON.stringify(error.response?.data)}`);
      } else {
        console.error("Erreur inconnue :", error);
        alert("Une erreur inconnue est survenue.");
      }
    }
  };


  // 🔹 Envoi des modifications avec PATCH `/user-account/:id`
  const handleSave = () => {
    if (!user || !user.id) {
      alert("Erreur : ID utilisateur introuvable.");
      return;
    }

    apiClient
        .patch(`/user-account/${user.id}`, user, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          alert("Modifications enregistrées !");
          setIsEditing(false);
        })
        .catch((error) => {
          console.error("Erreur API :", error.response || error);
          alert("Erreur lors de l'enregistrement.");
        });
  };

  if (loading) return <p className="text-center text-gray-600">Chargement...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
      <div className="flex justify-center items-center bg-gray-100 pt-5 ">
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Mon Profil</h2>

          {/* Photo de profil */}
          <div className="flex flex-col items-center mb-6">
            <img
                src={defaultUserPhoho}
                alt="Profil"
                className="w-28 h-28 rounded-full border-4 border-gray-300 object-cover"
            />
            {/*
             {isEditing && (
                <label className="mt-2 flex flex-col items-center cursor-pointer">
                  <div className="bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition">
                    <Camera className="w-6 h-6 text-gray-600" />
                  </div>
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                </label>
            )}
             */}

          </div>

          {/* Formulaire utilisateur */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-gray-700 font-medium">Prénom</label>
                <input
                    type="text"
                    name="first_name"
                    value={user?.first_name}
                    onChange={handleChange}
                    className="w-full mt-1 p-3 border border-gray-300 rounded-lg"
                    disabled={!isEditing}
                />
              </div>
              <div className="w-1/2">
                <label className="block text-gray-700 font-medium">Nom</label>
                <input
                    type="text"
                    name="last_name"
                    value={user?.last_name}
                    onChange={handleChange}
                    className="w-full mt-1 p-3 border border-gray-300 rounded-lg"
                    disabled={!isEditing}
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                  type="email"
                  name="email"
                  value={user?.email}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg"
                  disabled={!isEditing}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Téléphone</label>
              <input
                  type="tel"
                  name="phone"
                  value={user?.phone}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg"
                  disabled={!isEditing}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Numéro RPPS</label>
              <input
                  type="text"
                  name="rpps"
                  value={user?.rpps}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg"
                  disabled={!isEditing}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Civilité</label>
              <select
                  name="civility"
                  value={user?.civility}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg"
                  disabled={!isEditing}
              >
                <option value="m.">M.</option>
                <option value="mme.">Mme</option>
                <option value="autre">Autre</option>
              </select>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex justify-center gap-4 mt-6">
            {isEditing ? (
                <>
                  <button onClick={handleSave} className="w-full bg-[#5B359B] text-white py-3 rounded-lg">
                    Enregistrer
                  </button>
                  <button onClick={() => setIsEditing(false)} className="w-full bg-gray-300 py-3 rounded-lg">
                    Annuler
                  </button>
                </>
            ) : (
                <button onClick={() => setIsEditing(true)} className="w-full bg-[#5B359B] text-white py-3 rounded-lg">
                  Modifier
                </button>
            )}
          </div>
        </div>
      </div>
  );
};

export default ProfilePage;