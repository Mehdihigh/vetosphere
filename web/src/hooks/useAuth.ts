import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {login, checkCode, newPassword, sendEmailCode, register} from "../services/api/authApi.ts";
import ROUTES from "../config/routeCongif.ts";


export const useLogin = (setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>) => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const loginHandler = async (email: string, password: string) => {
        setIsLoading(true);
        try {

            const isConnected = await login(email, password);

            if (isConnected) {
                setIsAuthenticated(true);
                navigate(ROUTES.HOME);
            } else {

                throw new Error("Email ou mot de passe incorrect");
            }
        } catch (error) {

            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, loginHandler };
};

export const useRegister = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const registerHandler = async (
        email: string,
        phone: string,
        first_name: string,
        last_name: string,
        civility: string,
        password: string,
        num_rpps: string,
        isDefaultPhoto: boolean,
        photo?: File
    ) => {
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("email", email);
            formData.append("phone", phone);
            formData.append("first_name", first_name);
            formData.append("last_name", last_name);
            formData.append("civility", civility);
            formData.append("password", password);
            formData.append("num_rpps", num_rpps);
            formData.append("isDefaultPhoto", JSON.stringify(isDefaultPhoto));

            if (photo) {
                formData.append("photo", photo);
            }

            console.log("🔄 Envoi de la requête d'inscription :", Object.fromEntries(formData));

            const response = await register(formData);
            console.log("🔄 Réponse de la requête d'inscription :", response);
            // Vérification standard de la réponse
            if (response?.status === 201) {
                console.log("✅ Inscription réussie !");
                navigate(ROUTES.LOGIN);
                return response.data;
            }

            console.error("❌ Erreur lors de l'inscription :", response);
            throw new Error(response?.data.message || "Une erreur inconnue s'est produite.");

        } catch (error) {
            console.error("❌ Erreur réseau ou de traitement :", error);
            throw error; // Propager l'erreur pour la gestion côté UI
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, registerHandler };
};


export const useSendEmailCode = (email: string, nextStep: () => void) => {
    const [isLoading, setIsLoading] = useState(false);

    const sendEmailCodeHandler = async () => {
        setIsLoading(true);
        try {
            const response = await sendEmailCode(email);

            if (response.status === 204) {
                nextStep();
            } else {

            }
        } catch (error) {
            throw error;

        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, sendEmailCodeHandler };
};

export const useCheckCode = (email: string, code: string, nextStep: () => void) => {
    const [isLoading, setIsLoading] = useState(false);

    const checkCodeHandler = async () => {
        setIsLoading(true);
        try {
            const response = await checkCode(email, code);

            if (response.status === 204) {
                nextStep();
            } else {

            }
        }catch (error) {
            throw error;

        }finally {
            setIsLoading(false)
        }
    }

    return {isLoading, checkCodeHandler}
}

export const useNewPassword = (email: string, password: string, nextStep: () => void) => {
    const [isLoading, setIsLoading] = useState(false);


    const newPasswordHandler = async () => {
        setIsLoading(true);
        try {
            const response = await newPassword(email, password);

            if (response.status === 204) {
                nextStep()
            } else {

            }
        } catch (error) {
            throw error;

        } finally {
            setIsLoading(false);
        }
    }
    return {isLoading, newPasswordHandler};
};