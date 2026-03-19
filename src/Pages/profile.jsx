import React, { useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';
import '../Css/Profile.css';
import Navbar from '../Components/navbar';
import Footer from '../Components/footer';

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('main');
  
  // State to track which specific field to scroll to after switching tabs
  const [scrollTarget, setScrollTarget] = useState(null);

  useEffect(() => {
    document.title = "Exotic | Profil";
  }, []);

  const navItems = [
    { id: "main", name: "Kezdőlap", icon: "🏠" },
    { id: "personal", name: "Személyes adatok", icon: "👤" },
    { id: "security", name: "Biztonság", icon: "🔒" },
    { id: "stats", name: "Statisztikák", icon: "📊" },
  ];

  // Helper to change tab and set a scroll target simultaneously
  const navigateAndScroll = (tab, targetId) => {
    setActiveTab(tab);
    setScrollTarget(targetId);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'main':
        return <HomeTab user={user} navigateAndScroll={navigateAndScroll} setActiveTab={setActiveTab} />;
      case 'personal':
        return <PersonalTab user={user} scrollTarget={scrollTarget} setScrollTarget={setScrollTarget} />;
      case 'security':
        return <SecurityTab user={user} scrollTarget={scrollTarget} setScrollTarget={setScrollTarget} />;
      case 'stats':
        return <StatisticsTab user={user} scrollTarget={scrollTarget} setScrollTarget={setScrollTarget} />;
      default:
        return <HomeTab user={user} navigateAndScroll={navigateAndScroll} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Navbar />
      <div className="layout">
        <aside className="google-sidebar">
          <div className="sidebar-brand">Fiókkezelés</div>
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <div
                key={item.id}
                className={`nav-item-link ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => {
                    setActiveTab(item.id);
                    setScrollTarget(null); // Reset scroll on manual nav
                }}
                style={{ cursor: 'pointer' }}
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

// --- HOME TAB (With Search Palette & Avatar Upload) ---
function HomeTab({ user, navigateAndScroll, setActiveTab }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  
  // Avatar states
  const fileInputRef = useRef(null);
  const [profileImg, setProfileImg] = useState(null);

  const searchDatabase = [
    { label: "Teljes név", tab: "personal", targetId: "field-name", keywords: ["név", "adat"] },
    { label: "Telefonszám", tab: "personal", targetId: "field-phone", keywords: ["szám", "mobil"] },
    { label: "Jogosítvány száma", tab: "personal", targetId: "field-license", keywords: ["jogsi", "engedély"] },
    { label: "Email cím", tab: "personal", targetId: "field-email", keywords: ["mail", "verifikáció"] },
    { label: "Jelszó módosítása", tab: "security", targetId: "field-password", keywords: ["belépés", "védelem"] },
    { label: "Bérlési előzmények", tab: "stats", targetId: "field-history", keywords: ["autó", "pénz", "költség"] },
  ];

  // 1. Fetch the user's profile picture when the component mounts
  useEffect(() => {
    if (user?.id) {
      axios.get(`https://localhost:7065/api/user/${user.id}/profile`)
        .then(res => {
          if (res.data.profilePictureBase64) {
            setProfileImg(`data:image/jpeg;base64,${res.data.profilePictureBase64}`);
          }
        })
        .catch(err => console.error("Hiba a profilkép betöltésekor:", err));
    }
  }, [user]);

  // 2. Trigger the hidden file input
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  // 3. Handle the file upload process
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("A kép mérete nem haladhatja meg a 2MB-ot!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`https://localhost:7065/api/users/${user.id}/upload-pfp`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      // Optimistic Update: Show the image immediately
      const reader = new FileReader();
      reader.onloadend = () => setProfileImg(reader.result);
      reader.readAsDataURL(file);
      
    } catch (err) {
      console.error(err);
      alert("Hiba történt a kép feltöltésekor.");
    }
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }
    const filtered = searchDatabase.filter(item =>
      item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.keywords.some(k => k.includes(searchTerm.toLowerCase()))
    );
    setResults(filtered);
  }, [searchTerm]);

  return (
    <div>
      <header className="profile-header text-center">
        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept="image/*" 
          onChange={handleFileChange} 
        />

        {/* Clickable Avatar Wrapper */}
        <div 
          className="avatar-wrapper mx-auto" 
          onClick={handleAvatarClick} 
          style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden', borderRadius: '50%', width: '120px', height: '120px' }}
        >
          {profileImg ? (
            <img src={profileImg} alt="Profil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div className="avatar-main" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
          {/* Hover overlay hint (Requires the CSS provided earlier) */}
          <div className="avatar-overlay" style={{ position: 'absolute', bottom: 0, width: '100%', background: 'rgba(0,0,0,0.9)', color: '#fff', fontSize: '0.8rem', padding: '4px 0', textAlign: 'center' }}>
            Módosítás
          </div>
        </div>

        <h1 className="profile-name mt-3">{user?.username}</h1>
        <p className="profile-email">{user?.email}</p>
      </header>

      <div className="google-search-container">
        <div className="search-pill">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Keressen rá egy adatra (pl. 'jelszó')..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='search-bar'
          />
        </div>
        {results.length > 0 && (
          <div className="search-results-dropdown">
            {results.map((res, i) => (
              <div key={i} className="search-result-item" onClick={() => navigateAndScroll(res.tab, res.targetId)}>
                <span className="result-icon">↳</span> {res.label}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="chip-container justify-content-center mt-4">
        <button className="google-chip" onClick={() => setActiveTab('personal')}>Adataim</button>
        <button className="google-chip" onClick={() => setActiveTab('security')}>Biztonság</button>
        <button className="google-chip" onClick={() => setActiveTab('stats')}>Bérléseim</button>
      </div>
    </div>
  );
}

// --- PERSONAL TAB (With Edit & Scroll Logic) ---
function PersonalTab({ user, scrollTarget, setScrollTarget }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", phone: "", license: "" });

  useEffect(() => {
    if (user?.id) {
      axios.get(`https://localhost:7065/api/user/${user.id}/profile`)
        .then(res => {
          setFormData({
            name: res.data.fullName || "",
            phone: res.data.phoneNumber || "",
            license: res.data.licenseNumber || "",
          });
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [user]);

  // Handle auto-scroll and highlight
  useEffect(() => {
    if (!isLoading && scrollTarget) {
      const element = document.getElementById(scrollTarget);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('highlight-flash');
        setTimeout(() => {
            element.classList.remove('highlight-flash');
            setScrollTarget(null);
        }, 2000);
      }
    }
  }, [scrollTarget, isLoading, setScrollTarget]);

  const handleSave = async () => {
    try {
      await axios.put(`https://localhost:7065/api/user/${user.id}/profile`, {
        fullName: formData.name,
        phoneNumber: formData.phone,
        licenseNumber: formData.license
      });
      alert("Sikeres mentés!");
      setIsEditing(false);
    } catch (err) { alert("Hiba a mentés során."); }
  };

  if (isLoading) return <div className="text-center p-5">Betöltés...</div>;

  return (
    <div className="personal-info-container">
      <header className="tab-header">
        <h1>Személyes adatok</h1>
        <p>A fiókodban tárolt alapvető információk.</p>
      </header>
      <section className="info-card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2 className="m-0">Profil információk</h2>
          <button className="google-chip" onClick={isEditing ? handleSave : () => setIsEditing(true)}>
            {isEditing ? "Mentés" : "Szerkesztés"}
          </button>
        </div>
        <div className="info-list">
          <div className="info-row" id="field-name">
            <div className="info-label">TELJES NÉV</div>
            <div className="info-value">{isEditing ? <input name="name" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} className="edit-input"/> : formData.name || "Nincs megadva"}</div>
          </div>
          <div className="info-row" id="field-phone">
            <div className="info-label">TELEFONSZÁM</div>
            <div className="info-value">{isEditing ? <input name="phone" value={formData.phone} onChange={(e)=>setFormData({...formData, phone: e.target.value})} className="edit-input"/> : formData.phone || "Nincs megadva"}</div>
          </div>
          <div className="info-row" id="field-license">
            <div className="info-label">JOGOSÍTVÁNY</div>
            <div className="info-value">{isEditing ? <input name="license" value={formData.license} onChange={(e)=>setFormData({...formData, license: e.target.value})} className="edit-input"/> : formData.license || "Nincs feltöltve"}</div>
          </div>
          <div className="info-row" id="field-email">
            <div className="info-label">EMAIL</div>
            <div className="info-value">{user?.email} {user?.is_verified ? "✅" : "❌"}</div>
          </div>
        </div>
      </section>
    </div>
  );
}

// --- SECURITY TAB ---
function SecurityTab({ user, scrollTarget, setScrollTarget }) {
    useEffect(() => {
        if (scrollTarget) {
          const element = document.getElementById(scrollTarget);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('highlight-flash');
            setTimeout(() => {
                element.classList.remove('highlight-flash');
                setScrollTarget(null);
            }, 2000);
          }
        }
    }, [scrollTarget, setScrollTarget]);

    return (
        <div className="personal-info-container">
            <header className="tab-header"><h1>Biztonság</h1></header>
            <section className="info-card shadow-sm">
                <div className="info-list">
                    <div className="info-row" id="field-password">
                        <div className="info-label">JELSZÓ</div>
                        <div className="info-value">••••••••</div>
                        <button className="google-chip">Módosítás</button>
                    </div>
                </div>
            </section>
        </div>
    );
}

// --- STATISTICS TAB ---
function StatisticsTab({ user, scrollTarget, setScrollTarget }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      axios.get(`https://localhost:7065/api/user/${user.id}/orders`)
        .then(res => { setOrders(res.data); setIsLoading(false); })
        .catch(() => setIsLoading(false));
    }
  }, [user]);

  const handleFinish = async (id) => {
    if (!window.confirm("Befejezi a bérlést?")) return;
    try {
      await axios.post(`https://localhost:7065/api/orders/${id}/finish`);
      setOrders(orders.map(o => o.id === id ? { ...o, status: 3 } : o));
    } catch (e) { alert("Hiba történt."); }
  };

  const totalSpent = orders.reduce((sum, o) => sum + o.totalPrice, 0);

  return (
    <div className="personal-info-container" id="field-history">
      <header className="tab-header"><h1>Bérléseim</h1></header>
      <div className="d-flex gap-3 mb-4">
        <div className="info-card flex-fill p-4 text-center">
            <h2 style={{color: "#DAA520"}}>{orders.length}</h2>
            <p className="m-0 text-muted">Összes bérlés</p>
        </div>
        <div className="info-card flex-fill p-4 text-center">
            <h2 style={{color: "#DAA520"}}>{totalSpent.toLocaleString()} Ft</h2>
            <p className="m-0 text-muted">Összes költés</p>
        </div>
      </div>
      <section className="info-card shadow-sm">
        <div className="info-list">
          {orders.map(o => (
            <div key={o.id} className="rental-item d-flex justify-content-between align-items-center p-3">
              <div className="d-flex align-items-center gap-3">
                <img src={o.imageUrl} alt="car" style={{width: "60px", borderRadius: "4px"}} />
                <div>
                  <div className="fw-bold">{o.brand} {o.model}</div>
                  <div className="small text-muted">{new Date(o.startDate).toLocaleDateString()} - {new Date(o.endDate).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className={`badge ${o.status === 2 ? 'bg-success' : 'bg-secondary'}`}>
                    {o.status === 2 ? 'Aktív' : o.status === 1 ? 'Megerősítésre vár' : 'Befejezett'}
                </span>
                {o.status === 2 && <button className="google-chip text-danger" onClick={() => handleFinish(o.id)}>Visszavétel</button>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}