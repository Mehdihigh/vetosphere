import axios from "axios";
import {CONFIG} from "../../config/config.ts";


const apiClient = axios.create({
    baseURL: CONFIG.API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export default apiClient;
