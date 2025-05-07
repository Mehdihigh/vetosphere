import axios from 'axios';
import { CONFIG } from '../../../config/config.ts';

export const getEventByVeterinarian = async () => {
  try {
    console.log(document.cookie);
    return await axios.get(`${CONFIG.API_BASE_URL}/event/by-veterinarian/jwt`, {
      withCredentials: true,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erreur lors de la récupération des worker sections: ${error.message}`);
    }
    throw new Error('Erreur inconnue lors de la récupération des worker sections');
  }
};

export const postEvent = async (data: {}) => {
  try {
    return await axios.post(`${CONFIG.API_BASE_URL}/event`, data, {
      withCredentials: true,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erreur lors de la création d'un event: ${error.message}`);
    }
    throw new Error("Erreur inconnue lors de la création d'un event");
  }
};

export const deleteEventById = async (id: number | string) => {
  try {
    return await axios.delete(`${CONFIG.API_BASE_URL}/event/${id}`, {
      withCredentials: true,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erreur lors de la suppression de l'événement: ${error.message}`);
    }
    throw new Error("Erreur inconnue lors de la suppression de l'événement");
  }
};
