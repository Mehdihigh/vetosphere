import React, { useState } from "react";
import { useSendEmailCode } from "../../hooks/useAuth";
import Input from "../../components/common/form/Input.tsx";
import Button from "../../components/common/button/Button.tsx";

interface SendEmailLoginProps {
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    email: string;
    nextStep: () => void;
}

const SendEmailLogin: React.FC<SendEmailLoginProps> = ({
                                                           setEmail,
                                                           email,
                                                           nextStep,
                                                       }) => {
    const [isEmailValid, setIsEmailValid] = useState(false);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const { isLoading, sendEmailCodeHandler } = useSendEmailCode(email, nextStep);

    const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setEmail(value);
        setIsEmailValid(emailRegex.test(value));
    };

    const handlePostEmail = (event: React.FormEvent) => {
        event.preventDefault();
        sendEmailCodeHandler();
    };

    return (
        <>
            {isLoading ? (
                <div className="flex items-center justify-around max-h-[70%]">
                    <p>Chargement...</p>
                </div>
            ) : (
                <form
                    className="w-full h-[60%] relative flex justify-center items-center flex-col"
                    onSubmit={handlePostEmail}
                >
                    <div className="w-[70%]">
                        <p className="text-gray-700 text-center mb-4">
                            Rentrez votre email, vous allez recevoir un code dans les prochaines minutes.
                        </p>
                        <div className={"h-32"}>
                            <Input
                                isRequired={true}
                                type="email"
                                value={email}
                                onChange={handleChangeEmail}
                                className="w-full px-3 py-3 my-4 bg-white border border-gray-300 rounded-[4px] text-sm"
                                placeholder="nom@email.com"
                            />
                            {!isEmailValid && email && (
                                <p className="text-red-600 text-sm">
                                    Veuillez entrer une adresse email valide.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="w-[70%]">
                        <Button
                            type="submit"
                            typeClass="colorButton"
                            content="Envoyer le code"
                            disabled={!isEmailValid || isLoading}
                        />
                    </div>
                </form>
            )}
        </>
    );
};

export default SendEmailLogin;
