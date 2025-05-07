import React, { useState, useRef } from 'react';
import Autosuggest from 'react-autosuggest';
import '../../../assets/styles/component/autocomplete.css';
import { useNavigate } from 'react-router-dom';
import {AutocompleteDevice, AutocompleteDeviceByAudioCenterState} from "../../../api/device/get";
import {Get} from "../../../api/baseUrl";
import {fetchData} from "../../../api/apiMethod/get";

const DeviceAutocomplete = ({ className, onSuggestionSelected, type , setNewDeliveryNotePopup, allDevice, newDeliveryNote,setPopups}) => {
    const [value, setValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const inputRef = useRef(null);

    const defaultSuggestion = { label: 'Ajouter un appareil ?', value: 'newDevice' };

    const onSuggestionsFetchRequested = async ({ value }) => {
        if (typeof value !== "string" || value.length < 2) {
            setSuggestions([]);
            return;
        }

        try {
            const id_audio_center = localStorage.getItem("selectedAudioCenter");

            const fetchedSuggestions = await fetchData({
                endpoint: `/device/autocomplete/${encodeURIComponent(value)}/${id_audio_center}/${type}`,
                errorMessage: "Erreur lors de la récupération des suggestions",
                setPopups,
            });

            const validSuggestions = Array.isArray(fetchedSuggestions) ? fetchedSuggestions : [];

            const updatedSuggestions = newDeliveryNote
                ? [...validSuggestions, defaultSuggestion]
                : validSuggestions;

            setSuggestions(updatedSuggestions);
            setIsOpen(true);

        } catch (error) {
            console.error("Erreur lors de la récupération des suggestions:", error);
            setSuggestions([]);
        }
    };


    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
        setIsOpen(false);
    };

    const renderSuggestion = (suggestion) => (
        <div>
            {suggestion.label}
        </div>
    );

    const handleSuggestionSelected = (event, { suggestion }) => {

        if (suggestion.value === 'newDevice') {
            setNewDeliveryNotePopup(true);
        } else {
            onSuggestionSelected(event, { suggestion });
        }

        setSuggestions([]);
        setIsOpen(false);

        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.blur();
            }
        }, 0);
    };

    const handleBlur = () => {
        setTimeout(() => {
            setIsOpen(false);
        }, 200);
    };

    return (
        <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={(suggestion) => suggestion.label}
            renderSuggestion={renderSuggestion}
            inputProps={{
                placeholder: 'Rechercher...',
                value: value,
                onChange: (_, { newValue }) => setValue(newValue),
                onFocus: () => setIsOpen(true),
                onBlur: handleBlur,
                ref: inputRef
            }}
            onSuggestionSelected={handleSuggestionSelected}
            highlightFirstSuggestion
            theme={{
                container: 'relative bg-transparent border-none lg:h-7/10 w-1/8 lg:w-full rounded-full text-lg',
                suggestionsContainerOpen: 'absolute bg-white p-2 z-30 shadow-lg rounded-lg w-full max-w-auto text-main-color overflow-x-auto text-md',
                suggestion: 'cursor-pointer p-1 rounded-md hover:bg-second-color text-base',
                input: 'w-full h-11 px-3 block border border-gray-300 rounded-lg text-sm',
            }}
        />
    );
};

export default DeviceAutocomplete;
