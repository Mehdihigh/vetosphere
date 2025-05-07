import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importer useNavigate
import Button from "../../components/common/button/Button.tsx";
import Input from "../../components/common/form/Input.tsx";
import ROUTES from "../../config/routeCongif.ts";
import { useAuth } from "../../context/AuthContext";

interface FormLoginProps {
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    email: string;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    password: string;
    handleForgetPassword: () => void;
}

const FormLogin: React.FC<FormLoginProps> = ({
    setEmail,
    email,
    setPassword,
    password,
    handleForgetPassword,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate(); // Initialiser useNavigate

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const response = await login(email, password);
            console.log(response)
            //navigate(ROUTES.EVENT); // Rediriger vers l'agenda après une connexion réussie
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center w-full h-full">
            <form
                onSubmit={handleLogin}
                className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg"
            >
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                    Connexion
                </h2>
                {isLoading ? (
                    <p className="text-center text-gray-500">Chargement...</p>
                ) : (
                    <>
                        <div className="mb-4">
                            <Input
                                isRequired
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-500"
                                placeholder="Adresse e-mail"
                            />
                        </div>
                        <div className="mb-4 relative">
                            <Input
                                isRequired
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-500"
                                placeholder="Mot de passe"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-2 right-3 text-gray-500"
                            >
                                {showPassword ? "👁️" : "🙈"}
                            </button>
                        </div>
                        <div className="mb-4 text-right">
                            <p
                                onClick={handleForgetPassword}
                                className="text-sm text-indigo-600 hover:underline cursor-pointer"
                            >
                                Mot de passe oublié ?
                            </p>
                        </div>
                        <Button
                            type="submit"
                            typeClass="colorButton"
                            content="Se connecter"
                            className="w-full py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                        />
                        <p className="text-center text-sm text-gray-600 mt-4">
                            Pas de compte ?{" "}
                            <button
                                type="button"
                                className="text-indigo-600 hover:underline"
                                onClick={() => navigate(ROUTES.REGISTRATION)} // Rediriger vers la page d'inscription
                            >
                                Inscription
                            </button>
                        </p>
                    </>
                )}
            </form>
        </div>
    );
};

export default FormLogin;
