import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../Css/Base.css';
import { AuthContext, AuthProvider } from '../Context/AuthContext';
import axios from 'axios';

export default function Navbar() {

    const { user, isLoggedIn, login, logout } = useContext(AuthContext);
    const [isExiting, setIsExiting] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    
    const closeAccountMenu = () => {
        setIsExiting(true);
        setTimeout(() => {
            setIsAccountOpen(false);
            setIsExiting(false);
        }, 300);
    };
    
    const toggleAccountMenu = () => {
        if (isAccountOpen) {
            closeAccountMenu();
        } else {
            setIsAccountOpen(true);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://localhost:7065/api/login', { email: email, password: password });

            const data = response.data;
            console.log("Login successful:", data);
            setIsExiting(true);

            setTimeout(() => {
                login(data);
                setIsAccountOpen(false);
                setIsExiting(false);
            }, 300);

        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert("Hibás email vagy jelszó!")
            } else {
                console.error("Network error:", error);
                alert("A szerver nem elérhető.");
            }
        }
    };
    
    const handleLogoutClick = () => {
        setIsExiting(true);
        setTimeout(() => {
            logout();
            setIsAccountOpen(false);
            setIsExiting(false);
        }, 300);
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg">
                <div className="container-fluid d-flex justify-content-between align-items-center px-3">
                    <span className="hamburger-icon" onClick={toggleSidebar}>&#9776;</span>

                    <div className="navbar-center mx-auto">
                        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <span className="navbar-title h1 mb-0">Exotic</span>
                        </Link>
                    </div>

                    <div className="nav-item dropdown">
                        <button className="btn dropdown-toggle" onClick={toggleAccountMenu}>
                            {isLoggedIn ? "Profil" : "Bejelentkezés"}
                        </button>
                        
                        {isAccountOpen && (
                            <div
                                onClick={closeAccountMenu}
                                style={{
                                    position: 'fixed',
                                    top: 0,
                                    left: 0,
                                    width: '100vw',
                                    height: '100vh',
                                    backgroundColor: 'transparent',
                                    zIndex: 999 
                                }}
                            />
                        )}

                        {isAccountOpen && (
                            <div className={`dropdown-menu show dropdown-menu-end p-4 ${isExiting ? 'dropdown-animate-out' : 'dropdown-animate-in'}`} style={{ width: '280px', right: 0 }}>
                                {!isLoggedIn ? (
                                    <form onSubmit={handleLogin}>
                                        <div className="mb-3">
                                            <label className="form-label text-white">Email</label>
                                            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label text-white">Jelszó</label>
                                            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                        </div>
                                        <button type="submit" className="w-100 btn btn-gold">Bejelentkezés</button>
                                        
                                        <div className="dropdown-divider my-3" style={{ borderColor: '#333' }}></div>
                                        
                                        <Link className="dropdown-item text-center p-0 mt-2 profile-btn" to="/Register" onClick={() => setIsAccountOpen(false)}>
                                            Nincsen fiókod? Regisztrálj!
                                        </Link>
                                        
                                        {/* ITT VAN AZ ÚJ GOMB */}
                                        <Link className="dropdown-item text-center p-0 mt-3" style={{ fontSize: '0.85rem', color: '#aaaaaa' }} to="/ForgotPassword" onClick={() => setIsAccountOpen(false)}>
                                            Elfelejtett jelszó?
                                        </Link>

                                    </form>
                                ) : (
                                    <div>
                                        <div className="loginDrowpdownHeader">
                                            <p className="text-center m-0">Üdv, {(user?.username)?.toUpperCase()}!</p>
                                        </div>
                                        <Link to="/Profile" className="btn w-100 login-btn" onClick={() => setIsAccountOpen(false)}>Profilom</Link>
                                        <button className="btn w-100 logout-btn" onClick={handleLogoutClick}>Kijelentkezés</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <div
                className="sidebar"
                style={{
                    width: isSidebarOpen ? '280px' : '0',
                    transition: '0.4s cubic-bezier(0.25, 0.8, 0.25, 1)'
                }}
            >
                <div style={{
                    minWidth: '280px',
                    opacity: isSidebarOpen ? 1 : 0,
                    visibility: isSidebarOpen ? 'visible' : 'hidden',
                    transition: isSidebarOpen ? 'opacity 0.4s ease-in' : 'opacity 0.1s ease-out'
                }}>
                    
                    {/* Kevesebb térköz (pt-2) felül */}
                    <div className="d-flex justify-content-between align-items-center px-4 pt-2">
                        <img
                            src="/Assets/Exotic_logo.webp"
                            alt="Exotic Logo"
                            style={{ width: '75px', opacity: '0.9' }}
                        />
                        <span
                            className="text-white sidebar-close-icon"
                            style={{ cursor: 'pointer', fontSize: '32px', lineHeight: '1' }}
                            onClick={toggleSidebar}
                        >
                            &times;
                        </span>
                    </div>

                    <div className="px-4 pb-4 d-flex flex-column gap-1" style={{ marginTop: '15px' }}>
                        <Link to="/" className="sidebar-item" onClick={toggleSidebar}>Kezdőlap</Link>

                        <div className="dropdown w-100">
                            <button
                                className="sidebar-item w-100" type="button"
                                id="rentalDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                Autóbérlés
                            </button>
                            <ul className="dropdown-menu shadow w-100" aria-labelledby="rentalDropdown">
                                <li><Link className="dropdown-item" to="/CarRental" onClick={toggleSidebar}>Tovább a bérléshez</Link></li>
                                <li><Link className="dropdown-item" to="/RentingInfo" onClick={toggleSidebar}>Bérlési feltételek</Link></li>
                            </ul>
                        </div>

                        <Link to="/Taxi" className="sidebar-item" onClick={toggleSidebar}>Taxi Rendelés</Link>
                        <Link to="/Gallery" className="sidebar-item" onClick={toggleSidebar}>Galéria</Link>
                        <Link to="/AboutUs" className="sidebar-item" onClick={toggleSidebar}>Rólunk</Link>
                    </div>
                </div>
            </div>

            {isSidebarOpen && (
                <div
                    onClick={toggleSidebar}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(2px)',
                        zIndex: 1040
                    }}
                />
            )}
        </div>
    );
}