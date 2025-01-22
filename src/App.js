import logo from './logo.svg';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './App.css';
import "./index.css"
import 'leaflet/dist/leaflet.css';
import MapComponent from './MapComponent';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './connexion_pages/Login';
import Register from './connexion_pages/Register';
import DeliveryManagement from './pages/Tournee';
import Footer from './components/Footer';
import Abonnement from './pages/Abonnement';
import Profile from './pages/Profile';
import Calendrier from './pages/Calendrier';


const App = () => {
  const location = useLocation();
  const excludeHeaderRoutes = ['/register', '/login'];
  const excludeFooterRoutes = ['/register', '/login'];
  const isHeaderVisible = !excludeHeaderRoutes.includes(location.pathname);
  const isFooterVisible = !excludeFooterRoutes.includes(location.pathname);



  
  return (
    <AuthProvider>
      <div> 
        {isHeaderVisible && <Header />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/mapcomponent" element={<MapComponent />} />
          <Route path="/abonnement" element={<Abonnement />} />
          <Route path="/delivery" element={<DeliveryManagement />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/calendrier" element={<Calendrier />} />

        </Routes>
        {isFooterVisible && <Footer  />}
      </div>
    </AuthProvider>
  );
};

export default App;
