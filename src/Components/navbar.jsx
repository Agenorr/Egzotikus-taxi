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
                alert("Hibás email vagy felszó!")
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
                <div className="container-fluid d-flex justify-content-between align-items-center">
                    <span className="hamburger-icon text-white" style={{ cursor: 'pointer', fontSize: '24px' }} onClick={toggleSidebar}>&#9776;</span>

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
                                            <label className="form-label">Email</label>
                                            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Jelszó</label>
                                            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                        </div>
                                        <button type="submit" className="w-100 btn">Bejelentkezés</button>
                                        <div className="dropdown-divider"></div>
                                        <Link className="dropdown-item text-center p-0 mt-2 profile-btn" to="/Register" onClick={() => setIsAccountOpen(false)}>Nincsen fiókod? Regisztrálj!</Link>
                                    </form>
                                ) : (
                                    <div>
                                        <div className="loginDrowpdownHeader">
                                            <p className="text-center">Üdv, {(user?.username)?.toUpperCase()}!</p>
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
                className="sidebar shadow"
                style={{
                    width: isSidebarOpen ? '250px' : '0',
                    transition: '0.3s ease-in-out',
                    position: 'fixed',
                    zIndex: 1050,
                    top: 0,
                    left: 0,
                    height: '100%',
                    backgroundColor: '#333',
                    overflowX: 'hidden',
                    paddingTop: '60px',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <div style={{
                    minWidth: '250px',
                    opacity: isSidebarOpen ? 1 : 0,
                    visibility: isSidebarOpen ? 'visible' : 'hidden',
                    transition: isSidebarOpen ? 'opacity 0.4s ease-in' : 'opacity 0.1s ease-out'
                }}>
                    
                    <img
                        src="/Assets/Exotic_logo.webp"
                        alt="Exotic Logo"
                        className="position-absolute start-0 ms-3"
                        style={{ width: '75px', opacity: '0.9', top: '6px' }}
                    />

                    <span
                        className="text-white position-absolute top-0 end-0 m-3"
                        style={{ cursor: 'pointer', fontSize: '30px' }}
                        onClick={toggleSidebar}
                    >
                        &times;
                    </span>

                    <div className="p-3 d-flex flex-column gap-1">
                        <Link to="/" className="sidebar-item" onClick={toggleSidebar}>Kezdőlap</Link>

                        <div className="dropdown">
                            <button
                                className="sidebar-item" type="button"
                                id="rentalDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                Autóbérlés
                            </button>
                            <ul className="dropdown-menu shadow" aria-labelledby="rentalDropdown">
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
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 1040
                    }}
                />
            )}
        </div>
    );
}
