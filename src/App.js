import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Pages/home';
import Autoberles from './Pages/autoberles'
import "font-awesome/css/font-awesome.min.css";


function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [data, setData] = useState(null);
  //Ahoz hogy backend nélkül elinduljon a frontend, innentől ki kell kommentelni 
  /*useEffect(() => {
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
//idáig kell kikommentelni
  return (
    <BrowserRouter>
      <div className="app-layout">
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home serverData={data} />} />
            <Route path="/Autoberles" element={<Autoberles />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;