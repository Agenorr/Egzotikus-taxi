import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // This makes dropdowns work!
import '../Base.css'

export default function Navbar() {
    // 1. Create a "State" to track if the sidebar is open
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // 2. Function to flip the state between true/false
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
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

                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/" style={{color: "white"}}>Logout</Link>
                        </li>
                    </ul>
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
                            <li><Link className="dropdown-item" to="/Autoberles" onClick={toggleSidebar}>Tovább a bérléshez</Link></li>
                            <li><Link className="dropdown-item" to="/Berlesi-feltetelek" onClick={toggleSidebar}>Bérlési feltételek</Link></li>
                        </ul>
                    </div>

                    <Link to="/Taxiszolgalat" className="sidebar-item" onClick={toggleSidebar}>Taxi szolgálat</Link>
                    <Link to="/Galeria" className="sidebar-item" onClick={toggleSidebar}>Galéria</Link>
                    <Link to="/Rolunk" className="sidebar-item" onClick={toggleSidebar}>Rólunk</Link>
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