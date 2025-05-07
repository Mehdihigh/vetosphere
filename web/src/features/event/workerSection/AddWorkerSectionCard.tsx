import React, { useState } from "react";
import {daysOfWeek, hours} from "../../../utils/constant.ts";

interface AddWorkerSectionProps {
    onAdd: (workerSection: { working_day: string; start_h: string; end_h: string }) => void;
}

const AddWorkerSectionCard: React.FC<AddWorkerSectionProps> = ({ onAdd }) => {
    const [workingDay, setWorkingDay] = useState<string>("");
    const [startTime, setStartTime] = useState<string>("");
    const [endTime, setEndTime] = useState<string>("");


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!workingDay || !startTime || !endTime) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        if (parseInt(startTime) >= parseInt(endTime)) {
            alert("L'heure de fin doit être après l'heure de début.");
            return;
        }

        onAdd({ working_day: workingDay, start_h: startTime, end_h: endTime });

        setWorkingDay("");
        setStartTime("");
        setEndTime("");
    };

    return (
        <div className="max-w-xs w-full h-40 p-4 bg-white border border-[#DAB6FF] rounded-md shadow-md text-center">
            <form onSubmit={handleSubmit} className="space-y-2 text-sm h-full flex flex-col justify-between">
                <select
                    value={workingDay}
                    onChange={(e) => setWorkingDay(e.target.value)}
                    className="w-full border border-[#DAB6FF] px-2 py-1 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5B359B]"
                    required
                >
                    <option value="">Sélectionnez un jour</option>
                    {daysOfWeek.map((day) => (
                        <option key={day.value} value={day.value}>{day.label}</option>
                    ))}
                </select>

                <div className="flex space-x-2">
                    <select
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-1/2 border border-[#DAB6FF] px-2 py-1 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5B359B]"
                        required
                    >
                        <option value="">Début</option>
                        {hours.map((hour) => (
                            <option key={hour.value} value={String(hour.value)}>
                                {hour.label}
                            </option>
                        ))}
                    </select>

                    <select
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-1/2 border border-[#DAB6FF] px-2 py-1 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5B359B]"
                        required
                    >
                        <option value="">Fin</option>
                        {hours.map((hour) => (
                            <option key={hour.value} value={String(hour.value)}>
                                {hour.label}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full bg-[#5B359B] text-white px-3 py-1 rounded-md hover:bg-[#FF3769] transition text-sm"
                >
                    Ajouter
                </button>
            </form>
        </div>
    );
};

export default AddWorkerSectionCard;
