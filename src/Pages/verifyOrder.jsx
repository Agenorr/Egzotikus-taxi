import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Components/navbar';
import Footer from '../Components/footer';

const verifyOrder = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    
    const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
    const [message, setMessage] = useState('Rendelés megerősítése folyamatban...');

    // Fül szövegének beállítása
    useEffect(() => {
        document.title = "Exotic | Rendelés Megerősítése";
    }, []);

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Érvénytelen link. Nincs megadva token.');
            return;
        }

        // Send the token to the backend
        axios.post(`https://localhost:7065/api/orders/verify?token=${token}`)
            .then(response => {
                setStatus('success');
                setMessage('A bérlést sikeresen megerősítette! A rendelés most már aktív.');
                
                // Optional: Auto-redirect to Profile after 3 seconds
                setTimeout(() => navigate('/Profile'), 3000);
            })
            .catch(error => {
                console.error('Verification error:', error);
                setStatus('error');
                setMessage('Hiba történt a megerősítés során. Lehet, hogy a link már lejárt.');
            });
    }, [token, navigate]);

    return (
        <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
            <Navbar />
            <div className="container mt-5 d-flex justify-content-center">
                <div className="card shadow border-0 text-center p-5" style={{ maxWidth: "600px" }}>
                    {status === 'loading' && (
                        <div>
                            <div className="spinner-border text-primary mb-3" role="status"></div>
                            <h4>{message}</h4>
                        </div>
                    )}
                    
                    {status === 'success' && (
                        <div>
                            <h1 className="text-success mb-3"><i className="fa fa-check-circle"></i></h1>
                            <h3 className="text-success mb-3">Sikeres Megerősítés!</h3>
                            <p className="lead">{message}</p>
                            <p className="text-muted small">Átirányítás a profiljára...</p>
                            <button className="btn btn-primary mt-3" onClick={() => navigate('/Profile')}>
                                Tovább a Profilomra
                            </button>
                        </div>
                    )}

                    {status === 'error' && (
                        <div>
                            <h1 className="text-danger mb-3"><i className="fa fa-times-circle"></i></h1>
                            <h3 className="text-danger mb-3">Sikertelen Megerősítés</h3>
                            <p className="lead">{message}</p>
                            <button className="btn btn-outline-secondary mt-3" onClick={() => navigate('/')}>
                                Vissza a Főoldalra
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default verifyOrder;