import React, { useState } from "react";
import FormLogin from "../features/authentication/FormLogin";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className="flex justify-center items-center w-full h-screen bg-gray-100">
            <FormLogin
                setEmail={setEmail}
                email={email}
                setPassword={setPassword}
                password={password}
                handleForgetPassword={() => console.log("Mot de passe oublié")}
            />
        </div>
    );
};

export default Login;
