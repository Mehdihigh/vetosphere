import React, { useEffect, useState } from "react";
import PopupDisplay from "../../../components/popup/PopupDisplay.tsx";
import AddWorkerSectionCard from "./AddWorkerSectionCard.tsx";
import WorkerSectionCard from "./WorkerSectionCard.tsx";

interface DisplayWorkerSectionPopupProps {
    onClose: () => void;
    workerSections: any[];
    fetchWorkerSectionByVeterinarian: () => void;
    addWorkerSection: (data: { working_day: string; start_h: string; end_h: string }) => void;
    updateWorkerSectionById: (id: string, updatedData: any) => void;
    destroyWorkerSectionById: (id: string) => void;
}

const DisplayWorkerSectionPopup: React.FC<DisplayWorkerSectionPopupProps> = ({
                                                                                 onClose,
                                                                                 workerSections,
                                                                                 fetchWorkerSectionByVeterinarian,
                                                                                 addWorkerSection,
                                                                                 updateWorkerSectionById,
                                                                                 destroyWorkerSectionById
                                                                             }) => {
    const [filteredSections, setFilteredSections] = useState([]);

    useEffect(() => {
        fetchWorkerSectionByVeterinarian();
    }, []);

    useEffect(() => {
        const uniqueSections = workerSections.reduce((acc, section) => {
            const exists = acc.find(
                (s: { working_day: any; start_h: any; end_h: any; }) => s.working_day === section.working_day &&
                    s.start_h === section.start_h &&
                    s.end_h === section.end_h
            );
            if (!exists) acc.push(section);
            return acc;
        }, []);

        setFilteredSections(uniqueSections);
    }, [workerSections]);

    return (
        <PopupDisplay onClose={onClose} size="w-2/3 h-2/3" flex={"flex flex-wrap justify-center "}>
            <div className="w-full">
                {filteredSections.length === 0 ? (
                    <AddWorkerSectionCard onAdd={addWorkerSection} />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 h-full">
                        {filteredSections.map((workerSection) => (
                            <WorkerSectionCard
                                working_day={workerSection.working_day}
                                start_h={workerSection.start_h}
                                end_h={workerSection.end_h}
                                onUpdate={(updatedData) => updateWorkerSectionById(workerSection.id, updatedData)}
                                onDelete={() => destroyWorkerSectionById(workerSection.id)}
                            />
                        ))}
                        <AddWorkerSectionCard onAdd={addWorkerSection} />

                    </div>
                )}

            </div>
        </PopupDisplay>
    );
};

export default DisplayWorkerSectionPopup;
