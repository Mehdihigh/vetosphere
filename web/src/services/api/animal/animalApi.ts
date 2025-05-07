import axios from "axios";
import { CONFIG } from "../../../config/config.ts";

const API_BASE_URL = `${CONFIG.API_BASE_URL}/animal`;

// Récupérer tous les animaux d'un client
export const getAnimalByIdClient = async (id_client: string) => {
    try {
        return await axios.get(`${CONFIG.API_BASE_URL}/animal/id-client/${id_client}`, {
            withCredentials: true,
        });
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Erreur lors de la récupération des animaux: ${error.message}`);
        }
        throw new Error("Erreur inconnue lors de la récupération des animaux");
    }
};

// ✅ Récupérer UN animal par son ID
export const getAnimalById = async (id_animal: string) => {
    try {
        return await axios.get(`${CONFIG.API_BASE_URL}/animal/${id_animal}`, {
            withCredentials: true,
        });
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Erreur lors de la récupération de l'animal: ${error.message}`);
        }
        throw new Error("Erreur inconnue lors de la récupération de l'animal");
    }
};

// Fetch all species with credentials
export function getAllSpecies() {
  return axios.get(`${CONFIG.API_BASE_URL}/species`, {
    withCredentials: true, // Include credentials (e.g., cookies)
  });
}

// Fetch all races with credentials
export function getAllRaces() {
  return axios.get(`${CONFIG.API_BASE_URL}/races`, {
    withCredentials: true, // Include credentials (e.g., cookies)
  });
}
