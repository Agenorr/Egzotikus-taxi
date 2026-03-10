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
      <div className="layout">
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
        <h1 className="profile-name">{user?.username || "John Doe"}</h1>
        <p className="profile-email">{user?.email || "teszt@tester.com"}</p>
      </header>

      {/* Search Bar */}
      <div className="google-search-container">
        <div className="search-pill">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Keresés a fiókban..." />
        </div>
      </div>

      {/* Quick Action Buttons (Chips) */}
      <div className="chip-container">
        <button className="google-chip" onClick={()=> setActiveTab('personal')}>Adataim változtatása</button>
        <button className="google-chip" onClick={()=> setActiveTab('security')}>Jelszó változtatás</button>
        <button className="google-chip" onClick={()=> setActiveTab('payment')}>Fizetési mód változtatása</button>
      </div>
    </div>
  );
}

function PersonalTab({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  
  // Kezdeti állapot beállítása a user adatokból
  const [formData, setFormData] = useState({
    name: user?.fullName || user?.username || "Nincs megadva",
    phone: user?.phoneNumber || "Nincs megadva",
    license: user?.licenseNumber || "Nincs feltöltve",
  });

  const isEmailVerified = 
    user?.is_verified === 1 || 
    user?.is_verified === true || 
    user?.isVerified === 1 || 
    user?.isVerified === true;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // IDE JÖN MAJD A BACKEND API HÍVÁS (pl. axios.put('/api/user/update', formData))
    console.log("Mentendő adatok:", formData);
    setIsEditing(false);
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
            <div>
              <span className={`status-badge ${isEmailVerified ? 'verified' : 'pending'}`} style={{marginRight: '15px'}}>
                {isEmailVerified ? "✓ Hitelesített" : "● Ellenőrzés alatt"}
              </span>
              <button 
                className="google-chip" 
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                style={{borderColor: isEditing ? '#4CAF50' : '#5f6368'}}
              >
                {isEditing ? "Mentés" : "Szerkesztés"}
              </button>
            </div>
          </div>
        </div>

        <div className="info-list">
          <div className="info-row">
            <div className="info-label">TELJES NÉV</div>
            <div className="info-value">
              {isEditing ? (
                <input className="edit-input" name="name" value={formData.name} onChange={handleChange} />
              ) : (
                formData.name
              )}
            </div>
            {!isEditing && <span className="info-arrow">❯</span>}
          </div>
          
          <div className="info-row">
            <div className="info-label">TELEFONSZÁM</div>
            <div className="info-value">
              {isEditing ? (
                <input className="edit-input" name="phone" value={formData.phone} onChange={handleChange} />
              ) : (
                formData.phone
              )}
            </div>
            {!isEditing && <span className="info-arrow">❯</span>}
          </div>
          
          <div className="info-row">
            <div className="info-label">JOGOSÍTVÁNY SZÁMA</div>
            <div className="info-value">
              {isEditing ? (
                <input className="edit-input" name="license" value={formData.license} onChange={handleChange} />
              ) : (
                formData.license
              )}
            </div>
            {!isEditing && <span className="info-arrow">❯</span>}
          </div>
          
          <div className="info-row">
            <div className="info-label">EMAIL (Nem szerkeszthető)</div>
            <div className="info-value" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>{user?.email || "Nincs megadva"}</span>
              {isEmailVerified ? (
                <b style={{ color: '#4CAF50', fontSize: '18px' }}>✓</b>
              ) : (
                <b style={{ color: '#F44336', fontSize: '18px' }}>✗</b>
              )}
            </div>
            <span className="info-arrow">🔒</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function SecurityTab({user}){
  return (
    <div className="personal-info-container">
      <header className="tab-header">
        <h1>Biztonság és bejelentkezés</h1>
        <p>A fiókod védelmét szolgáló beállítások.</p>
      </header>

      <section className="info-card">
        <div className="card-header"><h2>Jelszó módosítása</h2></div>
        <div className="info-list">
          <div className="info-row">
            <div className="info-label">JELENLEGI JELSZÓ</div>
            <div className="info-value">••••••••</div>
            <button className="google-chip">Módosítás</button>
          </div>
          <div className="info-row">
            <div className="info-label">KÉTLÉPCSŐS AZONOSÍTÁS</div>
            <div className="info-value">Kikapcsolva</div>
            <button className="google-chip">Bekapcsolás</button>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatisticsTab({user}){
  // Ez egy mock adatbázis. Ide a backendről érkező bérlési listát kell majd bekötni.
  const rentals = [
    { id: 1, car: "Tesla Model 3", startDate: "2026. Márc. 01.", endDate: "2026. Márc. 03.", cost: "120 000 Ft", status: "Befejezett" },
    { id: 2, car: "BMW M4 Competition", startDate: "2026. Ápr. 15.", endDate: "2026. Ápr. 16.", cost: "85 000 Ft", status: "Közelgő" },
  ];

  return(
    <div className="personal-info-container">
      <header className="tab-header">
        <h1>Statisztikák és Bérlések</h1>
        <p>A korábbi és közelgő bérléseid áttekintése.</p>
      </header>

      {/* Általános statisztikák */}
      <div style={{display: 'flex', gap: '20px', marginBottom: '24px'}}>
        <div className="info-card" style={{flex: 1, padding: '24px', textAlign: 'center'}}>
          <h2 style={{color: '#DAA520', fontSize: '32px', margin: '0 0 10px 0'}}>2</h2>
          <p style={{color: '#9aa0a6', margin: 0}}>Összes bérlés</p>
        </div>
        <div className="info-card" style={{flex: 1, padding: '24px', textAlign: 'center'}}>
          <h2 style={{color: '#DAA520', fontSize: '32px', margin: '0 0 10px 0'}}>205 000 Ft</h2>
          <p style={{color: '#9aa0a6', margin: 0}}>Eddigi költés</p>
        </div>
      </div>

      {/* Bérlési előzmények */}
      <section className="info-card">
        <div className="card-header"><h2>Bérlési előzmények</h2></div>
        <div className="info-list">
          {rentals.map((rental) => (
            <div className="rental-item" key={rental.id}>
              <div>
                <div className="rental-car">{rental.car}</div>
                <div className="rental-details">{rental.startDate} - {rental.endDate} • {rental.cost}</div>
              </div>
              <div className={`rental-status status-${rental.status === 'Közelgő' ? 'active' : 'completed'}`}>
                {rental.status}
              </div>
            </div>
          ))}
          {rentals.length === 0 && (
            <div style={{padding: '24px', textAlign: 'center', color: '#9aa0a6'}}>
              Még nem béreltél autót.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function PaymentTab({user}){
  return(
    <div className="personal-info-container">
      <header className="tab-header">
        <h1>Fizetési módok</h1>
        <p>Kezeld a mentett bankkártyáidat a gyorsabb fizetéshez.</p>
      </header>

      <section className="info-card">
        <div className="card-header"><h2>Mentett kártyák</h2></div>
        <div className="info-list">
          <div className="info-row">
            <div className="info-label" style={{fontSize: '24px'}}>💳</div>
            <div className="info-value">
              <div style={{fontWeight: 'bold'}}>**** **** **** 4242</div>
              <div style={{fontSize: '12px', color: '#9aa0a6'}}>Lejár: 12/28</div>
            </div>
            <button className="google-chip">Törlés</button>
          </div>
        </div>
        <div style={{padding: '20px', textAlign: 'center', borderTop: '1px solid #3c4043'}}>
          <button className="google-chip" style={{color: '#DAA520', borderColor: '#DAA520'}}>+ Új kártya hozzáadása</button>
        </div>
      </section>
    </div>
  );
}
