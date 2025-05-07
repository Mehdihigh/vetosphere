import { useState } from "react";
import {
    deleteWorkerSectionById,
    getWorkerSectionByVeterinarian, patchWorkerSectionById,
    postWorkerSectionByVeterinarian
} from "../../services/api/event/workerSectionApi.ts";

export const useFetchWorkerSectionByVeterinarian = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingAdd, setIsLoadingAdd] = useState<boolean>(false);

    const [workerSections, setWorkerSections] = useState<any[]>([]);

    const fetchWorkerSectionByVeterinarian = async () => {
        setIsLoading(true);
        try {
            const response = await getWorkerSectionByVeterinarian();
            setWorkerSections(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des Worker Sections:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const addWorkerSection = async (data: {}) => {
        setIsLoadingAdd(true);
        try {
            const response = await postWorkerSectionByVeterinarian(data);
            if(response.status === 201) {

                setWorkerSections(prevSections => [...prevSections, response.data]);
                fetchWorkerSectionByVeterinarian()
            }

        } catch (error) {
            console.error("Erreur lors de la création du Worker Section:", error);
        } finally {
            setIsLoadingAdd(false);
        }
    };

    const destroyWorkerSectionById = async (id: string) => {
        try {
            const response = await deleteWorkerSectionById(id);
            console.log(response);
            if (response.status === 200) {
                setWorkerSections(prevSections => prevSections.filter(section => section.id !== id));
            }
        }catch (error) {
            console.error(error);
        }
    }

    const updateWorkerSectionById = async (id: string, data: { working_day: string; start_h: string; end_h: string }) => {
        try {
            const response = await patchWorkerSectionById(id, data);

            if (response.status === 200) {
                setWorkerSections(prevSections =>
                    prevSections.map(section =>
                        section.id === id ? { ...section, ...data } : section
                    )
                );
                console.log(`Worker Section avec ID ${id} mise à jour avec succès.`);
            }

        } catch (error) {
            console.error("Erreur lors de la mise à jour de la Worker Section:", error);
        }
    };


    return { isLoading, workerSections, fetchWorkerSectionByVeterinarian, isLoadingAdd, addWorkerSection, destroyWorkerSectionById, updateWorkerSectionById};
};


