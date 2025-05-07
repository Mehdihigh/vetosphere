import {useState} from "react";
import {getEventByVeterinarian, postEvent} from "../../services/api/event/eventApi.ts";

export const useEvent = () => {
    const [eventList, setEventList] = useState<any[]>([]);

    const fetchEventByVeterinarian = async () => {
        try {
            const response = await getEventByVeterinarian();
            console.log(response.data)
            setEventList(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des events:", error);
        }
    }

    const addEvent = async (data: {}) => {
        try {
            const response = await postEvent(data);
            if (response.status === 201) {

                fetchEventByVeterinarian()
            }else{
                window.alert("Erreur lors de la création d'un rendez-vous")
            }
        }catch (error) {
            console.error("Erreur lors de la récupération des events:", error);
        }
    }

    return {eventList, fetchEventByVeterinarian, addEvent};
}