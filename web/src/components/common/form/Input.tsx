import React, { useEffect, useState } from 'react';
import { IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface InputProps {
    isRequired?: boolean;
    type: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className: string;
    placeholder?: string;
    showPassword?: boolean;
    toggleShowPassword?: () => void;
    disabled?: boolean;
    checked?: boolean;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
                                         isRequired,
                                         type,
                                         value,
                                         onChange,
                                         className,
                                         placeholder,
                                         showPassword,
                                         toggleShowPassword,
                                         disabled,
                                         checked,
                                         onKeyDown
                                     }) => {
    const [classNameSelected, setClassNameSelected] = useState<string>('');

    useEffect(() => {
        if (className === "default") {
            setClassNameSelected("w-full h-11 px-3 block border border-gray-300 rounded-lg text-sm");
        } else {
            setClassNameSelected(className);
        }
    }, [className]);

    return (
        <div className="flex items-center w-full">
            <input
                type={showPassword && type === "password" ? "text" : type}
                className={classNameSelected}
                value={value}
                onChange={onChange}
                required={isRequired}
                placeholder={placeholder}
                disabled={disabled}
                checked={type === "checkbox" ? checked : undefined}
                onKeyDown={onKeyDown}
            />

            {type === "password" && toggleShowPassword && (
                <div className="border border-gray-300 rounded-r-lg ">
                    <IconButton onClick={toggleShowPassword} >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                </div>
            )}
        </div>
    );

};

export default Input;
