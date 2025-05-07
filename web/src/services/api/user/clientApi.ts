import axios from "axios";
import {CONFIG} from "../../../config/config.ts";

export const getSearch = async (data: { }) => {
    try {
        return await axios.post(`${CONFIG.API_BASE_URL}/client/search`, data,{
            withCredentials: true,
        });
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Erreur lors de la récupération client: ${error.message}`);
        }
        throw new Error("Erreur inconnue lors de la récupération des worker sections");
    }
};