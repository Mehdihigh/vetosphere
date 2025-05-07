import React, {useState} from "react";

const UploadDocument = ({selectedFile,setSelectedFile}) => {
    const [fileName, setFileName] = useState('');

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        setFileName(file.name);
        setSelectedFile(file);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFileName(file.name);
        setSelectedFile(file);
    };
    return (
        <div
            className="w-full h-full cursor-pointer border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-center bg-gray-100 hover:bg-gray-200 transition-colors duration-300 ease-in-out mb-5"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <input
                type="file"
                id="fileInput"
                className="hidden"
                onChange={handleFileChange}
            />
            <label htmlFor="fileInput"
                   className="text-base text-gray-600 p-5 w-full h-full flex items-center justify-around cursor-pointer">
                {selectedFile ? selectedFile.name : 'Choisir ou déposer un fichier'}
            </label>
        </div>
    )
}

export default UploadDocument