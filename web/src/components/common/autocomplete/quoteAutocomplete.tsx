import React, { useState, useRef } from 'react';
import Autosuggest from 'react-autosuggest';
import '../../../assets/styles/component/autocomplete.css';
import { useNavigate } from 'react-router-dom';
import { GetSearchQuote } from '../../../api/document/get';

const QuoteAutocomplete = ({ className, onSuggestionSelected, idPatient }) => {
    const [value, setValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const inputRef = useRef(null);

    const onSuggestionsFetchRequested = async ({ value }) => {
        if (value.length >= 2) {
            try {
                const fetchedSuggestions = await GetSearchQuote(value, idPatient);
                setSuggestions(fetchedSuggestions);
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

    const handleSuggestionSelected = (event, { suggestion }) => {
        onSuggestionSelected(event, { suggestion });
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
                placeholder: 'Rechercher...',
                value: value,
                onChange: (_, { newValue }) => setValue(newValue),
                onFocus: () => setSuggestions(suggestions),
                onBlur: handleBlur,
                ref: inputRef
            }}
            onSuggestionSelected={handleSuggestionSelected}
            highlightFirstSuggestion
            theme={{
                container: className,
                suggestionsContainerOpen: 'autocomplete-suggestions-container-open',
            }}
        />
    );
};

export default QuoteAutocomplete;
