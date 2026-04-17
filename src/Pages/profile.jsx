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

  // GUARD: Wait for AuthContext to load so the Driver tab doesn't disappear on refresh
  if (user === undefined || user === null) {
    return (
      <div style={{ backgroundColor: "#1a1a1a", minHeight: "100vh" }}>
        <Navbar />
        <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
          <div className="spinner-border" style={{ color: "#DAA520" }} role="status">
            <span className="visually-hidden">Betöltés...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // 1. Conditionally build the navigation menu
  const navItems = [
    { id: "main", name: "Kezdőlap", icon: <i className="fa fa-home"></i> },
    { id: "personal", name: "Személyes adatok", icon: <i className="fa fa-user"></i> },
    { id: "security", name: "Biztonság", icon: <i className="fa fa-lock"></i> },
    { id: "stats", name: "Statisztikák", icon: <i className="fa fa-bar-chart"></i> },
  ];

  // If the user is a driver, add the Driver Dashboard to the sidebar
  if (user?.isDriver) {
    navItems.push({ id: "driver", name: "Sofőr Pult", icon: <i className="fa fa-taxi"></i> });
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
        return <DriverTab user={user} />;
      default:
        return <HomeTab user={user} navigateAndScroll={navigateAndScroll} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div style={{ backgroundColor: "#1a1a1a", minHeight: "100vh", color: "#fff" }}>
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
          className="avatar-wrapper mx-auto shadow-lg" 
          onClick={handleAvatarClick} 
          style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden', borderRadius: '50%', width: '120px', height: '120px', border: '3px solid #DAA520' }}
        >
          {profileImg ? (
            <img src={profileImg} alt="Profil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div className="avatar-main" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
          <div className="avatar-overlay" style={{ position: 'absolute', bottom: 0, width: '100%', background: 'rgba(0,0,0,0.8)', color: '#DAA520', fontSize: '0.8rem', padding: '4px 0', textAlign: 'center', fontWeight: 'bold' }}>
            <i className="fa fa-camera"></i>
          </div>
        </div>

        <h1 className="profile-name mt-3 text-white">{user?.username}</h1>
        <p className="profile-email" style={{ color: "#bbb" }}>{user?.email}</p>
      </header>

      <div className="google-search-container">
        <div className="search-pill">
          <span className="search-icon"><i className="fa fa-search"></i></span>
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
                <span className="result-icon"><i className="fa fa-angle-right"></i></span> {res.label}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="chip-container justify-content-center mt-4">
        <button className="google-chip" onClick={() => setActiveTab('personal')}>
          <i className="fa fa-user me-2"></i>Adataim
        </button>
        <button className="google-chip" onClick={() => setActiveTab('security')}>
          <i className="fa fa-lock me-2"></i>Biztonság
        </button>
        <button className="google-chip" onClick={() => setActiveTab('stats')}>
          <i className="fa fa-car me-2"></i>Bérléseim
        </button>
      </div>
    </div>
  );
}

// --- PERSONAL TAB (With Country Code & Validation Logic) ---
function PersonalTab({ user, scrollTarget, setScrollTarget }) {
  const { updateUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Szétválasztottuk az országkódot és a telefonszámot
  const [formData, setFormData] = useState({ 
    name: "", 
    phoneCode: "+36", 
    phone: "", 
    license: "" 
  });

  useEffect(() => {
    if (user?.id) {
      axios.get(`https://localhost:7065/api/user/${user.id}/profile`)
        .then(res => {
          // --- TELEFONSZÁM PARSOLÁS ---
          let fetchedPhone = res.data.phoneNumber || "";
          let code = "+36";
          let number = fetchedPhone;

          const commonCodes = ["+36", "+40", "+421", "+43", "+44", "+49", "+1"];
          for (let c of commonCodes) {
            if (fetchedPhone.startsWith(c)) {
              code = c;
              number = fetchedPhone.slice(c.length).trim();
              break;
            }
          }
          // Kezeljük, ha valaki "06"-tal írta be az adatbázisba régebben
          if (fetchedPhone.startsWith("06")) {
            code = "+36";
            number = fetchedPhone.slice(2).trim();
          }

          setFormData({
            name: res.data.fullName || "",
            phoneCode: code,
            phone: number,
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
    // --- KÖTELEZŐ TELEFONSZÁM ELLENŐRZÉS ---
    if (!formData.phone || formData.phone.trim() === "") {
        alert("A telefonszám megadása kötelező a profil mentéséhez!");
        return; 
    }

    try {
      await axios.put(`https://localhost:7065/api/user/${user.id}/profile`, {
        fullName: formData.name,
        // Összefűzzük az országkódot és a számot a mentéshez
        phoneNumber: `${formData.phoneCode} ${formData.phone.trim()}`,
        licenseNumber: formData.license
      });
      alert("Sikeres mentés!");
      setIsEditing(false);
    } catch (err) { 
        alert("Hiba a mentés során."); 
    }
  };

  const handleVerifyLicense = async () => {
    if (!formData.license) {
      alert("Kérjük, először mentsd el a jogosítvány számát a Szerkesztés gombbal!");
      return;
    }

    const licenseRegex = /^[A-Za-z]{2}\d{6}$/;
    if (!licenseRegex.test(formData.license)) {
      alert("Érvénytelen formátum! Egy magyar jogosítvány általában 2 betűből és 6 számból áll (pl. AB123456).");
      return;
    }

    setIsVerifying(true);

    setTimeout(async () => {
      try {
        const res = await axios.post(`https://localhost:7065/api/user/${user.id}/verify-license`, {
          licenseNumber: formData.license
        });

        alert(res.data.message);
        
        if (updateUser) {
           updateUser({ ...user, clearance: res.data.clearance, licenseNumber: res.data.licenseNumber });
        } else {
           if (res.data.clearance === 2) {
               alert("A változások érvényesítéséhez kérlek jelentkezz ki, majd jelentkezz be újra!");
           }
        }
      } catch (err) {
        alert("Hiba történt a jogosítvány hitelesítésekor.");
      } finally {
        setIsVerifying(false);
      }
    }, 2500);
  };

  if (isLoading) return <div className="text-center p-5 text-white">Betöltés...</div>;

  return (
    <div className="personal-info-container">
      <header className="tab-header">
        <h1>Személyes adatok</h1>
        <p style={{color: "#bbb"}}>A fiókodban tárolt alapvető információk.</p>
      </header>
      <section className="info-card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center border-bottom border-dark">
          <h2 className="m-0 text-white">Profil információk</h2>
          <button className="google-chip" onClick={isEditing ? handleSave : () => setIsEditing(true)}>
            {isEditing ? <><i className="fa fa-save me-1"></i>Mentés</> : <><i className="fa fa-edit me-1"></i>Szerkesztés</>}
          </button>
        </div>
        <div className="info-list">
          <div className="info-row" id="field-name">
            <div className="info-label">TELJES NÉV</div>
            <div className="info-value">
              {isEditing ? 
                <input name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="edit-input" /> 
                : formData.name || "Nincs megadva"}
            </div>
          </div>
          
          {/* --- TELEFONSZÁM SZEKCIÓ ORSZÁGKÓDDAL --- */}
          <div className="info-row" id="field-phone">
            <div className="info-label">TELEFONSZÁM <span className="text-danger">*</span></div>
            <div className="info-value">
              {isEditing ? (
                <div className="d-flex gap-2 w-100">
                  <select 
                    className="edit-input" 
                    style={{ width: "110px", padding: "8px 4px", cursor: "pointer" }}
                    value={formData.phoneCode}
                    onChange={(e) => setFormData({ ...formData, phoneCode: e.target.value })}
                  >
                    <option value="+36">🇭🇺 +36</option>
                    <option value="+40">🇷🇴 +40</option>
                    <option value="+421">🇸🇰 +421</option>
                    <option value="+43">🇦🇹 +43</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+49">🇩🇪 +49</option>
                    <option value="+1">🇺🇸 +1</option>
                  </select>
                  <input 
                    type="tel"
                    name="phone" 
                    value={formData.phone} 
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9]/g, '') })} // Csak számokat enged
                    className="edit-input flex-grow-1" 
                    placeholder="pl. 301234567"
                    required
                  />
                </div>
              ) : (
                formData.phone ? `${formData.phoneCode} ${formData.phone}` : "Nincs megadva"
              )}
            </div>
          </div>

          <div className="info-row" id="field-license" style={{ alignItems: 'center' }}>
            <div className="info-label">JOGOSÍTVÁNY</div>
            <div className="info-value d-flex flex-column gap-2">
              {isEditing ? (
                 <input 
                   name="license" 
                   value={formData.license} 
                   onChange={(e) => setFormData({ ...formData, license: e.target.value })} 
                   className="edit-input" 
                   placeholder="pl. AB123456"
                 /> 
              ) : (
                <span>{formData.license || "Nincs feltöltve"}</span>
              )}
              
              {!isEditing && formData.license && user?.clearance < 2 && (
                <button 
                  className="google-chip fw-bold mt-1 text-center" 
                  style={{ width: "fit-content", borderColor: "#ffc107", color: "#ffc107" }}
                  onMouseOver={(e) => { e.target.style.backgroundColor = '#ffc107'; e.target.style.color = '#1a1a1a'; }}
                  onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#ffc107'; }}
                  onClick={handleVerifyLicense}
                  disabled={isVerifying}
                >
                  <i className={`fa ${isVerifying ? 'fa-spinner fa-spin' : 'fa-exclamation-triangle'} me-2`}></i>
                  {isVerifying ? "Hitelesítés folyamatban..." : "Hitelesítés szükséges!"}
                </button>
              )}
              
              {!isEditing && user?.clearance >= 2 && (
                <span className="rental-status status-active" style={{ width: "fit-content" }}><i className="fa fa-check me-2"></i>Hitelesítve</span>
              )}
            </div>
          </div>

          <div className="info-row" id="field-email">
            <div className="info-label">EMAIL</div>
            <div className="info-value">
                {user?.email} 
                {user?.is_verified ? <i className="fa fa-check-circle text-success ms-2" title="Megerősítve"></i> : <i className="fa fa-times-circle text-danger ms-2" title="Nincs megerősítve"></i>}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// --- SECURITY TAB (ÚJ JELSZÓ VÁLTOZTATÓ LOGIKÁVAL) ---
function SecurityTab({ user, scrollTarget, setScrollTarget }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmNewPassword) {
      setError('Az új jelszavak nem egyeznek!');
      return;
    }
    if (newPassword.length < 6) {
      setError('Az új jelszónak legalább 6 karakternek kell lennie!');
      return;
    }
    if (currentPassword === newPassword) {
      setError('Az új jelszó nem lehet ugyanaz, mint a jelenlegi!');
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(`https://localhost:7065/api/user/${user.id}/change-password`, {
        currentPassword: currentPassword,
        newPassword: newPassword
      });

      setMessage(res.data.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      
      // Sikeres módosítás után összecsukjuk a formot kis késleltetéssel
      setTimeout(() => {
        setIsEditing(false);
        setMessage('');
      }, 3000);

    } catch (err) {
      setError(err.response?.data?.message || 'Hiba történt a jelszó módosítása során.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="personal-info-container">
      <header className="tab-header">
        <h1>Biztonság</h1>
        <p style={{color: "#bbb"}}>Kezeld a fiókod biztonsági beállításait és jelszavát.</p>
      </header>
      <section className="info-card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center border-bottom border-dark">
          <h2 className="m-0 text-white">Bejelentkezés</h2>
        </div>
        <div className="info-list">
          <div className="info-row" id="field-password" style={{ flexDirection: isEditing ? 'column' : 'row', alignItems: isEditing ? 'stretch' : 'center' }}>
            
            {!isEditing ? (
              <>
                <div className="info-label">JELSZÓ</div>
                <div className="info-value">••••••••</div>
                <button className="google-chip" onClick={() => setIsEditing(true)}>
                  <i className="fa fa-pencil me-1"></i>Módosítás
                </button>
              </>
            ) : (
              <div className="w-100 p-2">
                <h5 style={{ color: '#DAA520', marginBottom: '15px' }}>Jelszó Megváltoztatása</h5>
                {error && <div className="alert alert-danger py-2">{error}</div>}
                {message && <div className="alert alert-success bg-transparent border-success text-success py-2">{message}</div>}

                <form onSubmit={handleChangePassword}>
                  <div className="mb-3">
                    <label className="info-label mb-1">JELENLEGI JELSZÓ</label>
                    <input
                      type="password"
                      className="edit-input w-100"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Írd be a jelenlegi jelszavad"
                      required
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="info-label mb-1">ÚJ JELSZÓ</label>
                      <input
                        type="password"
                        className="edit-input w-100"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Legalább 6 karakter"
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="info-label mb-1">ÚJ JELSZÓ MEGERŐSÍTÉSE</label>
                      <input
                        type="password"
                        className="edit-input w-100"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Írd be újra az új jelszót"
                        required
                      />
                    </div>
                  </div>

                  <div className="d-flex gap-3 justify-content-end mt-3">
                    <button 
                      type="button" 
                      className="btn" 
                      style={{ color: '#bbb' }} 
                      onClick={() => { setIsEditing(false); setError(''); setMessage(''); }}
                    >
                      Mégse
                    </button>
                    <button 
                      type="submit" 
                      className="google-chip" 
                      style={{ margin: 0 }} 
                      disabled={isLoading}
                    >
                      {isLoading ? 'Mentés...' : 'Jelszó frissítése'}
                    </button>
                  </div>
                </form>
              </div>
            )}
            
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

  if (isLoading) return <div className="text-center p-5 text-white">Betöltés...</div>;

  return (
    <div className="personal-info-container" id="field-history">
      <header className="tab-header"><h1>Bérléseim és Utazásaim</h1></header>
      
      <div className="d-flex gap-3 mb-4 flex-wrap">
        <div className="info-card flex-fill p-4 text-center mb-0">
            <h2 style={{color: "#DAA520", fontWeight: 'bold'}}>{orders.length}</h2>
            <p className="m-0" style={{color: "#bbb"}}>Autóbérlés</p>
        </div>
        <div className="info-card flex-fill p-4 text-center mb-0">
            <h2 style={{color: "#DAA520", fontWeight: 'bold'}}>{taxiOrders.length}</h2>
            <p className="m-0" style={{color: "#bbb"}}>Taxi Utazás</p>
        </div>
        <div className="info-card flex-fill p-4 text-center mb-0">
            <h2 style={{color: "#DAA520", fontWeight: 'bold'}}>{totalSpent.toLocaleString()} Ft</h2>
            <p className="m-0" style={{color: "#bbb"}}>Összes költés</p>
        </div>
      </div>

      <h3 className="mb-3 mt-4" style={{color: "#DAA520", fontSize: "1.2rem", letterSpacing: "1px"}}><i className="fa fa-car me-2"></i>Klasszikus Autóbérlés</h3>
      <section className="info-card shadow-sm mb-5">
        <div className="info-list">
          {orders.length === 0 ? <div className="p-3 text-muted">Nincsenek autóbérlési előzmények.</div> : null}
          {orders.map(o => (
            <div key={o.id} className="rental-item d-flex justify-content-between align-items-center p-3 border-bottom border-dark">
              <div className="d-flex align-items-center gap-3">
                <img src={o.imageUrl} alt="car" style={{ width: "80px", borderRadius: "6px", border: "1px solid #444" }} />
                <div>
                  <div className="fw-bold text-white">{o.brand} {o.model}</div>
                  <div style={{ color: "#bbb", fontSize: "0.9rem" }}>{new Date(o.startDate).toLocaleDateString()} - {new Date(o.endDate).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className={`rental-status ${o.status === 2 ? 'status-active' : o.status === 1 ? 'status-pending' : 'status-completed'}`}>
                  {o.status === 2 ? 'Aktív' : o.status === 1 ? 'Megerősítésre vár' : 'Befejezett'}
                </span>
                {o.status === 2 && <button className="google-chip text-danger border-danger" style={{boxShadow: 'none'}} onClick={() => handleFinish(o.id)}>Visszavétel</button>}
              </div>
            </div>
          ))}
        </div>
      </section>

      <h3 className="mb-3 mt-4" style={{color: "#DAA520", fontSize: "1.2rem", letterSpacing: "1px"}}><i className="fa fa-taxi me-2"></i>Taxi & Sofőrszolgálat</h3>
      <section className="info-card shadow-sm">
        <div className="info-list">
          {taxiOrders.length === 0 ? <div className="p-3 text-muted">Nincsenek taxi előzmények.</div> : null}
          {taxiOrders.map(t => (
            <div key={t.id} className="rental-item d-flex justify-content-between align-items-center p-3 border-bottom border-dark">
              <div className="d-flex align-items-center gap-3">
                <div style={{ fontSize: "2rem", color: "#DAA520" }}><i className="fa fa-map-marker"></i></div>
                <div>
                  <div className="fw-bold text-white">{t.pickupLocation} ➔ {t.dropoffLocation}</div>
                  <div style={{ color: "#bbb", fontSize: "0.9rem" }}>
                    {new Date(t.pickupDateTime).toLocaleDateString()} | {new Date(t.pickupDateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>
              <div className="d-flex flex-column align-items-end gap-2">
                <span className="fw-bold" style={{color: "#DAA520"}}>{t.totalPrice.toLocaleString()} Ft</span>
                <span className={`rental-status ${t.status === 2 ? 'status-active' : t.status === 1 ? 'status-pending' : 'status-completed'}`}>
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
      setDriverOrders(prev => prev.map(ride => ride.id === rideId ? { ...ride, status: 3 } : ride));
    } catch (error) {
      alert("Hiba történt a befejezéskor.");
    }
  };

  if (isLoading) return <div className="text-center p-5 text-white">Betöltés...</div>;

  const pendingRides = driverOrders.filter(r => r.status === 1);
  const activeRides = driverOrders.filter(r => r.status === 2);
  const finishedRides = driverOrders
    .filter(r => r.status === 3)
    .sort((a, b) => new Date(b.pickupDateTime) - new Date(a.pickupDateTime))
    .slice(0, 5);

  return (
    <div className="personal-info-container">
      <header className="tab-header">
        <h1>Sofőr Pult</h1>
        <p style={{color: "#bbb"}}>Kiosztott és folyamatban lévő fuvarok áttekintése.</p>
      </header>

      {/* --- PENDING RIDES --- */}
      <section className="info-card shadow-sm mb-5">
        <div className="card-header border-bottom border-dark">
          <h2 className="m-0 text-white"><i className="fa fa-bell text-warning me-2"></i>Új Fuvarigénylések ({pendingRides.length})</h2>
        </div>
        <div className="info-list">
          {pendingRides.length === 0 ? (
            <div className="p-3 text-muted">Jelenleg nincs új fuvarigénylésed.</div>
          ) : (
            pendingRides.map(ride => (
              <div key={ride.id} className="rental-item d-flex justify-content-between align-items-center p-4 border-bottom border-dark">
                <div className="d-flex flex-column gap-1 text-white">
                  <h5 className="mb-2" style={{color: '#DAA520', fontWeight: 'bold'}}>
                    {new Date(ride.pickupDateTime).toLocaleString()}
                  </h5>
                  <div><strong style={{color: "#bbb"}}>Utas:</strong> {ride.customerName} ({ride.customerPhone || 'Nincs megadva'})</div>
                  <div><strong style={{color: "#bbb"}}>Felvétel:</strong> {ride.pickupLocation}</div>
                  <div><strong style={{color: "#bbb"}}>Cél:</strong> {ride.dropoffLocation}</div>
                  <div className="mt-2" style={{ fontSize: '1.1rem' }}>
                    <strong style={{color: "#bbb"}}>Tarifa:</strong> <span style={{color: '#DAA520', fontWeight: 'bold'}}>{ride.totalPrice.toLocaleString()} Ft</span>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <button 
                    className="google-chip fw-bold px-4 py-2"
                    onClick={() => handleAcceptRide(ride.id)}
                  >
                    <i className="fa fa-check me-2"></i>Elfogad
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* --- ACTIVE RIDES --- */}
      <section className="info-card shadow-sm mb-5" style={{borderColor: '#DAA520'}}>
        <div className="card-header border-bottom" style={{borderColor: '#DAA520'}}>
          <h2 className="m-0 text-white"><i className="fa fa-spinner fa-spin text-warning me-2"></i>Folyamatban lévő fuvarok ({activeRides.length})</h2>
        </div>
        <div className="info-list">
          {activeRides.length === 0 ? (
            <div className="p-3 text-muted">Nincs aktív fuvarod.</div>
          ) : (
            activeRides.map(ride => (
              <div key={ride.id} className="rental-item d-flex justify-content-between align-items-center p-4 border-bottom border-dark">
                <div className="d-flex flex-column gap-1 text-white">
                  <h5 className="mb-2" style={{color: '#DAA520', fontWeight: 'bold'}}>
                    {new Date(ride.pickupDateTime).toLocaleString()}
                  </h5>
                  <div><strong style={{color: "#bbb"}}>Utas:</strong> {ride.customerName} ({ride.customerPhone || 'Nincs megadva'})</div>
                  <div><strong style={{color: "#bbb"}}>Felvétel:</strong> {ride.pickupLocation}</div>
                  <div><strong style={{color: "#bbb"}}>Cél:</strong> {ride.dropoffLocation}</div>
                  <div className="mt-2" style={{ fontSize: '1.1rem' }}>
                    <strong style={{color: "#bbb"}}>Tarifa:</strong> <span style={{color: '#DAA520', fontWeight: 'bold'}}>{ride.totalPrice.toLocaleString()} Ft</span>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <button 
                    className="google-chip fw-bold px-4 py-2"
                    style={{ color: '#ff4d4d', borderColor: '#ff4d4d' }}
                    onMouseOver={(e) => { e.target.style.backgroundColor = '#ff4d4d'; e.target.style.color = '#fff'; }}
                    onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#ff4d4d'; }}
                    onClick={() => handleFinishRide(ride.id)}
                  >
                    <i className="fa fa-flag-checkered me-2"></i>Fuvar Befejezése
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* --- FINISHED RIDES --- */}
      <section className="info-card shadow-sm border-dark">
        <div className="card-header border-bottom border-dark">
          <h2 className="m-0" style={{color: '#bbb'}}><i className="fa fa-history me-2"></i>Legutóbbi befejezett fuvarok</h2>
        </div>
        <div className="info-list">
          {finishedRides.length === 0 ? (
            <div className="p-3 text-muted">Még nincs befejezett fuvarod.</div>
          ) : (
            finishedRides.map(ride => (
              <div key={ride.id} className="rental-item d-flex justify-content-between align-items-center p-3 border-bottom border-dark" style={{ opacity: 0.7 }}>
                <div className="d-flex flex-column gap-1">
                  <div style={{color: '#DAA520', fontWeight: 'bold'}}>
                    {new Date(ride.pickupDateTime).toLocaleString()}
                  </div>
                  <div className="text-white"><small><strong style={{color: "#bbb"}}>Utas:</strong> {ride.customerName}</small></div>
                  <div className="text-white"><small><strong style={{color: "#bbb"}}>Útvonal:</strong> {ride.pickupLocation} ➔ {ride.dropoffLocation}</small></div>
                </div>
                <div className="d-flex flex-column align-items-end">
                  <span className="fw-bold" style={{color: '#DAA520'}}>{ride.totalPrice.toLocaleString()} Ft</span>
                  <span className="rental-status status-completed mt-1">Befejezve</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}