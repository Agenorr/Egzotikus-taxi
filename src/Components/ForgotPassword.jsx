import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Components/navbar';
import Footer from '../Components/footer';

import '../Css/Register.css';

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        document.title = "Exotic | Elfelejtett Jelszó";
    }, []);

    const handleSendResetEmail = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!email) {
            setError("Kérjük, add meg az e-mail címedet!");
            return;
        }

        setIsLoading(true);

        try {
            const res = await axios.post("https://localhost:7065/api/auth/forgot-password", { 
                email: email 
            });
            
            setMessage(res.data.message || "Az e-mailt elküldtük!");
            setEmail("");

        } catch (err) {
            setError(err.response?.data?.message || "Hiba történt a kérés feldolgozása során. Kérjük, próbáld újra később.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: "#1a1a1a", color: "#fff" }}>
            <Navbar />
            <div className="register-wrapper flex-grow-1">

                <div className="gold-particles">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <span key={i}></span>
                    ))}
                </div>
                
                <div className="container d-flex justify-content-center align-items-center mt-5 mb-5" style={{ zIndex: 1 }}>
                    <div className="card register-card shadow-lg" style={{ width: '100%', maxWidth: '500px', backgroundColor: '#252525', border: '1px solid #333', borderRadius: '12px' }}>
                        <div className="card-body p-5 text-white" style={{ border: 'none' }}>

                            <div className="text-center mb-0">
                                <img 
                                    src="/Assets/Exotic_logo.webp" 
                                    alt="Exotic Logo" 
                                    style={{ width: '140px', opacity: '0.9', top: '-20px', position: 'relative' }} 
                                />
                            </div>

                            <h2 className="text-center mb-3" style={{ color: '#DAA520', fontFamily: "'Monsieur La Doulaise', cursive", fontSize: '3rem' }}>
                                Jelszó Visszaállítás
                            </h2>
                            
                            <p className="text-center text-muted mb-4" style={{ fontSize: '0.95rem' }}>
                                Add meg a fiókodhoz tartozó e-mail címet, és küldünk egy linket az új jelszó beállításához.
                            </p>

                            {error && <div className="alert alert-danger text-center py-2">{error}</div>}
                            {message && <div className="alert alert-success text-center bg-transparent border-success text-success py-2">{message}</div>}

                            <form onSubmit={handleSendResetEmail}>
                                <div className="mb-4">
                                    <label className="form-label text-white">E-mail cím</label>
                                    <input
                                        type="email"
                                        className="form-control exotic-input"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="pelda@email.com"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="exotic-submit-btn w-100 mb-4"
                                    disabled={isLoading || !email}
                                >
                                    {isLoading ? 'Küldés folyamatban...' : 'Visszaállító link küldése'}
                                </button>

                                <div className="text-center mt-2">
                                    <Link to="/" className="text-decoration-none" style={{ color: '#DAA520', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                        &larr; Vissza a Kezdőlapra / Bejelentkezéshez
                                    </Link>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}