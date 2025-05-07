import axios from "axios";
import {CONFIG} from "../../../config/config.ts";

export const getWorkerSectionByVeterinarian = async () => {
    try {
        return await axios.get(`${CONFIG.API_BASE_URL}/working-section/by-veterinarian-in-jwt`, {
            withCredentials: true,
        });
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Erreur lors de la récupération des worker sections: ${error.message}`);
        }
        throw new Error("Erreur inconnue lors de la récupération des worker sections");
    }
};
export const postWorkerSectionByVeterinarian = async (data: {}) => {
    try {
        return await axios.post(`${CONFIG.API_BASE_URL}/working-section`, data,{
            withCredentials: true,
        });
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Erreur lors de la récupération des worker sections: ${error.message}`);
        }
        throw new Error("Erreur inconnue lors de la récupération des worker sections");
    }
};

export const deleteWorkerSectionById = async (id: string) => {
    try {

        return await axios.delete(`${CONFIG.API_BASE_URL}/working-section/${id}`,{
            withCredentials: true,
        });
    }catch(error) {
        if (error instanceof Error) {
            throw new Error(`Erreur lors de la récupération des worker sections: ${error.message}`);
        }
        throw new Error("Erreur inconnue lors de la récupération des worker sections");
    }
}

export const patchWorkerSectionById = async (id: string, data:{}) => {
    try {

        return await axios.patch(`${CONFIG.API_BASE_URL}/working-section/${id}`, data,{
            withCredentials: true,
        });
    }catch(error) {
        if (error instanceof Error) {
            throw new Error(`Erreur lors de la mise a jour du worker sections: ${error.message}`);
        }
        throw new Error("Erreur inconnue lors de la mise a jour du  worker sections");
    }
}