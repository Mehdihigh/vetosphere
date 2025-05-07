import Button from "./Button.tsx";

const ButtonChoice = ({handleClick, onClose, methodValidate, role}) => {
    return (
        <div className={"flex items-center justify-between w-full space-x-4"}>
            {role &&
                <Button
                    onClick={handleClick}
                    type={"submit"}
                    content={methodValidate === "POST" ? "Ajouter" : "Mettre à jour"}
                    typeClass={"validButton"}
                />
            }

            <Button
                onClick={onClose}
                type={"submit"}
                disabled={false}
                content={"Fermer"}
                typeClass={"closeButton"}
            />
        </div>
    );
}

export default ButtonChoice;
