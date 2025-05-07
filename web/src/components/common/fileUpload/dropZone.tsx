import React from 'react';
import { useDrop } from 'react-dnd';
import {ItemTypes} from "../../utils/variable";


const Dropzone = ({ onDrop, children }) => {
    const [{ isOver }, dropRef] = useDrop({
        accept: ItemTypes.CARD,
        drop: (item) => onDrop(item),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });

    return (
        <div
            ref={dropRef}
            className="flex flex-wrap h-28 w-full"
            style={{
                backgroundColor: isOver ? 'lightgreen' : '',
            }}
        >
            {children}
        </div>
    );
};

export default Dropzone;