import { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // This makes dropdowns work!
import '../Css/Base.css';

export default function Navbar() {
    // 1. Create a "State" to track if the sidebar is open
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // 2. Function to flip the state between true/false
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
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
            console.log("Success:", data);

            // 1. Update the UI state
            setIsLoggedIn(true);
            
            // 2. Close the dropdown after a brief moment or immediately
            setIsAccountOpen(false);

            // 3. Optional: Save user info to LocalStorage so they stay logged in
            localStorage.setItem('user', JSON.stringify(data));
            
            alert(`Welcome back, ${data.username}!`);
        } else {
            // This catches the "Results.Unauthorized()" from your C# code
            alert("Hibás email vagy jelszó!"); 
        }
    } catch (error) {
        console.error("Network error:", error);
        alert("A szerver nem elérhető.");
    }
};

    return (
        <div>
            {/* Main Navbar */}
            <nav className="navbar navbar-expand-lg">
                <div className="container-fluid d-flex justify-content-between align-items-center">
                    {/* Hamburger Icon calls our toggle function */}
                    <span className="hamburger-icon text-white" style={{ cursor: 'pointer', fontSize: '24px' }} onClick={toggleSidebar}>
                        &#9776;
                    </span>

                    <div className="navbar-center mx-auto">
                        <span className="navbar-title h1 mb-0">Exotic</span>
                    </div>

                    <div className="nav-item dropdown">
                        <button
                            className="btn btn-outline-light dropdown-toggle"
                            onClick={() => setIsAccountOpen(!isAccountOpen)}
                        >
                            {isLoggedIn ? "Profil" : "Bejelentkezés"}
                        </button>

                        {/* Conditional Dropdown Content */}
                        {isAccountOpen && (
                            <div className="dropdown-menu show dropdown-menu-end p-4" style={{ width: '280px', right: 0, left: 'auto' }}>
                                {!isLoggedIn ? (
                                    <form onSubmit={handleLogin}>
                                        <div className="mb-3">
                                            <label className="form-label">Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                placeholder="email@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Jelszó</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="w-100">Bejelentkezés</button>
                                        <div className="dropdown-divider"></div>
                                        <Link className="dropdown-item text-center p-0 mt-2" to="/Register" onClick={() => setIsAccountOpen(false)}>
                                            Nincsen még fiókod? Regisztrálj!
                                        </Link>
                                    </form>
                                ) : (
                                    <div>
                                        <p className="text-center">Üdvözlünk!</p>
                                        <button className="btn btn-danger w-100" onClick={() => setIsLoggedIn(false)}>Logout</button>
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
                    transition: '0.3s',
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
                            id="rentalDropdown" data-bs-toggle="dropdown" aria-expanded="false">Autóbérlés
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