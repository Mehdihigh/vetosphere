import { useState } from "react";
import { getAnimalById, getAnimalByIdClient } from "../../services/api/animal/animalApi.ts";

export const useAnimal = () => {
    const [animalList, setAnimalList] = useState([]); // Stocke plusieurs animaux
    const [animal, setAnimal] = useState(null); // Stocke un seul animal

    // Récupérer tous les animaux d'un client
    const fetchAnimalByIdClient = async (id_client: string) => {
        try {
            const response = await getAnimalByIdClient(id_client);
            setAnimalList(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des animaux:", error);
        }
    };

    // ✅ Récupérer UN animal par son ID
    const fetchAnimalById = async (id_animal: string) => {
        try {
            const response = await getAnimalById(id_animal);
            setAnimal(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération de l'animal:", error);
        }
    };

    return { animalList, fetchAnimalByIdClient, animal, fetchAnimalById };
};
