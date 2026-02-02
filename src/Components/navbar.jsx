import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // This makes dropdowns work!
import '../Css/Base.css';
import { AuthContext, AuthProvider } from '../Context/AuthContext';

export default function Navbar() {

    const { user, isLoggedIn, login, logout } = useContext(AuthContext);
    // 1. Create a "State" to track if the sidebar is open
    const [isExiting, setIsExiting] = useState(false); // New state
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // 2. Function to flip the state between true/false
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    const closeAccountMenu = () => {
        setIsExiting(true); // Start the "Up" animation
        setTimeout(() => {
            setIsAccountOpen(false); // Actually remove it from DOM after 300ms
            setIsExiting(false);     // Reset for next time
        }, 300); // This must match your CSS animation duration
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
            const response = await fetch('https://localhost:7065/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Login successful:", data);
                setIsExiting(true);

                // Wait for the animation to finish (300ms), then update the global Auth state
                setTimeout(() => {
                    login(data);              // Now the UI swaps while the menu is INVISIBLE
                    setIsAccountOpen(false);
                    setIsExiting(false);
                }, 300);
            } else {
                // This catches the "Results.Unauthorized()" from your C# code
                alert("Hibás email vagy jelszó!");
            }
        } catch (error) {
            console.error("Network error:", error);
            alert("A szerver nem elérhető.");
        }
    };
    const handleLogoutClick = () => {
        // 1. Start the 'Slide Up' animation
        setIsExiting(true);

        // 2. Wait 300ms for the animation to finish
        setTimeout(() => {
            // 3. Actually clear the user data from Context/LocalStorage
            logout();

            // 4. Remove the menu from the DOM and reset exit state
            setIsAccountOpen(false);
            setIsExiting(false);
        }, 300);
    };

    return (
        <div>
            {/* Main Navbar */}
            <nav className="navbar navbar-expand-lg">
                <div className="container-fluid d-flex justify-content-between align-items-center">
                    <span className="hamburger-icon text-white" style={{ cursor: 'pointer', fontSize: '24px' }} onClick={toggleSidebar}>&#9776;</span>

                    <div className="navbar-center mx-auto">
                        <span className="navbar-title h1 mb-0">Exotic</span>
                    </div>

                    <div className="nav-item dropdown">
                        <button className="btn btn-outline-light dropdown-toggle" onClick={toggleAccountMenu}>
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
                                    backgroundColor: 'transparent', // Invisible
                                    zIndex: 999 // Just below the dropdown but above everything else
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
                                        <button type="submit" className="w-100 btn btn-primary">Bejelentkezés</button>
                                        <div className="dropdown-divider"></div>
                                        <Link className="dropdown-item text-center p-0 mt-2" to="/Register" onClick={() => setIsAccountOpen(false)}>Regisztráció</Link>
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

            {/* Sidebar - Width changes based on isSidebarOpen state */}
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
                {/* A trükk: Ez a belső div fix szélességű (250px), 
        így a benne lévő szöveg sosem fog "összemenni" vagy törni. 
        Csak az opacity-t és a láthatóságot kapcsoljuk.
    */}
                <div style={{
                    minWidth: '250px',
                    opacity: isSidebarOpen ? 1 : 0,
                    visibility: isSidebarOpen ? 'visible' : 'hidden',
                    transition: isSidebarOpen ? 'opacity 0.4s ease-in' : 'opacity 0.1s ease-out'
                }}>
                    {/* Close Button */}
                    <span
                        className="text-white position-absolute top-0 end-0 m-3"
                        style={{ cursor: 'pointer', fontSize: '30px' }}
                        onClick={toggleSidebar}
                    >
                        &times;
                    </span>

                    <div className="p-3 d-flex flex-column gap-1">
                        <Link to="/" className="sidebar-item" onClick={toggleSidebar}>Kezdőlap</Link>

                        {/* Dropdown for Autoberles */}
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

                        <Link to="/Taxi" className="sidebar-item" onClick={toggleSidebar}>Taxi szolgálat</Link>
                        <Link to="/Gallery" className="sidebar-item" onClick={toggleSidebar}>Galéria</Link>
                        <Link to="/AboutUs" className="sidebar-item" onClick={toggleSidebar}>Rólunk</Link>
                    </div>
                </div>
            </div>

            {/* Overlay: Closes sidebar when clicking outside */}
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