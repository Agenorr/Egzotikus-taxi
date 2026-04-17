import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Components/navbar';
import Footer from '../Components/footer';

const verifyOrder = () => {
    useEffect(() => {
        document.title = "Exotic | Rendelés Megerősítés";
    }, []);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('Rendelés megerősítése folyamatban...');

    useEffect(() => {
        document.title = "Exotic | Rendelés Megerősítése";
    }, []);

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Érvénytelen link. Nincs megadva token.');
            return;
        }

        axios.post(`https://localhost:7065/api/orders/verify?token=${token}`)
            .then(response => {
                setStatus('success');
                setMessage('A bérlést sikeresen megerősítette! A rendelés most már aktív.');

                setTimeout(() => navigate('/'), 5000);
            })
            .catch(error => {
                console.error('Verification error:', error);
                setStatus('error');
                setMessage('Hiba történt a megerősítés során. Lehet, hogy a link már lejárt.');
            });
    }, [token, navigate]);

    return (
        <div className="d-flex flex-column min-vh-100 verify-page">
            <Navbar />

            <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                <div className="verify-card text-center shadow-lg">
                    {status === 'loading' && (
                        <>
                            <div className="spinner-gold mb-4"></div>
                            <h2 className="text-white fw-bold">Ellenőrzés folyamatban...</h2>
                            <p className="text-muted">Kérjük várjon, amíg megerősítjük a rendelését.</p>
                        </>
                    )}

                    {status === 'success' && (
                        <div className="fade-in">
                            <div className="success-icon mb-4">✔</div>
                            <h2 className="text-gold fw-bold">Sikeres megerősítés!</h2>
                            <p className="text-white">Rendelését a profiljában megtekintheti.<br/> Hamarosan átirányítjuk...</p>
                            <button className="btn btn-gold-outline mt-3" onClick={() => window.location.href = "/"}>
                                Tovább a főoldalra
                            </button>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="fade-in">
                            <div className="error-icon mb-4">✖</div>
                            <h2 className="text-danger fw-bold">Hiba történt</h2>
                            <p className="text-white">A link érvénytelen vagy már lejárt.</p>
                            <button className="btn btn-gold-outline mt-3" onClick={() => navigate('/')}>
                                Vissza a főoldalra
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
