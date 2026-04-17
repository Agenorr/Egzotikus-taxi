import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Components/navbar';
import Footer from '../Components/footer';

// Használjuk ugyanazt a CSS-t, amit a Register oldalhoz is, hogy egységes legyen a dizájn
import '../Css/Register.css'; 

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    // Állapotok a UI visszajelzésekhez
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        document.title = "Exotic | Új Jelszó";
        // Ha valaki csak úgy betölti az oldalt token nélkül:
        if (!token) {
            setError("Hibás vagy hiányzó visszaállítási kulcs (token). Kérjük, használd az e-mailben kapott linket!");
        }
    }, [token]);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        // Frontend validáció
        if (newPassword !== confirmPassword) {
            setError("A jelszavak nem egyeznek!");
            return;
        }

        if (newPassword.length < 6) {
            setError("A jelszónak legalább 6 karakternek kell lennie!");
            return;
        }

        setIsLoading(true);

        try {
            const res = await axios.post("https://localhost:7065/api/auth/reset-password", {
                token: token,
                newPassword: newPassword
            });
            
            setSuccessMessage(res.data.message || "A jelszavad sikeresen megváltozott! Átirányítás...");
            
            // Késleltetett átirányítás a bejelentkezéshez (Kezdőlap)
            setTimeout(() => {
                navigate("/"); 
            }, 3000);

        } catch (err) {
            setError(err.response?.data?.message || "Hiba történt. Lehet, hogy a linked már lejárt!");
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

                            <h2 className="text-center mb-4" style={{ color: '#DAA520', fontFamily: "'Monsieur La Doulaise', cursive", fontSize: '3rem' }}>
                                Új Jelszó
                            </h2>

                            {error && <div className="alert alert-danger text-center">{error}</div>}
                            {successMessage && <div className="alert alert-success text-center bg-transparent border-success text-success">{successMessage}</div>}

                            <form onSubmit={handleResetPassword}>
                                <div className="mb-3">
                                    <label className="form-label text-white">Új Jelszó</label>
                                    <input
                                        type="password"
                                        className="form-control exotic-input"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        disabled={!token || isLoading}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label text-white">Új Jelszó Megerősítése</label>
                                    <input
                                        type="password"
                                        className="form-control exotic-input"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        disabled={!token || isLoading}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="exotic-submit-btn w-100"
                                    disabled={!token || isLoading}
                                >
                                    {isLoading ? 'Feldolgozás...' : 'Jelszó mentése'}
                                </button>
                            </form>

                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}