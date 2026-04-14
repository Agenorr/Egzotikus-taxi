import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';
import Navbar from "../Components/navbar";
import Footer from "../Components/footer";
import '../Css/Base.css';

const CarDetails = () => {

    useEffect(() => {
        document.title = "Exotic | Jármű Részletei";
    }, []);

    const { id } = useParams(); 
    const location = useLocation();
    const navigate = useNavigate();
    
    const { user } = useContext(AuthContext);
    
    const { startDate, endDate } = location.state || {};

    const [localStartDate, setLocalStartDate] = useState(startDate || '');
    const [localEndDate, setLocalEndDate] = useState(endDate || '');
    
    const [carDetails, setCarDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    useEffect(() => {
        const fetchFullCarDetails = async () => {
            try {
                const response = await axios.get(`https://localhost:7065/api/vehicles/${id}`);
                setCarDetails(response.data);
            } catch (error) {
                console.error("Hiba az autó részleteinek betöltésekor", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFullCarDetails();
    }, [id]);

    const hasValidDates = localStartDate && localEndDate;
    let diffDays = 1;
    let totalCost = 0;

    const carDailyPrice = carDetails?.pricePerDay || carDetails?.price_per_day || 0;

    if (hasValidDates) {
        const start = new Date(localStartDate);
        const end = new Date(localEndDate);
        const diffTime = Math.abs(end - start);
        diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
        
        totalCost = carDailyPrice * diffDays;
    }

    const handleBooking = async () => {
        // Guard 1: Not logged in
        if (!user || !user.id) {
            alert("Kérjük, jelentkezzen be a bérléshez!");
            navigate('/Register');
            return;
        }

        // Guard 2: Clearance level too low
        if (user.clearance < 2) {
            alert("A bérléshez legalább 2-es szintű jogosultság (megerősített e-mail cím) szükséges!");
            navigate('/Profile');
            return;
        }

        const orderData = {
            userId: user.id,
            vehicleId: parseInt(id),
            startDate: localStartDate,
            endDate: localEndDate,
            totalPrice: totalCost
        };

        try {
            const response = await axios.post('https://localhost:7065/api/orders', orderData);
            alert("Bérlési kérelem sikeresen elküldve!");
            navigate('/Profile');
        } catch (error) {
            console.error("Hiba történt a foglalás során", error);
            alert("Hiba történt a foglalás során. Kérjük, próbálja újra.");
        }
    };

    if (isLoading) return <h2 className="text-center mt-5">Betöltés...</h2>;
    
    if (!carDetails) return (
        <div className="text-center mt-5">
            <h2>Az autó nem található.</h2>
            <button onClick={() => navigate(-1)} className="btn btn-outline-secondary mt-3">
                ← Vissza
            </button>
        </div>
    );

    const primaryImage = carDetails.images?.find(img => img.isPrimary)?.imageUrl || carDetails.images?.[0]?.imageUrl;
    
    // --- SECURITY LOGIC ---
    const isGuest = !user || !user.id;
    const isLowClearance = user && user.clearance < 2;
    // The screen is blurred/locked if they are a guest OR if they lack clearance
    const isLocked = isGuest || isLowClearance;

    return (
        <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
            <Navbar />
            
            <div className="container mt-5 mb-5">
                <button onClick={() => navigate('/CarRental')} className="btn btn-outline-secondary mb-4 font-weight-bold">
                    ← Vissza a kínálathoz
                </button>

                <div className="row g-5">
                    <div className="col-lg-7">
                        {primaryImage ? (
                            <img 
                                src={primaryImage} 
                                alt={`${carDetails.brand} ${carDetails.model}`} 
                                className="img-fluid rounded shadow mb-4"
                                style={{ width: "100%", maxHeight: "500px", objectFit: "cover" }}
                            />
                        ) : (
                            <div className="bg-secondary rounded mb-4" style={{ height: "400px" }}></div>
                        )}
                        
                        <div className="bg-white p-4 rounded shadow-sm">
                            <h4 className="mb-3">Leírás</h4>
                            <p className="lead" style={{ fontSize: "1.1rem", color: "#555" }}>
                                {carDetails.description || "Nincs elérhető leírás ehhez a járműhöz."}
                            </p>
                            
                            {carDetails.extras && (
                                <>
                                    <h5 className="mt-4 mb-2">Extrák:</h5>
                                    <p className="text-muted">{carDetails.extras}</p>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="col-lg-5">
                        <div className="bg-white p-4 rounded shadow-sm mb-4">
                            <h1 className="mb-1">{carDetails.brand} {carDetails.model}</h1>
                            <h5 className="text-muted mb-4">{carDetails.category} • Évjárat: {carDetails.year || "N/A"}</h5>
                            
                            {/* --- BLUR WRAPPER START --- */}
                            <div style={{ position: "relative" }}>
                                
                                {/* Blurred Content if Locked */}
                                <div style={{
                                    filter: isLocked ? 'blur(6px)' : 'none',
                                    pointerEvents: isLocked ? 'none' : 'auto',
                                    userSelect: isLocked ? 'none' : 'auto',
                                    opacity: isLocked ? 0.6 : 1,
                                    transition: 'all 0.3s ease'
                                }}>
                                    <div className="p-3 mb-4 rounded border" style={{ backgroundColor: "#fafafa" }}>
                                        <h5 className="mb-3">Bérlés időtartama</h5>
                                        <div className="row">
                                            <div className="col-sm-6 mb-3 mb-sm-0">
                                                <label className="form-label small text-muted fw-bold">Átvétel Dátuma</label>
                                                <input 
                                                    type="date" 
                                                    className="form-control" 
                                                    value={localStartDate} 
                                                    min={today}
                                                    onChange={(e) => {
                                                        const newStart = e.target.value;
                                                        setLocalStartDate(newStart);
                                                        if (localEndDate && newStart > localEndDate) {
                                                            setLocalEndDate(newStart);
                                                        }
                                                    }} 
                                                />
                                            </div>
                                            <div className="col-sm-6">
                                                <label className="form-label small text-muted fw-bold">Visszavétel Dátuma</label>
                                                <input 
                                                    type="date" 
                                                    className="form-control" 
                                                    value={localEndDate} 
                                                    min={localStartDate || today} 
                                                    onChange={(e) => setLocalEndDate(e.target.value)} 
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {hasValidDates ? (
                                        <>
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="text-muted">Autó bérleti díj ({diffDays} nap):</span>
                                                <span>{totalCost.toLocaleString('hu-HU')} Ft</span>
                                            </div>

                                            <h2 className="text-warning font-weight-bold mb-4 mt-3 text-end">
                                                {totalCost.toLocaleString('hu-HU')} Ft <span className="text-muted" style={{ fontSize: "1rem" }}>/ végösszeg</span>
                                            </h2>

                                            <button 
                                                className="btn btn-primary btn-lg w-100 mb-4" 
                                                style={{ backgroundColor: "#e65100", borderColor: "#e65100", fontWeight: "bold" }}
                                                onClick={handleBooking}
                                            >
                                                Bérlés Megerősítése
                                            </button>
                                        </>
                                    ) : (
                                        <div className="text-center py-4">
                                            <h2 className="text-warning font-weight-bold mb-3">
                                                {carDailyPrice.toLocaleString('hu-HU')} Ft <span className="text-muted" style={{ fontSize: "1rem" }}>/ nap</span>
                                            </h2>
                                            <div className="alert alert-secondary small">
                                                Kérjük, válassza ki a bérlés dátumait a folytatáshoz!
                                            </div>
                                            <button 
                                                className="btn btn-secondary btn-lg w-100 mb-4" 
                                                disabled
                                            >
                                                Válasszon dátumot
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Dynamic Overlay (Visible if Guest OR Low Clearance) */}
                                {isLocked && (
                                    <div style={{
                                        position: 'absolute',
                                        top: 0, left: 0, right: 0, bottom: 0,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        zIndex: 10,
                                        paddingBottom: '20px'
                                    }}>
                                        <div className="text-center p-4 bg-white shadow-lg rounded border" style={{ maxWidth: '90%' }}>
                                            {isGuest ? (
                                                <>
                                                    <div style={{ fontSize: "2rem", marginBottom: "10px" }}>🔒</div>
                                                    <h5 className="mb-3 text-dark fw-bold">Jelentkezz be a bérléshez!</h5>
                                                    <p className="text-muted small mb-4">Az árak és a foglalási naptár eléréséhez kérjük, lépj be a fiókodba.</p>
                                                    <button 
                                                        className="btn btn-warning w-100 fw-bold shadow-sm" 
                                                        onClick={() => navigate('/Register')}
                                                    >
                                                        Bejelentkezés / Regisztráció
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <div style={{ fontSize: "2rem", marginBottom: "10px" }}>✉️</div>
                                                    <h5 className="mb-3 text-dark fw-bold">Fiók megerősítése szükséges!</h5>
                                                    <p className="text-muted small mb-4">A bérléshez a fiók megerősítése szükséges. Irány a profilod!</p>
                                                    <button 
                                                        className="btn btn-primary w-100 fw-bold shadow-sm" 
                                                        style={{backgroundColor: "#e65100", border: "none"}}
                                                        onClick={() => navigate('/Profile')}
                                                    >
                                                        Tovább a Profilhoz
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* --- BLUR WRAPPER END --- */}

                            <hr />

                            <h4 className="mb-3 mt-3">Műszaki Adatok</h4>
                            <div className="row">
                                <div className="col-6 mb-3">
                                    <small className="text-muted d-block">Teljesítmény</small>
                                    <strong>{carDetails.hp ? `${carDetails.hp} LE` : "N/A"}</strong>
                                </div>
                                <div className="col-6 mb-3">
                                    <small className="text-muted d-block">Végsebesség</small>
                                    <strong>{carDetails.topSpeed ? `${carDetails.topSpeed} km/h` : "N/A"}</strong>
                                </div>
                                <div className="col-6 mb-3">
                                    <small className="text-muted d-block">Gyorsulás (0-100)</small>
                                    <strong>{carDetails.acceleration ? `${carDetails.acceleration} mp` : "N/A"}</strong>
                                </div>
                                <div className="col-6 mb-3">
                                    <small className="text-muted d-block">Váltó</small>
                                    <strong>{carDetails.transmission || "N/A"}</strong>
                                </div>
                                <div className="col-6 mb-3">
                                    <small className="text-muted d-block">Külső Szín</small>
                                    <strong>{carDetails.exteriorColor || "N/A"}</strong>
                                </div>
                                <div className="col-6 mb-3">
                                    <small className="text-muted d-block">Hajtás</small>
                                    <strong>{carDetails.drive || "N/A"}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CarDetails;