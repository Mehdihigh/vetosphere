import axios from 'axios';
import { CONFIG } from '../../config/config.ts';
import apiClient from './axios.ts';

export const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post(
      '/auth/login',
      { email, password },
      { withCredentials: true }, // 👈 OBLIGATOIRE pour que le cookie arrive
    );
    console.log(response);
    if (response.status === 200) {
      console.log('Utilisateur connecté avec succès !');
      window.location.href = "/agenda";
      return true;
    }

    return false;
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    return false;
  }
};
export const register = async (formData: FormData) => {
  try {
    const response = await axios.post(`${CONFIG.API_BASE_URL}/auth/register-veterinarian`, formData);
    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erreur lors de l'enregistrement de l'utilisateur: ${error.message}`);
    }
    throw new Error("Erreur inconnue lors de l'enregistrement de l'utilisateur");
  }
};

export const sendEmailCode = async (email: string) => {
  try {
    return await axios.post(`${CONFIG.API_BASE_URL}/auth/creat-send-code-password`, { email });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erreur lors de l'envoi du code par email: ${error.message}`);
    }
    throw new Error("Erreur inconnue lors de l'envoi du code par email");
  }
};

export const checkCode = async (email: string, code: string) => {
  try {
    return await axios.get(`${CONFIG.API_BASE_URL}/auth/confirm-code/${email}/${code}`);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erreur lors de la vérification du code: ${error.message}`);
    }
    throw new Error('Erreur inconnue lors de la vérification du code');
  }
};

export const newPassword = async (email: string, password: string) => {
  try {
    return await axios.post(`${CONFIG.API_BASE_URL}/auth/new-password`, { email, password });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erreur lors du changement de mot de passe: ${error.message}`);
    }
    throw new Error('Erreur inconnue lors du changement de mot de passe');
  }
};
