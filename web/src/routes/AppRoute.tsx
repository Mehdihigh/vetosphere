import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ROUTES from '../config/routeCongif.ts';
import FormRegistration from '../features/authentication/FormRegistration';
import Animal from '../pages/Animal.tsx';
import BoutiquePage from '../pages/BoutiquePage.tsx';
import ClientPage from '../pages/ClientPage.tsx';
import Event from '../pages/Event.tsx';
import Home from '../pages/Home.tsx';
import Login from '../pages/Login';
import NewAnimal from '../pages/NewAnimal.tsx';
import ProfilePage from '../pages/ProfilePage.tsx';

const AppRoutes: React.FC = () => {
  return (
    <main className="w-full h-7/8 pb-1 lg:pb-0 pt-8 px-4 lg:pt-0">
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.REGISTRATION} element={<FormRegistration />} />
        <Route path={ROUTES.EVENT} element={<Event />} />
        <Route path={ROUTES.ProfilePage} element={<ProfilePage />} />
        <Route path={ROUTES.INFO_ANIMAL} element={<Animal />} />
        <Route path={ROUTES.NOUVEL_ANIMAL} element={<NewAnimal />}></Route>
        <Route path={ROUTES.CLIENT} element={<ClientPage />}></Route>
        <Route path={ROUTES.BOUTIQUE} element={<BoutiquePage />} />
      </Routes>
    </main>
  );
};

export default AppRoutes;
