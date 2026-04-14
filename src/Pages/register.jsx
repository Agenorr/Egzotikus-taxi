import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Components/navbar';
import Footer from '../Components/footer';

import '../Css/Register.css';

export default function register() {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Exotic | Regisztráció";
    }, []);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (formData.password !== formData.confirmPassword) {
            setError('A jelszavak nem egyeznek! (Passwords do not match)');
            return;
        }

        if (formData.password.length < 6) {
            setError('A jelszónak legalább 6 karakternek kell lennie!');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post('https://localhost:7065/api/register', {
                username: formData.username,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                password: formData.password
            });

            setSuccessMessage('Sikeres regisztráció! Átirányítás...');

            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (err) {
            if (err.response && err.response.status === 400) {
                setError(err.response.data || 'Ez az email cím már foglalt!');
            } else {
                setError('A szerver nem elérhető. Kérjük, próbálja újra később.');
            }
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
                                Regisztráció
                            </h2>

                            {error && <div className="alert alert-danger text-center">{error}</div>}
                            {successMessage && <div className="alert alert-success text-center bg-transparent border-success text-success">{successMessage}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label text-white">Felhasználónév</label>
                                    <input
                                        type="text"
                                        className="form-control exotic-input"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label text-white">Email</label>
                                    <input
                                        type="email"
                                        className="form-control exotic-input"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label text-white">Telefonszám</label>
                                    <input
                                        type="tel"
                                        className="form-control exotic-input"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label text-white">Jelszó</label>
                                    <input
                                        type="password"
                                        className="form-control exotic-input"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label text-white">Jelszó Megerősítése</label>
                                    <input
                                        type="password"
                                        className="form-control exotic-input"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="exotic-submit-btn mb-3"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Feldolgozás...' : 'Regisztráció'}
                                </button>

                                <div className="text-center">
                                    <span style={{ color: '#bbb' }}>Van már fiókod? </span>
                                    <Link to="/" className="text-decoration-none" style={{ color: '#DAA520', fontWeight: 'bold' }}>
                                        Jelentkezz be!
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
