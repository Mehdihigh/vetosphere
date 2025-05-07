import React, { useEffect, useState } from 'react';
import Loader from '../../../utils/Loader'

interface ButtonProps {
    onClick?: () => void;  // Rendre onClick optionnel
    type: "button" | "submit" | "reset";
    className?: string;
    content: string;
    disabled?: boolean;
    typeClass?: "defaultButton" | "validButton" | "closeButton" | "colorButton";
    size?: string;
    isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
                                           onClick,
                                           type,
                                           className,
                                           content,
                                           disabled,
                                           typeClass,
                                           size,
                                           isLoading
                                       }) => {
    const [buttonClass, setButtonClass] = useState<string>('');

    useEffect(() => {

        switch (typeClass) {
            case "defaultButton":
                setButtonClass(className || '');
                break;
            case "validButton":
                setButtonClass(
                    "w-full h-auto text-white bg-validation-button hover:bg-hover-validation-button px-4 py-2 rounded-md"
                );
                break;
            case "closeButton":
                setButtonClass(
                    "w-full h-auto text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md"
                );
                break;
            case "colorButton":
                setButtonClass(
                    "w-full border-none rounded-md text-center relative text-white px-4 py-2 bg-button-color hover:bg-hover-button"
                );
                break;
            default:
                setButtonClass(className || '');
        }

    }, [className, typeClass]);

    return (
        <button
            type={type}
            className={`${buttonClass} ${size} ${disabled ? 'cursor-not-allowed bg-gray-400 hover:bg-gray-400' : 'cursor-pointer'}`}
            onClick={onClick}
            disabled={disabled}
        >
            {isLoading ? <Loader /> : content}
        </button>
    );
}

export default Button;
