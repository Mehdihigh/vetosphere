import React, { useState, useRef } from 'react';
import Autosuggest from 'react-autosuggest';
import '../../../assets/styles/component/autocomplete.css';
import { useNavigate } from 'react-router-dom';
import { GetSearchQuote } from '../../../api/document/get';
import {AutocompleteDoctor} from "../../../api/doctor/post";
import {defaultSuggestionsDoctorAlways} from "../../../utils/variable";

const DoctorAutocomplete = ({ className, onSuggestionSelected, type, setActiveStep }) => {
    const [value, setValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const inputRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    const onSuggestionsFetchRequested = async ({ value }) => {
        if (value.length >= 2) {
            try {
                const response = await AutocompleteDoctor(value, type);
                console.log(response)
                if (response && Array.isArray(response.data)) {
                    const fetchedSuggestions = response.data;

                    const updatedSuggestions = [
                        ...fetchedSuggestions,
                        ...defaultSuggestionsDoctorAlways,
                    ];
                    setSuggestions(updatedSuggestions);
                    setIsOpen(true);
                } else {
                    console.error("Invalid API response:", response);
                    setSuggestions(defaultSuggestionsDoctorAlways);
                }
            } catch (error) {
                console.error("Error fetching suggestions:", error);
                setSuggestions([]);
            }
        } else {
            setSuggestions([]);
        }
    };

    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    const renderSuggestion = (suggestion) => (
        <div className="suggestion-item">
            {suggestion.label}
        </div>
    );

    const handleSuggestionSelected = (event, { suggestion }) => {
        switch (suggestion.value){
            case "newDoctor":
                setActiveStep("doctor");
                break;
            default :
                onSuggestionSelected(event, { suggestion });
                break
        }

        setValue(suggestion.label);
        setSuggestions([]);
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.blur();
            }
        }, 0);
    };

    const handleBlur = () => {
        setTimeout(() => {
            setSuggestions([]);
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
                placeholder: 'Rechercher un docteur...',
                value: value,
                onChange: (_, { newValue }) => setValue(newValue),
                onFocus: () => setSuggestions(suggestions),
                onBlur: handleBlur,
                ref: inputRef,
                className: "defaultInput"
            }}

            onSuggestionSelected={handleSuggestionSelected}
            highlightFirstSuggestion
            theme={{
                container: 'relative bg-transparent border-none lg:h-7/10 w-1/8 lg:w-full rounded-full text-lg',
                suggestionsContainerOpen: 'absolute bg-white p-2 z-30 shadow-lg rounded-lg w-full max-w-full text-main-color overflow-x-auto text-md min-h-64 max-h-64',
                suggestion: 'cursor-pointer p-1 rounded-md hover:bg-second-color text-base',
            }}
        />
    );
};

export default DoctorAutocomplete;
