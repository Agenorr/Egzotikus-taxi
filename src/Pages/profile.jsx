import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import '../Css/Profile.css';
import Navbar from '../Components/navbar';
import Footer from '../Components/footer';

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('main');

  const navItems = [
    { id: "main", name: "Kezdőlap", icon: "🏠", path: "/profile", active: true },
    { id: "personal", name: "Személyes adatok", icon: "👤", path: "/personal-info" },
    { id: "security", name: "Biztonság és bejelentkezés", icon: "🔒", path: "/security" },
    { id: "stats", name: "Statisztikák", icon: "📊", path: "/data" },
    { id: "payment", name: "Fizetési módok", icon: "💳", path: "/wallet" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'main':
        return <HomeTab user={user} setActiveTab={setActiveTab} />;
      case 'personal':
        return <PersonalTab user={user} />;
      case 'security':
        return <SecurityTab user={user} />;
      case 'stats':
        return <StatisticsTab user={user}/>
      case 'payment':
        return <PaymentTab user={user}/>
      default:
        return <HomeTab user={user} setActiveTab={setActiveTab}/>;
    }
  };

  return (
    <div>
      <Navbar />
      <div className="  layout">
        {/* LEFT SIDEBAR */}
        <aside className="google-sidebar">
          <div className="sidebar-brand">Felhasználó</div>
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <div
                key={item.id}
                className={`nav-item-link ${activeTab === item.id ? 'active' : ''}`}
                onClick={()=> setActiveTab(item.id)}
                style={{cursor: 'pointer'}}
              >

              
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.name}</span>
              </div>
            ))}
          </nav>
        </aside>

        <main className="google-main">
          {renderContent()}
        </main>
      </div>
      <Footer />
    </div>

  );
}
function HomeTab({user, setActiveTab}) {
  return (
    <div>
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
        <button className="google-chip" onClick={()=> setActiveTab('personal')}>Adataim változtatása</button>
        <button className="google-chip" onClick={()=> setActiveTab('security')}>Jelszó változtatás</button>
        <button className="google-chip" onClick={()=> setActiveTab('payment')}>Fizetési mód változtatása</button>
      </div>
    </div>
  )
}
function PersonalTab({ user }) {
  // Use data from the context/backend
  const userData = {
    name: user?.fullName || user?.username || "Nincs megadva",
    email: user?.email,
    phone: user?.phoneNumber || "Nincs megadva",
    license: user?.licenseNumber || "Nincs feltöltve",
    isVerified: user?.isVerified || false
  };

  return (
    <div className="personal-info-container">
      <header className="tab-header">
        <h1>Személyes adatok</h1>
        <p>Bérléshez szükséges hitelesített adatok.</p>
      </header>

      <section className="info-card">
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Vezetői profil</h2>
            {/* Status Badge */}
            <span className={`status-badge ${userData.isVerified ? 'verified' : 'pending'}`}>
              {userData.isVerified ? "✓ Hitelesített" : "● Ellenőrzés alatt"}
            </span>
          </div>
        </div>

        <div className="info-list">
          <div className="info-row">
            <div className="info-label">TELJES NÉV</div>
            <div className="info-value">{userData.name}</div>
            <span className="info-arrow">❯</span>
          </div>
          <div className="info-row">
            <div className="info-label">JOGOSÍTVÁNY SZÁMA</div>
            <div className="info-value">{userData.license}</div>
            <span className="info-arrow">❯</span>
          </div>
        </div>
      </section>
    </div>
  );
}
function SecurityTab({user}){
  return (
    <div>

    </div>
  )
}
function StatisticsTab({user}){
  return(
    <div>

    </div>
  )
}
function PaymentTab({user}){
  return(
    <div>

    </div>
  )
}