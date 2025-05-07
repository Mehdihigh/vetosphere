import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import NavBar from './components/layout/navBar/NavBar.tsx';
import { AuthProvider } from "./context/AuthContext.tsx";
import AppLayout from "./routes/AppLayout.tsx";

function App(): JSX.Element {


  return (
    <Router>
      <AuthProvider>
          <NavBar/>
          <AppLayout />
      </AuthProvider>
    </Router>
  );
}

export default App;
