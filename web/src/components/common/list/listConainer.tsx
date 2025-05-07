import React from "react";
import Skeleton from "react-loading-skeleton";
import ListItem from "./listItem";
import Loader from "../../utils/loader";


const ListContainer = ({ list, onClick, isLoading, title, height, label, button}) => {
    return (
        <div className={`w-full ${height} border rounded-lg p-4 bg-white shadow-lg`}>

            <div className="w-full h-1/6 flex items-center justify-center text-xl font-bold text-gray-700">
                {title}
            </div>
            <div className="w-full h-5/6 overflow-auto">
                {button}
                {isLoading ? (
                    <Loader/>
                ) : list.length > 0 ? (
                    list.map((item, index) => (
                        <ListItem
                            key={index}
                            item={item}
                            onClick={() => onClick(item)}
                            label={label}
                        />
                    ))
                ) : (
                    <div className="text-center text-gray-500 mt-4">
                        Aucun élément enregistré
                    </div>
                )}
            </div>

        </div>
    );
};


export default ListContainer;

