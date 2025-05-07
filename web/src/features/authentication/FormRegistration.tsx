import React, { useState } from "react";
import Button from "../../components/common/button/Button.tsx";
import Input from "../../components/common/form/Input.tsx";
import ROUTES from "../../config/routeCongif.ts";
import { useNavigate } from "react-router-dom"; 
import { useRegister } from "../../hooks/useAuth.ts";

const FormRegistration: React.FC = () => {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState(""); // Correction du nom de la variable
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [civility, setCivility] = useState("m.");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [photo, setPhoto] = useState<File | undefined>(undefined);
    const [num_rpps, setNumRpps] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { isLoading, registerHandler } = useRegister();
    const navigate = useNavigate();

    const handleRegistration = async (event: React.FormEvent) => {
        event.preventDefault();
    
        if (password !== confirmPassword) {
            alert("❌ Les mots de passe ne correspondent pas !");
            return;
        }
    
        const isDefaultPhoto = !photo; // Vérifie si l'utilisateur a uploadé une photo
    
        try {
            const response = await registerHandler(email, phone, first_name, last_name, civility, password, num_rpps,isDefaultPhoto , photo);
            
            if (response && response.status && response.status() === 201) {
                setSuccessMessage("✅ INSCRIPTION RÉUSSIE");
            }
        } catch (error) {

        }
    };
    

    return (
        <div className="flex justify-center items-center w-full h-screen bg-gray-100">
            <form onSubmit={handleRegistration} className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Inscription</h2>

                {isLoading ? (
                    <p className="text-center text-gray-500">Chargement...</p>
                ) : (
                    <>
                        <Input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-500 mb-4"
                            placeholder="Adresse e-mail" 
                            isRequired 
                        />

                        <Input 
                            type="text" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-500 mb-4"
                            placeholder="Téléphone" 
                            isRequired 
                        />
                        
                        <Input 
                            type="text" 
                            value={first_name} 
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-500 mb-4"
                            placeholder="Prénom" 
                            isRequired 
                        />
                        
                        <Input 
                            type="text" 
                            value={last_name} 
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-500 mb-4"
                            placeholder="Nom" 
                            isRequired 
                        />
                        <Input 
                            type="text" 
                            value={num_rpps} 
                            onChange={(e) => setNumRpps(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-500 mb-4"
                            placeholder="Numéro RPPS" 
                            isRequired 
                        />
                        <select 
                            value={civility} 
                            onChange={(e) => setCivility(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-500 mb-4"
                        >
                            <option value="m.">Monsieur</option>
                            <option value="mme.">Madame</option>
                            <option value="autre">Autre</option>
                        </select>
                        <div className="relative mb-4">
                            <Input 
                                type={showPassword ? "text" : "password"} 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-500"
                                placeholder="Mot de passe" 
                                isRequired 
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600"
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>
                        
                        <div className="relative mb-4">
                            <Input 
                                type={showConfirmPassword ? "text" : "password"} 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-500"
                                placeholder="Confirmer le mot de passe" 
                                isRequired 
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600"
                            >
                                {showConfirmPassword ? "🙈" : "👁️"}
                            </button>
                        </div>

                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : undefined)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-500 mb-4" 
                        />

                        <Button 
                            type="submit" 
                            typeClass="colorButton" 
                            content="S'inscrire"
                            className="w-full py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md mb-4" 
                        />

                        {successMessage && <p className="text-center text-green-500 mt-4">{successMessage}</p>}

                        <p className="text-center text-sm text-gray-600 mt-4">
                            Vous avez déjà un compte ?{" "}
                            <button 
                                type="button" 
                                className="text-indigo-600 hover:underline"
                                onClick={() => navigate(ROUTES.LOGIN)}
                            >
                                Connexion
                            </button>
                        </p>
                    </>
                )}
            </form>
        </div>
    );
};

export default FormRegistration;
