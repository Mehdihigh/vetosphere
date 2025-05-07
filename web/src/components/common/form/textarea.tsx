import React, { useEffect, useState } from "react";

interface TextareaProps {
    placeholder?: string;
    className?: string;
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    value?: string;
}

const Textarea: React.FC<TextareaProps> = ({ placeholder, className = "default", onChange, value }) => {
    const [classNameSelected, setClassNameSelected] = useState<string>("");

    useEffect(() => {
        if (className === "default") {
            setClassNameSelected("w-full h-full p-2 block border border-gray-300 rounded-lg text-sm resize-none");
        } else {
            setClassNameSelected(className);
        }
    }, [className]);

    return (
        <textarea
            className={classNameSelected}
            placeholder={placeholder}
            onChange={onChange}
            value={value}
        />
    );
};

export default Textarea;
