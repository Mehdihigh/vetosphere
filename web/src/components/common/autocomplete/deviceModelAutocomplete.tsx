import React, { useState, useEffect, useRef } from 'react';
import Autosuggest from 'react-autosuggest';
import '../../../assets/styles/component/autocomplete.css';
import {GetAutocomplete, GetAutocompleteByManufacturer} from "../../../api/deviceModel/get";

const DeviceModelAutocomplete = ({ className, onSuggestionSelected, id_device_manufacturer }) => {
    const [value, setValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef(null);

    const onSuggestionsFetchRequested = async ({ value }) => {
        if (value.length >= 2) {
            try {
                let fetchedSuggestions;
                if (id_device_manufacturer){
                    fetchedSuggestions = await GetAutocompleteByManufacturer(value, id_device_manufacturer);
                }else{
                    fetchedSuggestions = await GetAutocomplete(value);
                }

                setSuggestions(fetchedSuggestions.data);
                setIsOpen(true);
            } catch (error) {
                console.error('Erreur lors de la récupération des suggestions :', error);
            }
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
        onSuggestionSelected(event, { suggestion });
        setValue(suggestion.label);
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
                placeholder: 'Modele',
                value: value || '',
                onChange: (_, { newValue }) => setValue(newValue),
                onFocus: () => setIsOpen(true),
                onBlur: handleBlur,
                ref: inputRef
            }}
            onSuggestionSelected={handleSuggestionSelected}
            highlightFirstSuggestion
            theme={{
                container: 'relative bg-transparent border-none lg:h-7/10 w-1/8 lg:w-full rounded-full text-lg',
                suggestionsContainerOpen: 'absolute bg-white p-2 z-30 shadow-lg rounded-lg w-full max-w-full text-main-color overflow-x-auto text-md min-h-64 max-h-64',
                suggestion: 'cursor-pointer p-1 rounded-md hover:bg-second-color text-base',
                input: 'w-full h-11 px-3 block border border-gray-300 rounded-lg text-sm',
            }}
        />
    );
};

export default DeviceModelAutocomplete;
//container: 'relative bg-transparent border-none lg:h-7/10 w-1/8 lg:w-full rounded-full text-white text-lg',
//                 suggestionsContainerOpen: 'absolute bg-white p-2 z-30 shadow-lg rounded-lg w-full max-w-full text-main-color overflow-x-auto text-md',
//                 suggestion: 'cursor-pointer p-1 rounded-md hover:bg-second-color text-base',
//                 input: 'w-full bg-transparent focus:outline-none placeholder:text-white',