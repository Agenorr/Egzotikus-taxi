import React, { useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';
import '../Css/Profile.css';
import Navbar from '../Components/navbar';
import Footer from '../Components/footer';

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('main');

  const [scrollTarget, setScrollTarget] = useState(null);

  useEffect(() => {
    document.title = "Exotic | Profil";
  }, []);

  // 1. Conditionally build the navigation menu
  const navItems = [
    { id: "main", name: "Kezdőlap", icon: "🏠" },
    { id: "personal", name: "Személyes adatok", icon: "👤" },
    { id: "security", name: "Biztonság", icon: "🔒" },
    { id: "stats", name: "Statisztikák", icon: "📊" },
  ];

  // If the user is a driver, add the Driver Dashboard to the sidebar
  if (user?.isDriver) {
    navItems.push({ id: "driver", name: "Sofőr Pult", icon: "🚕" });
  }

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
      case 'driver':
        return <DriverTab user={user} />; // 2. Add the Driver Tab to the switch statement
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
                  setScrollTarget(null);
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

function HomeTab({ user, navigateAndScroll, setActiveTab }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

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

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

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
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleFileChange}
        />

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
            <div className="info-value">{isEditing ? <input name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="edit-input" /> : formData.name || "Nincs megadva"}</div>
          </div>
          <div className="info-row" id="field-phone">
            <div className="info-label">TELEFONSZÁM</div>
            <div className="info-value">{isEditing ? <input name="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="edit-input" /> : formData.phone || "Nincs megadva"}</div>
          </div>
          <div className="info-row" id="field-license">
            <div className="info-label">JOGOSÍTVÁNY</div>
            <div className="info-value">{isEditing ? <input name="license" value={formData.license} onChange={(e) => setFormData({ ...formData, license: e.target.value })} className="edit-input" /> : formData.license || "Nincs feltöltve"}</div>
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

function StatisticsTab({ user, scrollTarget, setScrollTarget }) {
  const [orders, setOrders] = useState([]);
  const [taxiOrders, setTaxiOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      Promise.all([
        axios.get(`https://localhost:7065/api/user/${user.id}/orders`).catch(() => ({ data: [] })),
        axios.get(`https://localhost:7065/api/user/${user.id}/taxi-orders`).catch(() => ({ data: [] }))
      ])
      .then(([ordersRes, taxiRes]) => {
        setOrders(ordersRes.data);
        setTaxiOrders(taxiRes.data);
        setIsLoading(false);
      })
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

  const totalSpentOrders = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const totalSpentTaxi = taxiOrders.reduce((sum, o) => sum + o.totalPrice, 0);
  const totalSpent = totalSpentOrders + totalSpentTaxi;

  if (isLoading) return <div className="text-center p-5">Betöltés...</div>;

  return (
    <div className="personal-info-container" id="field-history">
      <header className="tab-header"><h1>Bérléseim és Utazásaim</h1></header>
      
      <div className="d-flex gap-3 mb-4">
        <div className="info-card flex-fill p-4 text-center">
            <h2 style={{color: "#DAA520"}}>{orders.length}</h2>
            <p className="m-0">Autóbérlés</p>
        </div>
        <div className="info-card flex-fill p-4 text-center">
            <h2 style={{color: "#DAA520"}}>{taxiOrders.length}</h2>
            <p className="m-0">Taxi Utazás</p>
        </div>
        <div className="info-card flex-fill p-4 text-center">
            <h2 style={{color: "#DAA520"}}>{totalSpent.toLocaleString()} Ft</h2>
            <p className="m-0">Összes költés</p>
        </div>
      </div>

      <h3 className="mb-3" style={{color: "white", fontSize: "1.2rem"}}>Klasszikus Autóbérlés</h3>
      <section className="info-card shadow-sm mb-5">
        <div className="info-list">
          {orders.length === 0 ? <div className="p-3">Nincsenek autóbérlési előzmények.</div> : null}
          {orders.map(o => (
            <div key={o.id} className="rental-item d-flex justify-content-between align-items-center p-3 border-bottom">
              <div className="d-flex align-items-center gap-3">
                <img src={o.imageUrl} alt="car" style={{ width: "60px", borderRadius: "4px" }} />
                <div>
                  <div className="fw-bold">{o.brand} {o.model}</div>
                  <div className="small">{new Date(o.startDate).toLocaleDateString()} - {new Date(o.endDate).toLocaleDateString()}</div>
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

      <h3 className="mb-3" style={{color: "white", fontSize: "1.2rem"}}>Taxi & Sofőrszolgálat</h3>
      <section className="info-card shadow-sm">
        <div className="info-list">
          {taxiOrders.length === 0 ? <div className="p-3">Nincsenek taxi előzmények.</div> : null}
          {taxiOrders.map(t => (
            <div key={t.id} className="rental-item d-flex justify-content-between align-items-center p-3 border-bottom">
              <div className="d-flex align-items-center gap-3">
                <div style={{ fontSize: "2rem" }}>🚕</div>
                <div>
                  <div className="fw-bold">{t.pickupLocation} ➔ {t.dropoffLocation}</div>
                  <div className="small">
                    {new Date(t.pickupDateTime).toLocaleDateString()} | {new Date(t.pickupDateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>
              <div className="d-flex flex-column align-items-end gap-1">
                <span className="fw-bold" style={{color: "#DAA520"}}>{t.totalPrice.toLocaleString()} Ft</span>
                <span className={`badge ${t.status === 2 ? 'bg-success' : 'bg-secondary'}`}>
                    {t.status === 2 ? 'Folyamatban' : t.status === 1 ? 'Megerősítésre vár' : 'Befejezett'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

// --- 3. NEW DRIVER TAB COMPONENT ---
function DriverTab({ user }) {
  const [driverOrders, setDriverOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id && user?.isDriver) {
      axios.get(`https://localhost:7065/api/driver/${user.id}/taxi-orders`)
        .then(res => {
          setDriverOrders(res.data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Hiba a sofőr fuvarok lekérésekor:", err);
          setIsLoading(false);
        });
    }
  }, [user]);

  const handleAcceptRide = async (rideId) => {
    try {
      await axios.post(`https://localhost:7065/api/orders/taxi/${rideId}/accept`);
      alert("Fuvar elfogadva! Az utas megkapta a megerősítő emailt.");
      setDriverOrders(prev => prev.map(ride => ride.id === rideId ? { ...ride, status: 2 } : ride));
    } catch (error) {
      console.error(error);
      alert("Hiba történt a fuvar elfogadásakor.");
    }
  };

  const handleFinishRide = async (rideId) => {
    if (!window.confirm("Biztosan befejezed a fuvart?")) return;
    try {
      await axios.post(`https://localhost:7065/api/orders/taxi/${rideId}/finish`);
      // Update status to 3 instead of deleting it, so it instantly pops into the finished list!
      setDriverOrders(prev => prev.map(ride => ride.id === rideId ? { ...ride, status: 3 } : ride));
    } catch (error) {
      alert("Hiba történt a befejezéskor.");
    }
  };

  if (isLoading) return <div className="text-center p-5">Betöltés...</div>;

  // 1. Split the data based on status
  const pendingRides = driverOrders.filter(r => r.status === 1);
  const activeRides = driverOrders.filter(r => r.status === 2);
  
  // 2. Filter finished rides, sort them newest to oldest, and grab only the first 5
  const finishedRides = driverOrders
    .filter(r => r.status === 3)
    .sort((a, b) => new Date(b.pickupDateTime) - new Date(a.pickupDateTime))
    .slice(0, 5);

  return (
    <div className="personal-info-container">
      <header className="tab-header">
        <h1>Sofőr Pult</h1>
        <p>Kiosztott és folyamatban lévő fuvarok áttekintése.</p>
      </header>

      {/* --- PENDING RIDES --- */}
      <section className="info-card shadow-sm mb-5">
        <div className="card-header bg-light">
          <h2 className="m-0 text-dark">Új Fuvarigénylések ({pendingRides.length})</h2>
        </div>
        <div className="info-list">
          {pendingRides.length === 0 ? (
            <div className="p-3">Jelenleg nincs új fuvarigénylésed.</div>
          ) : (
            pendingRides.map(ride => (
              <div key={ride.id} className="rental-item d-flex justify-content-between align-items-center p-4 border-bottom">
                <div className="d-flex flex-column gap-1">
                  <h5 className="mb-2" style={{color: '#DAA520', fontWeight: 'bold'}}>
                    {new Date(ride.pickupDateTime).toLocaleString()}
                  </h5>
                  <div><strong>Utas:</strong> {ride.customerName} ({ride.customerPhone || 'Nincs megadva'})</div>
                  <div><strong>Felvétel:</strong> {ride.pickupLocation}</div>
                  <div><strong>Cél:</strong> {ride.dropoffLocation}</div>
                  <div className="mt-2" style={{ fontSize: '1.1rem' }}>
                    <strong>Tarifa:</strong> <span style={{color: '#DAA520', fontWeight: 'bold'}}>{ride.totalPrice.toLocaleString()} Ft</span>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <button 
                    className="btn btn-success fw-bold px-4 py-2"
                    style={{ borderRadius: '8px' }}
                    onClick={() => handleAcceptRide(ride.id)}
                  >
                    ✅ Elfogad
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* --- ACTIVE RIDES --- */}
      <section className="info-card shadow-sm mb-5 border-success">
        <div className="card-header bg-success text-white">
          <h2 className="m-0" style={{color: 'white'}}>Folyamatban lévő fuvarok ({activeRides.length})</h2>
        </div>
        <div className="info-list">
          {activeRides.length === 0 ? (
            <div className="p-3">Nincs aktív fuvarod.</div>
          ) : (
            activeRides.map(ride => (
              <div key={ride.id} className="rental-item d-flex justify-content-between align-items-center p-4 border-bottom">
                <div className="d-flex flex-column gap-1">
                  <h5 className="mb-2 text-success" style={{fontWeight: 'bold'}}>
                    {new Date(ride.pickupDateTime).toLocaleString()}
                  </h5>
                  <div><strong>Utas:</strong> {ride.customerName} ({ride.customerPhone || 'Nincs megadva'})</div>
                  <div><strong>Felvétel:</strong> {ride.pickupLocation}</div>
                  <div><strong>Cél:</strong> {ride.dropoffLocation}</div>
                  <div className="mt-2" style={{ fontSize: '1.1rem' }}>
                    <strong>Tarifa:</strong> <span className="text-success fw-bold">{ride.totalPrice.toLocaleString()} Ft</span>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <button 
                    className="btn btn-outline-danger fw-bold px-4 py-2"
                    style={{ borderRadius: '8px', borderWidth: '2px' }}
                    onClick={() => handleFinishRide(ride.id)}
                  >
                    🏁 Fuvar Befejezése
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* --- FINISHED RIDES (LAST 5) --- */}
      <section className="info-card shadow-sm border-secondary">
        <div className="card-header bg-secondary text-white">
          <h2 className="m-0" style={{color: 'white'}}>Legutóbbi befejezett fuvarok</h2>
        </div>
        <div className="info-list">
          {finishedRides.length === 0 ? (
            <div className="p-3">Még nincs befejezett fuvarod.</div>
          ) : (
            finishedRides.map(ride => (
              <div key={ride.id} className="rental-item d-flex justify-content-between align-items-center p-3 border-bottom" style={{ opacity: 0.8 }}>
                <div className="d-flex flex-column gap-1">
                  <div style={{color: '#6c757d', fontWeight: 'bold'}}>
                    {new Date(ride.pickupDateTime).toLocaleString()}
                  </div>
                  <div><small><strong>Utas:</strong> {ride.customerName}</small></div>
                  <div><small><strong>Útvonal:</strong> {ride.pickupLocation} ➔ {ride.dropoffLocation}</small></div>
                </div>
                <div className="d-flex flex-column align-items-end">
                  <span className="text-secondary fw-bold">{ride.totalPrice.toLocaleString()} Ft</span>
                  <span className="badge bg-secondary mt-1">Befejezve</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
