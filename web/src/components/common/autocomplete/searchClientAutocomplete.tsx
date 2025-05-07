import React, { useState, useEffect, useRef } from "react";
import Autosuggest from "react-autosuggest";
import { useNavigate } from "react-router-dom";
import {getSearch} from "../../../services/api/user/clientApi.ts";

interface Suggestion {
    label: string;
    value: number;
}

interface SearchClientAutocompleteProps {
    className?: string;
    onSuggestionSelected: (event: React.FormEvent, data: { suggestion: Suggestion }) => void;
    infoUser?: string;
}

const SearchClientAutocomplete: React.FC<SearchClientAutocompleteProps> = ({
                                                                               className,
                                                                               onSuggestionSelected,
                                                                               infoUser = "",
                                                                           }) => {
    const [value, setValue] = useState<string>(infoUser);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);

    const onSuggestionsFetchRequested = async ({ value }: { value: string }) => {
        if (value.length >= 2) {
            try {
                const data = {
                    search: value.toLowerCase(),
                }
                const response = await getSearch(data);
                const fetchedSuggestions: Suggestion[] = response.data;
                setSuggestions([...fetchedSuggestions]);
                setIsOpen(true);
            } catch (error) {
                console.error("Erreur lors de la récupération des suggestions :", error);
            }
        }
    };

    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
        setIsOpen(false);
    };

    const renderSuggestion = (suggestion: Suggestion) => (
        <div className="cursor-pointer p-1 rounded-md hover:bg-gray-200">{suggestion.label}</div>
    );

    useEffect(() => {
        if (infoUser !== null) {
            setValue(infoUser);
        }
    }, [className, infoUser]);

    const handleSuggestionSelected = (event: React.FormEvent, { suggestion }: { suggestion: Suggestion }) => {
        onSuggestionSelected(event, { suggestion });
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
                placeholder: "Rechercher...",
                value: value || "",
                onChange: (_, { newValue }) => setValue(newValue),
                onFocus: () => setIsOpen(true),
                onBlur: handleBlur,
                ref: inputRef,
                className: "w-full h-11 px-3 block border border-gray-300 rounded-lg text-sm",
            }}
            onSuggestionSelected={handleSuggestionSelected}
            highlightFirstSuggestion
            theme={{
                container: "relative bg-transparent border-none lg:h-7/10 w-full rounded-full text-base text-lg",
                suggestionsContainerOpen:
                    "absolute bg-white p-2 z-30 shadow-lg rounded-lg w-full max-w-full min-h-64 top-14 text-main-color overflow-x-auto text-md",
                suggestion: "cursor-pointer p-1 rounded-md hover:bg-gray-200 text-base",
                input: "w-full h-11 px-3 block border border-gray-300 rounded-lg text-sm",
            }}
        />
    );
};

export default SearchClientAutocomplete;
