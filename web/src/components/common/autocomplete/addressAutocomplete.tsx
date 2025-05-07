import React, { useState, useRef } from 'react';
import Autosuggest from 'react-autosuggest';
import '../../../assets/styles/component/autocomplete.css';
import { GetAddress } from "../../../api/utils/address";

const AddressAutocomplete = ({ className, onSuggestionSelected, setAddressDetails, defaultAddress}) => {
    const [value, setValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef(null);

    const onSuggestionsFetchRequested = async ({ value }) => {
        if (value.length >= 3) {
            const response = await GetAddress(value);
            if (response.data && response.data.features) {
                const fetchedSuggestions = response.data.features.map(feature => ({
                    name: feature.properties.name,
                    postcode: feature.properties.postcode,
                    city: feature.properties.city || feature.properties.municipality
                }));
                setSuggestions(fetchedSuggestions);
                setIsOpen(true);
            }
        }
    };

    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
        setIsOpen(false);
    };

    const renderSuggestion = (suggestion) => (
        <div>
            {suggestion.name}, {suggestion.city} {suggestion.postcode}
        </div>
    );

    const handleSuggestionSelected = (event, { suggestion }) => {
        setValue(suggestion.name);
        setAddressDetails({
            address: suggestion.name,
            postalCode: suggestion.postcode,
            city: suggestion.city
        });
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
            getSuggestionValue={(suggestion) => suggestion.name}
            renderSuggestion={renderSuggestion}
            inputProps={{
                placeholder: 'Adresse...',
                value: value || defaultAddress || '',
                onChange: (_, { newValue }) => setValue(newValue),
                onFocus: () => setIsOpen(true),
                onBlur: handleBlur,
                ref: inputRef,
                autoComplete: 'new-password',
                name: 'autocomplete-off',
                id: 'autocomplete-off',
                default:defaultAddress
            }}
            onSuggestionSelected={handleSuggestionSelected}
            highlightFirstSuggestion
            theme={{
                container: 'relative bg-transparent border-none lg:h-7/10 w-1/8 lg:w-full rounded-full text-base',
                suggestionsContainerOpen: 'absolute bg-white p-2 z-30 shadow-lg rounded-lg w-full max-w-full text-main-color top-14  min-h-64 max-h-64 overflow-x-auto text-md',
                suggestion: 'cursor-pointer p-1 rounded-md hover:bg-second-color text-base',
                input: 'w-full h-11 px-3 block border border-gray-300 rounded-lg text-sm',
            }}
        />
    );
};

export default AddressAutocomplete;
