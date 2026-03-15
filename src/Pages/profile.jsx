import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
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

// --- HOME TAB ---
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

      <div className="google-search-container">
        <div className="search-pill">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Keresés a fiókban..." />
        </div>
      </div>

      <div className="chip-container">
        <button className="google-chip" onClick={()=> setActiveTab('personal')}>Adataim változtatása</button>
        <button className="google-chip" onClick={()=> setActiveTab('security')}>Jelszó változtatás</button>
        <button className="google-chip" onClick={()=> setActiveTab('payment')}>Fizetési mód változtatása</button>
      </div>
    </div>
  );
}

// --- PERSONAL TAB ---
function PersonalTab({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: "Betöltés...",
    phone: "Betöltés...",
    license: "Betöltés...",
  });

  const isEmailVerified = user?.is_verified === 1 || user?.is_verified === true;

  useEffect(() => {
    if (user && user.id) {
      axios.get(`https://localhost:7065/api/user/${user.id}/profile`)
        .then(res => {
          setFormData({
            name: res.data.fullName || "Nincs megadva",
            phone: res.data.phoneNumber || "Nincs megadva",
            license: res.data.licenseNumber || "Nincs feltöltve",
          });
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Hiba a profil adatok lekérésekor:", err);
          setIsLoading(false);
        });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
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
            <button 
              className="google-chip" 
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              disabled={isLoading}
            >
              {isEditing ? "Mentés" : "Szerkesztés"}
            </button>
          </div>
        </div>

        <div className="info-list">
          <div className="info-row">
            <div className="info-label">TELJES NÉV</div>
            <div className="info-value">{isEditing ? <input className="edit-input" name="name" value={formData.name} onChange={handleChange} /> : formData.name}</div>
          </div>
          <div className="info-row">
            <div className="info-label">TELEFONSZÁM</div>
            <div className="info-value">{isEditing ? <input className="edit-input" name="phone" value={formData.phone} onChange={handleChange} /> : formData.phone}</div>
          </div>
          <div className="info-row">
            <div className="info-label">JOGOSÍTVÁNY SZÁMA</div>
            <div className="info-value">{isEditing ? <input className="edit-input" name="license" value={formData.license} onChange={handleChange} /> : formData.license}</div>
          </div>
          <div className="info-row">
            <div className="info-label">EMAIL</div>
            <div className="info-value">
              {user?.email} {isEmailVerified ? <b style={{ color: '#4CAF50' }}>✓</b> : <b style={{ color: '#F44336' }}>✗</b>}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// --- SECURITY TAB ---
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
        </div>
      </section>
    </div>
  );
}

// --- STATISTICS TAB (THE ONE WITH THE FINISH LOGIC) ---
function StatisticsTab({ user }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && user.id) {
      axios.get(`https://localhost:7065/api/user/${user.id}/orders`)
        .then(res => {
          setOrders(res.data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Hiba a bérlések lekérésekor:", err);
          setIsLoading(false);
        });
    }
  }, [user]);

  const handleFinishOrder = async (orderId) => {
    if (!window.confirm("Biztosan lezárja ezt a bérlést? (Az autó újra elérhető lesz)")) return;

    try {
        await axios.post(`https://localhost:7065/api/orders/${orderId}/finish`);
        alert("Bérlés befejezve!");
        // Update local state so UI reflects completion immediately
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 3 } : o));
    } catch (error) {
        console.error("Hiba a lezárás során:", error);
        alert("Hiba történt a lezárás során.");
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 1: return { text: "Várakozás megerősítésre", class: "status-pending" };
      case 2: return { text: "Aktív", class: "status-active" };
      case 3: return { text: "Befejezett", class: "status-completed" };
      default: return { text: "Ismeretlen", class: "status-unknown" };
    }
  };

  const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);

  if (isLoading) return <div className="p-5 text-center text-white">Adatok betöltése...</div>;

  return (
    <div className="personal-info-container">
      <header className="tab-header">
        <h1>Statisztikák és Bérlések</h1>
        <p>A korábbi és közelgő bérléseid áttekintése.</p>
      </header>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
        <div className="info-card" style={{ flex: 1, padding: '24px', textAlign: 'center' }}>
          <h2 style={{ color: '#DAA520', fontSize: '32px', margin: '0 0 10px 0' }}>{orders.length}</h2>
          <p style={{ color: '#9aa0a6', margin: 0 }}>Összes bérlés</p>
        </div>
        <div className="info-card" style={{ flex: 1, padding: '24px', textAlign: 'center' }}>
          <h2 style={{ color: '#DAA520', fontSize: '32px', margin: '0 0 10px 0' }}>{totalSpent.toLocaleString('hu-HU')} Ft</h2>
          <p style={{ color: '#9aa0a6', margin: 0 }}>Eddigi költés</p>
        </div>
      </div>

      <section className="info-card">
        <div className="card-header"><h2>Bérlési előzmények</h2></div>
        <div className="info-list">
          {orders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            return (
              <div className="rental-item" key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  {order.imageUrl && <img src={order.imageUrl} alt="car" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />}
                  <div>
                    <div className="rental-car">{order.brand} {order.model}</div>
                    <div className="rental-details">
                      {new Date(order.startDate).toLocaleDateString('hu-HU')} - {new Date(order.endDate).toLocaleDateString('hu-HU')} • {order.totalPrice.toLocaleString('hu-HU')} Ft
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className={`rental-status ${statusInfo.class}`}>{statusInfo.text}</div>
                  
                  {/* FINISH BUTTON: Only visible for Active (Status 2) orders */}
                  {order.status === 2 && (
                    <button 
                      className="google-chip" 
                      onClick={() => handleFinishOrder(order.id)}
                      style={{ color: 'red', borderColor: 'red', fontSize: '12px' }}
                    >
                      Lemondás
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {orders.length === 0 && <div style={{ padding: '24px', textAlign: 'center', color: '#9aa0a6' }}>Még nem béreltél autót.</div>}
        </div>
      </section>
    </div>
  );
}

// --- PAYMENT TAB ---
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
      </section>
    </div>
  );
}