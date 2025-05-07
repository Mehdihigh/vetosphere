import React, { useEffect, useState } from 'react';
import Button from '../../components/common/button/Button.tsx';
import Input from '../../components/common/form/Input.tsx';
import { useNewPassword } from '../../hooks/useAuth.ts';

interface NewPasswordProps {
  nextStep: () => void;
  email: string;
}

const NewPassword: React.FC<NewPasswordProps> = ({ nextStep, email }) => {
  const [firstPassword, setFirstPassword] = useState('');
  const [secondPassword, setSecondPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const { isLoading, newPasswordHandler } = useNewPassword(email, secondPassword, nextStep);

  useEffect(() => {
    setIsButtonDisabled(!(passwordMatch && passwordValid));
  }, [passwordMatch, passwordValid]);

  const handleFirstPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFirstPassword(value);
    setPasswordMatch(value === secondPassword);
    setPasswordValid(passwordRegex.test(value));
  };

  const handleSecondPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSecondPassword(value);
    setPasswordMatch(firstPassword === value);
  };

  const handlePostNewPassword = (event: React.FormEvent) => {
    event.preventDefault();
    newPasswordHandler();
  };

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-around max-h-[70%]">
          <p>Chargement...</p>
        </div>
      ) : (
        <form className="w-full h-[60%] relative flex justify-center items-center flex-col" onSubmit={handlePostNewPassword}>
          <div className="w-[70%]">
            <p className="messageSendEmail">Veuillez rentrer votre nouveau mot de passe.</p>
            <div>
              <Input
                isRequired={true}
                type={'password'}
                value={firstPassword}
                onChange={handleFirstPasswordChange}
                className="w-full px-3 py-3 my-4 bg-white border border-gray-300 rounded-[4px] text-sm"
                placeholder={'Mot de passe'}
                showPassword={showPassword}
                toggleShowPassword={() => setShowPassword(!showPassword)}
              />
              {!passwordValid && (
                <p className="text-red-600 text-sm">
                  Le mot de passe doit contenir au moins 8 caractères, un chiffre, un caractère spécial et une majuscule.
                </p>
              )}
              <Input
                isRequired={true}
                type={'password'}
                value={secondPassword}
                onChange={handleSecondPasswordChange}
                className="w-full px-3 py-3 my-4 bg-white border border-gray-300 rounded-[4px] text-sm"
                placeholder={'Confirmation'}
                showPassword={showPassword}
                toggleShowPassword={() => setShowPassword(!showPassword)}
              />

              {!passwordMatch && <p className="text-red-600 text-sm">Les mots de passe ne correspondent pas.</p>}
            </div>

            <div>
              <Button type={'submit'} typeClass="colorButton" content={'Enregistrer le mot de passe'} disabled={isButtonDisabled} />
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default NewPassword;
