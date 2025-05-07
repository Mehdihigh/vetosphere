import { CalendarCheck, CircleArrowRight, Search, User } from 'lucide-react';
import React, { useEffect } from 'react';
import { FaPaw } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import ROUTES from '../../../config/routeCongif.ts';

interface NavBarProps {
  logoHeight?: number;
}

const NavBar: React.FC<NavBarProps> = ({ logoHeight = 100 }) => {
  const location = useLocation();
  const hiddenRoutes = ['/connexion', '/inscription', '/confirmation'];
  if (hiddenRoutes.includes(location.pathname)) return null;

  useEffect(() => {
    document.documentElement.style.overflowX = 'hidden';
    document.documentElement.style.overflowY = 'auto';
    document.documentElement.style.margin = '0';

    document.documentElement.style.padding = '0';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
  }, []);

  return (
    <nav className="bg-[#5B359B] h-1/8 py-3 shadow-md w-full top-0 inset-x-0 z-50">
      <div className="w-full flex items-center justify-between px-6">
        {/* Logo collé à gauche */}
        <div className="flex-shrink-0">
          <img src="src/assets/images/vetospherewhite.png" style={{ height: `${logoHeight}px` }} alt="Logo Vetosphere" />
        </div>

        {/* Menu centré */}
        <ul className="flex-1 flex justify-left space-x-8 text-white font-semibold">
          <li className="flex items-center hover:scale-110 transition-transform duration-200">
            <CalendarCheck className="w-5 h-5 mr-1" />
            <Link to="/agenda" className="no-underline">
              Agenda
            </Link>
          </li>
          <li className="flex items-center hover:scale-110 transition-transform duration-200">
            <FaPaw className="w-5 h-5 mr-1" />
            <Link to="/boutique" className="no-underline">
              Boutique
            </Link>
          </li>
        </ul>

        {/* Barre de recherche + Profil à droite */}
        <div className="relative flex items-center space-x-4 ml-auto">
          {/* Barre de recherche */}
          <div className="relative flex items-center space-x-2">
            <input
              type="text"
              className="w-[300px] pl-6 pr-4 py-1 rounded-full text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Rechercher..."
            />
            <button className="bg-white text-gray-700 p-2 rounded-full border border-gray-300 hover:bg-gray-200 flex items-center justify-center">
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Icône Profil à droite */}
          <Link to="/profil">
            <div className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-200">
              <User className="w-5 h-5 text-gray-700" />
            </div>
          </Link>
          <Link to={ROUTES.LOGIN}>
            <div className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-200">
              <CircleArrowRight className="w-5 h-5 text-gray-700" />
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
