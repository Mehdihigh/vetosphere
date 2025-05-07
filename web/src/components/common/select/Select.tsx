// components/common/Select.tsx
import React, { useEffect, useState } from 'react';

interface SelectProps<T> {
    listOptions: T[]; // Liste d'options générique
    className?: string; // Classe CSS optionnelle
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; // Fonction de gestion du changement
    value: string | number; // Valeur sélectionnée
    valueKey: keyof T; // Clé de l'option pour la valeur
    labelKey: keyof T; // Clé de l'option pour le label
    desktop?: boolean; // Booléen pour le style desktop
    disabled?: boolean; // Booléen pour désactiver le select
}

const Select = <T extends { [key: string]: string | number }>({
                                                                  listOptions,
                                                                  className,
                                                                  onChange,
                                                                  value,
                                                                  valueKey,
                                                                  labelKey,
                                                                  desktop,
                                                                  disabled,
                                                              }: SelectProps<T>) => {
    const [classNameSelected, setClassNameSelected] = useState('');

    useEffect(() => {
        if (className === 'default') {
            setClassNameSelected('w-full h-11 px-3 block border border-gray-300 rounded-lg text-sm');
        } else {
            setClassNameSelected(className || '');
        }
    }, [className]);

    return (
        <select
            className={classNameSelected + (desktop ? ' appearance-none focus:rounded-none focus:outline-none transition-all duration-250 transform' : '')}
            onChange={onChange}
            value={value}
            disabled={disabled}
        >
            {listOptions.map((listOption, index) => (
                <option key={index} value={listOption[valueKey]} className={'cursor-pointer'}>
                    {listOption[labelKey]}
                </option>
            ))}
        </select>
    );
};

export default Select;
