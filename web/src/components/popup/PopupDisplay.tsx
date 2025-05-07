import { useEffect, useState, ReactNode } from "react";
import { printBlackBackground } from "../../utils/blackBakground.ts";

interface PopupContainerProps {
    children: ReactNode;
    onClose: () => void;
    size?: string;
    flex?: string;
}

const PopupContainer: React.FC<PopupContainerProps> = ({ children, onClose, size = "", flex = "" }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        printBlackBackground(onClose);
        setIsVisible(true);
        
    }, [onClose]);

    return (
        <div
            className={`bg-white fixed z-30 ${size} ${flex} 
            top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            rounded-2xl p-4 shadow-lg lg:p-8 
            transition-all duration-100 ease-in-out ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        >
            {children}
        </div>
    );
};

export default PopupContainer;
