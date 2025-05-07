import Autosuggest from "react-autosuggest";
import React, { useRef, useState } from "react";

const Autocomplete = ({ onSuggestionSelected, request, placeholder, valueMinimum }) => {
    const [value, setValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const inputRef = useRef(null);

    const onSuggestionsFetchRequested = async ({ value }) => {
        if (typeof value === 'string' && value.length >= valueMinimum) {
            try {
                const fetchedSuggestions = await request(value || '');
                if (fetchedSuggestions && Array.isArray(fetchedSuggestions)) {
                    setSuggestions(fetchedSuggestions);
                } else {
                    setSuggestions([]);
                    console.error('Fetched suggestions data is not an array:', fetchedSuggestions);
                }
            } catch (error) {
                console.error('Error fetching suggestions:', error);
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

    // Quand une suggestion est selectionné
    const handleSuggestionSelected = (event, { suggestion }) => {
        if (suggestion && suggestion.label) {
            setValue(suggestion.label);
            setSuggestions([]);
            onSuggestionSelected(event, { suggestion });
        }
    };

    const handleBlur = () => {
        setTimeout(() => {
            setSuggestions([]);
        }, 200);
    };

    // Sur un click
    const handleFocus = async () => {
        await onSuggestionsFetchRequested({ value: '' });
    };

    return (
        <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={(suggestion) => suggestion.label}
            renderSuggestion={renderSuggestion}
            inputProps={{
                onFocus: handleFocus,
                placeholder: placeholder,
                value: value,
                onChange: (_, { newValue }) => setValue(newValue),
                onBlur: handleBlur,
                ref: inputRef,
                className: "w-full h-11 px-3 block border border-gray-300 rounded-lg text-sm"
            }}
            onSuggestionSelected={handleSuggestionSelected}


            theme={{
                container: 'relative bg-transparent border-none lg:h-7/10 w-1/8 lg:w-full rounded-full text-lg',
                suggestionsContainerOpen: 'absolute bg-white p-2 z-30 shadow-lg rounded-lg w-full max-w-auto text-main-color overflow-x-auto text-md',
                suggestion: 'cursor-pointer p-1 rounded-md hover:bg-second-color text-base',
                input: 'w-full h-11 px-3 block border border-gray-300 rounded-lg text-sm',
            }}
        />
    );
};

export default Autocomplete;
