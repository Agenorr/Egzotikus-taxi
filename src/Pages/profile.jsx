import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import '../Css/Profile.css';
import Navbar from '../Components/navbar';
import Footer from '../Components/footer';

export default function Profile() {
  const { user } = useContext(AuthContext);

  const navItems = [
    { name: "Kezdőlap", icon: "🏠", path: "/profile", active: true },
    { name: "Személyes adatok", icon: "👤", path: "/personal-info" },
    { name: "Biztonság és bejelentkezés", icon: "🔒", path: "/security" },
    { name: "Statisztikák", icon: "📊", path: "/data" },
    { name: "Fizetési módok", icon: "💳", path: "/wallet" },
  ];

  return (
    <div>
      <Navbar />
      <div className="  layout">
        {/* LEFT SIDEBAR */}
        <aside className="google-sidebar">
          <div className="sidebar-brand">Felhasználó</div>
          <nav className="sidebar-nav">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`nav-item-link ${item.active ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.name}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="google-main">
          {/* Header with Avatar */}
          <header className="profile-header">
            <div className="header-graphic-container">
              {/* Graphical icons around the avatar */}
              <div className="graphic-item left-toggle"></div>
              <div className="graphic-item left-pin"></div>
              <div className="avatar-wrapper">
                <div className="avatar-main">
                  {user?.username?.charAt(0).toUpperCase() || "F"}
                </div>
                <div className="camera-badge">📷</div>
              </div>
              <div className="graphic-item right-brush"></div>
              <div className="graphic-item right-mail"></div>
            </div>
            <h1 className="profile-name">{user?.username || "Futo A"}</h1>
            <p className="profile-email">{user?.email || "gamelife9222@gmail.com"}</p>
          </header>

          {/* Search Bar */}
          <div className="google-search-container">
            <div className="search-pill">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="Search Google Account" />
            </div>
          </div>

          {/* Quick Action Buttons (Chips) */}
          <div className="chip-container">
            {["Adataim", "Statisztikák"].map(chip => (
              <button key={chip} className="google-chip">{chip}</button>
            ))}
          </div>

        </main>
      </div>
      <Footer />
    </div>

  );
}