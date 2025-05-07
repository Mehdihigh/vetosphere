//import { useLocation } from "react-router-dom";
import AppRoutes from "./AppRoute.tsx";
//import NavBar from "../components/layout/navBar/NavBarDesktop.tsx";
//import ROUTES from "../config/routeCongif.ts";

const AppLayout: React.FC = () => {
    //const location = useLocation();
    //const shouldShowNavBar = location.pathname !== ROUTES.LOGIN;

    return (

        <AppRoutes/>

    );
};

export default AppLayout;
