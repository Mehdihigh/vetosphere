import { TrashIcon } from "lucide-react"; // Updated import
import React, { useState } from "react";
import { daysOfWeek, hours } from "../../../utils/constant.ts";

interface WorkerSectionProps {
    working_day: string;
    start_h: string;
    end_h: string;
    onUpdate: (updatedSection: { working_day: string; start_h: string; end_h: string }) => void;
    onDelete: () => void;
    layoutStyle?: string;
    trashIconStyle?: string;
    updateButtonStyle?: string;
}

const WorkerSectionCard: React.FC<WorkerSectionProps> = ({
    working_day,
    start_h,
    end_h,
    onUpdate,
    onDelete,
    layoutStyle = "flex items-center space-x-2",
    trashIconStyle = "w-1/4 flex justify-center items-center text-red-500 cursor-pointer",
    updateButtonStyle = "w-3/4 bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600"
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedDay, setEditedDay] = useState(working_day);
    const [editedStart, setEditedStart] = useState(start_h);
    const [editedEnd, setEditedEnd] = useState(end_h);

    const handleSave = () => {
        if (parseInt(editedStart) >= parseInt(editedEnd)) {
            alert("L'heure de fin doit être après l'heure de début.");
            return;
        }
        onUpdate({working_day: editedDay, start_h: editedStart, end_h: editedEnd});
        setIsEditing(false);
    };

    return (
        <div
            className="max-w-xs w-full h-40 p-4 bg-white border border-[#DAB6FF] rounded-md shadow-md text-center flex flex-col justify-between">
            <div className="text-gray-700 space-y-1 text-sm">
                {isEditing ? (
                    <>
                        <select
                            value={editedDay}
                            onChange={(e) => setEditedDay(e.target.value)}
                            className="w-full border border-[#DAB6FF] px-2 py-1 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5B359B]"
                        >
                            {daysOfWeek.map((day) => (
                                <option key={day.value} value={day.value}>{day.label}</option>
                            ))}
                        </select>
                        <div className="flex space-x-2">
                            <select
                                value={editedStart}
                                onChange={(e) => setEditedStart(e.target.value)}
                                className="w-1/2 border border-[#DAB6FF] px-2 py-1 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5B359B]"
                            >
                                {hours.map((hour) => (
                                    <option key={hour.value} value={String(hour.value)}>
                                        {hour.label}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={editedEnd}
                                onChange={(e) => setEditedEnd(e.target.value)}
                                className="w-1/2 border border-[#DAB6FF] px-2 py-1 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5B359B]"
                            >
                                {hours.map((hour) => (
                                    <option key={hour.value} value={String(hour.value)}>
                                        {hour.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </>
                ) : (
                    <>
                        <p><strong className="text-[#5B359B]">Jour :</strong> {working_day}</p>
                        <p><strong className="text-[#5B359B]">Début :</strong> {`${parseInt(start_h)}h00`}</p>
                        <p><strong className="text-[#5B359B]">Fin :</strong> {`${parseInt(end_h)}h00`}</p>
                    </>
                )}
            </div>

            <div className="flex justify-between mt-2">
                {isEditing ? (
                    <button
                        onClick={handleSave}
                        className="w-3/4 bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 transition text-sm"
                    >
                        Sauvegarder
                    </button>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="w-3/4 border border-[#DAB6FF] bg-[#F3E8FF] text-[#5B359B] font-bold px-2 py-1 rounded-md hover:bg-[#EADCFD] transition text-sm"
                    >
                        Modifier
                    </button>
                )}

                <div className="w-1/4 flex justify-center items-center text-red-500 cursor-pointer" onClick={onDelete}>
                    <TrashIcon size={20} />
                </div>
            </div>
        </div>
    );
};

export default WorkerSectionCard;
