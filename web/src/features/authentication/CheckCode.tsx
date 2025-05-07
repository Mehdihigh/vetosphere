import React, {useState} from "react";
import Input from "../../components/common/form/Input.tsx";
import Button from "../../components/common/button/Button.tsx";
import {useCheckCode} from "../../hooks/useAuth.ts";

interface CheckCodeProps {
    email: string;
    nextStep: () => void;
}

const CheckCode: React.FC<CheckCodeProps> = ({ email,nextStep }) => {
    const [code, setCode] = useState("");

    const {isLoading, checkCodeHandler} = useCheckCode(email,code,nextStep);

    const handlePostCode = (event: React.FormEvent) => {
        event.preventDefault();
        checkCodeHandler();
    }

    return (
        <>
            {isLoading ? (
                <div className="flex items-center justify-around max-h-[70%]">
                    <p>Chargement...</p>
                </div>
            ) : (
                <form
                    className="w-full h-[60%] relative flex justify-center items-center flex-col"
                    onSubmit={handlePostCode}
                >
                    <div className="w-[70%]">
                        <p className="messageSendEmail">
                            Veuillez rentré le code que vous avez reçu par mail.
                        </p>

                        <div>
                            <Input
                                isRequired={true}
                                type={"text"}
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="w-full px-3 py-3 my-4 bg-white border border-gray-300 rounded-[4px] text-sm"
                                placeholder={"Ex : FiNcEeMY"}
                            />
                        </div>

                    </div>


                    <div>
                        <Button
                            type={"submit"}
                            typeClass="colorButton"
                            content={"Envoyer le code"}
                        />
                    </div>

                </form>
            )}
        </>
    );
};

export default CheckCode;
