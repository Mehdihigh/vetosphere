import React from 'react';
import { useAudioCenter } from "../../../context/AudioCenterContext";
import Select from "./Select.tsx";
import {SaveAudioCenterSelectId} from "../../../services/utils/audioCenter.ts";

const AudioCenterSelect = () => {
    const { audioCenterList, selectedAudioCenter, setSelectedAudioCenter } = useAudioCenter();

    const handleAudioCenterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = Number(e.target.value);
        SaveAudioCenterSelectId(selectedId);
        setSelectedAudioCenter(selectedId);
    };

    return (
        <div className="w-full h-full flex items-center justify-center">
            <Select
                listOptions={audioCenterList}
                onChange={handleAudioCenterChange}
                value={selectedAudioCenter}
                valueKey="id_audio_center"
                labelKey="name"
                className="w-3/4 lg:w-full py-3
                     bg-transparent border-2 border-main-color
                     rounded-2xl text-main-color"
            />
        </div>
    );
};

export default AudioCenterSelect;
