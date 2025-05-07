const ListItem = ({ item, onClick, label }) => {
    return (
        <div
            className="w-full px-2 py-2  mb-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg shadow-sm cursor-pointer flex items-center justify-between"
            onClick={onClick}
        >
            <div className="text-gray-800 font-medium">
                {item[label] || "Valeur indisponible"}
            </div>

            <div className="text-blue-500 font-bold">Détails →</div>
        </div>
    );
};


export default ListItem;