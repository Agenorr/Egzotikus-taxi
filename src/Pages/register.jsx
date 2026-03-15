import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Components/navbar';
import Footer from '../Components/footer';

import '../Css/Register.css';

export default function register() {
    const navigate = useNavigate();

    // Form State
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: ''
    });

    // UI State
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Handle input changes dynamically
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        // 1. Frontend Validation
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
            // 2. Send data to your C# Minimal API
            const response = await axios.post('https://localhost:7065/api/register', {
                username: formData.username,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                password: formData.password
            });

            // 3. Handle Success
            setSuccessMessage('Sikeres regisztráció! Átirányítás...');

            // Wait 2 seconds so they can read the success message, then send to Home
            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (err) {
            // 4. Handle Errors from the Backend
            if (err.response && err.response.status === 400) {
                // This catches your "User with this email already exists." error
                setError(err.response.data || 'Ez az email cím már foglalt!');
            } else {
                setError('A szerver nem elérhető. Kérjük, próbálja újra később.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: "#f8f9fa" }}>
            <Navbar />
            <div className="register-wrapper">

                <div className="gold-particles">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <span key={i}></span>
                    ))}

                </div><div className="container flex-grow-1 d-flex justify-content-center align-items-center mt-5 mb-5">
                    <div className="card shadow-lg" style={{ width: '100%', maxWidth: '500px', backgroundColor: '#1a1a1a', border: '1px solid #DAA520', borderRadius: '12px' }}>
                        <div className="card-body p-5 text-white">

                            <h2 className="text-center mb-4" style={{ color: '#DAA520', fontFamily: "'Monsieur La Doulaise', cursive", fontSize: '3rem' }}>
                                Regisztráció
                            </h2>

                            {error && <div className="alert alert-danger text-center">{error}</div>}
                            {successMessage && <div className="alert alert-success text-center bg-transparent border-success text-success">{successMessage}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Felhasználónév</label>
                                    <input
                                        type="text"
                                        className="form-control bg-dark text-white border-secondary exotic-input"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control bg-dark text-white border-secondary exotic-input"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Telefonszám</label>
                                    <input
                                        type="tel"
                                        className="form-control bg-dark text-white border-secondary exotic-input"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Jelszó</label>
                                    <input
                                        type="password"
                                        className="form-control bg-dark text-white border-secondary exotic-input"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">Jelszó Megerősítése</label>
                                    <input
                                        type="password"
                                        className="form-control bg-dark text-white border-secondary exotic-input"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn w-100 mb-3"
                                    disabled={isLoading}
                                    style={{ backgroundColor: '#DAA520', color: 'black', fontWeight: 'bold' }}
                                >
                                    {isLoading ? 'Feldolgozás...' : 'Regisztráció'}
                                </button>

                                <div className="text-center">
                                    <span className="">Van már fiókod? </span>
                                    <Link to="/" className="text-decoration-none" style={{ color: '#DAA520' }}>
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