import React, { useState, useEffect, useRef } from 'react';
import Autosuggest from 'react-autosuggest';
import '../../../assets/styles/component/autocomplete.css';
import { GetSuggestions } from "../../../api/base/api";
import { useNavigate } from 'react-router-dom';
import { defaultSuggestionsAlways, defaultSuggestionsConditional } from "../../../utils/variable";

const Autocomplete = ({ className, onSuggestionSelected, infoUser,setCalendarToDoListPopup }) => {
    const [value, setValue] = useState(infoUser || '');
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const inputRef = useRef(null);

    const onSuggestionsFetchRequested = async ({ value }) => {
        if (value.length >= 2) {
            const fetchedSuggestions = await GetSuggestions(value);

            const filteredConditionalSuggestions = defaultSuggestionsConditional.filter(suggestion =>
                suggestion.label.toLowerCase().includes(value.toLowerCase())
            );

            const updatedSuggestions = [...fetchedSuggestions, ...filteredConditionalSuggestions, ...defaultSuggestionsAlways];
            setSuggestions(updatedSuggestions);
            setIsOpen(true);
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

    useEffect(() => {
        if (infoUser !== null) {
            setValue(infoUser);
        }
    }, [className, infoUser]);

    const handleSuggestionSelected = (event, { suggestion }) => {
        switch (suggestion.value){
            case "newPatient":
                navigate(`/patient/nouveau`);
                break;
            case "showToDoList":
                setCalendarToDoListPopup(true)
                break;
            default :
                onSuggestionSelected(event, { suggestion });
                break
        }

        setSuggestions([]);
        setIsOpen(false);
        setValue('');
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
                value: value || '',
                onChange: (_, { newValue }) => setValue(newValue),
                onFocus: () => setIsOpen(true),
                onBlur: handleBlur,
                ref: inputRef
            }}
            onSuggestionSelected={handleSuggestionSelected}
            highlightFirstSuggestion
            theme={{
                container: 'relative bg-transparent border-none lg:h-7/10 w-1/8 lg:w-full rounded-full text-white text-lg',
                suggestionsContainerOpen: 'absolute bg-white p-2 z-30 shadow-lg rounded-lg w-full max-w-full text-main-color overflow-x-auto text-md min-h-64 max-h-64',
                suggestion: 'cursor-pointer p-1 rounded-md hover:bg-second-color text-base',
                input: 'w-full bg-transparent focus:outline-none placeholder:text-white',

            }}
        />
    );
};

export default Autocomplete;
