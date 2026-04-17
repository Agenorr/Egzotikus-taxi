import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from "../Components/navbar";
import Footer from "../Components/footer";
import '../Css/verifyEmail.css'; // Új CSS fájl

const VerifyEmail = () => {
    useEffect(() => {
            document.title = "Exotic | Email Megerősítés";
        }, []);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    
    const [status, setStatus] = useState('loading'); // loading, success, error

    useEffect(() => {
        const confirmEmail = async () => {
            try {
                // Backend hívás
                await axios.post(`https://localhost:7065/api/auth/confirm?token=${token}`);
                
                setStatus('success');

                // 3 másodperc múlva bedobjuk a főoldalra
                setTimeout(() => {
                    navigate('/Profile');
                }, 5000);
                
            } catch (error) {
                console.error("Hiba:", error);
                setStatus('error');
            }
        };

        if (token) {
            confirmEmail();
        } else {
            setStatus('error');
        }
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
                            <p className="text-muted">Kérjük várjon, amíg megerősítjük a fiókját.</p>
                        </>
                    )}

                    {status === 'success' && (
                        <div className="fade-in">
                            <div className="success-icon mb-4">✔</div>
                            <h2 className="text-gold fw-bold">Sikeres megerősítés!</h2>
                            <p className="text-white">Fiókja mostantól aktív. Hamarosan átirányítjuk...</p>
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

export default VerifyEmail;