import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import "font-awesome/css/font-awesome.min.css";
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import Home from './Pages/home';
import CarRental from './Pages/carRental';
import RentingInfo from './Pages/rentingInfo';
import Register from './Pages/register';
import Taxi from './Pages/taxi';
import Gallery from './Pages/gallery';
import AboutUs from './Pages/aboutUs';
import Profile from './Pages/profile';
import CarDetails from './Pages/carDetails';
import VerifyEmail from './Pages/VerifyEmail';
import VerificationWidget from './Components/VerificationWidget';
import BookTaxi from './Pages/BookTaxi'; 
import VerifyOrder from './Pages/verifyOrder';

function AnimatedRoutes({ data }) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setIsFading(true); 
      
      const timeout = setTimeout(() => {
        setDisplayLocation(location); 
        window.scrollTo(0, 0);        
        setIsFading(false);           
      }, 300); 

      return () => clearTimeout(timeout);
    }
  }, [location, displayLocation.pathname]);

  return (
    <>
      <div className={`black-fade-overlay ${isFading ? 'active' : ''}`} />

      <Routes location={displayLocation}>
        <Route path="/" element={<Home serverData={data} />} />
        <Route path="/CarRental" element={<CarRental />} />
        <Route path="/RentingInfo" element={<RentingInfo />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Taxi" element={<Taxi />} />
        <Route path="/Gallery" element={<Gallery />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path='/CarRental/:id' element={<CarDetails/>}/>
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/verify-order" element={<VerifyOrder />} />
        {/*<Route path="/book-taxi" element={<BookTaxi />} />*/}
      </Routes>
    </>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [data, setData] = useState(null);
/*
  useEffect(() => {
    fetch('https://localhost:7065/api/status')
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(json => {
        setData(json);
        setIsOffline(false);
      })
      .catch(() => {
        setIsOffline(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Connecting to Backend...</span>
        </div>
      </div>
    );
  }

  if (isOffline) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center shadow">
          <h4>Backend Connection Failed</h4>
          <p>Please ensure the Visual Studio project is running on port 7065.</p>
          <button className="btn btn-outline-danger" onClick={() => window.location.reload()}>
            Retry Connection
          </button>
        </div>
      </div>
    );
  }
*/
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-layout">
          <main className="main-content">
            <AnimatedRoutes data={data} />
          </main>
          
          <VerificationWidget />
          
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
