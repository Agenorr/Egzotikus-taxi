import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';
import Navbar from "../Components/navbar";
import Footer from "../Components/footer";
import '../Css/Base.css';
import '../Css/carDetails.css';

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

    if (isLoading) return <h2 className="text-center mt-5 text-white">Betöltés...</h2>;
    
    if (!carDetails) return (
        <div className="text-center mt-5 text-white">
            <h2>Az autó nem található.</h2>
            <button onClick={() => navigate(-1)} className="btn details-back-btn mt-3">
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
        <div className="d-flex flex-column min-vh-100 car-details-page">
            <Navbar />
            
            <div className="container mt-5 mb-5 flex-grow-1">
                <button onClick={() => navigate('/CarRental')} className="btn details-back-btn mb-4 fw-bold">
                    ← Vissza a kínálathoz
                </button>

                <div className="row g-5">
                    <div className="col-lg-7">
                        {primaryImage ? (
                            <img 
                                src={primaryImage} 
                                alt={`${carDetails.brand} ${carDetails.model}`} 
                                className="img-fluid rounded mb-4 details-img"
                                style={{ width: "100%", maxHeight: "500px", objectFit: "cover" }}
                            />
                        ) : (
                            <div className="rounded mb-4 details-img" style={{ height: "400px", backgroundColor: "#252525" }}></div>
                        )}
                        
                        <div className="details-card">
                            <h4 className="mb-3 text-gold">Leírás</h4>
                            <p className="lead" style={{ fontSize: "1.1rem", color: "#bbb" }}>
                                {carDetails.description || "Nincs elérhető leírás ehhez a járműhöz."}
                            </p>
                            
                            {carDetails.extras && (
                                <>
                                    <h5 className="mt-4 mb-2 text-white">Extrák:</h5>
                                    <p className="details-text-muted">{carDetails.extras}</p>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="col-lg-5">
                        <div className="details-card mb-4">
                            <h1 className="mb-1 text-white">{carDetails.brand} {carDetails.model}</h1>
                            <h5 className="details-text-muted mb-4">{carDetails.category} • Évjárat: {carDetails.year || "N/A"}</h5>
                            
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
                                    <div className="details-booking-box mb-4">
                                        <h5 className="mb-3 text-white">Bérlés időtartama</h5>
                                        <div className="row">
                                            <div className="col-sm-6 mb-3 mb-sm-0">
                                                <label className="form-label small details-text-muted fw-bold">Átvétel Dátuma</label>
                                                <input 
                                                    type="date" 
                                                    className="form-control details-input" 
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
                                                <label className="form-label small details-text-muted fw-bold">Visszavétel Dátuma</label>
                                                <input 
                                                    type="date" 
                                                    className="form-control details-input" 
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
                                                <span className="details-text-muted">Autó bérleti díj ({diffDays} nap):</span>
                                                <span className="text-white">{totalCost.toLocaleString('hu-HU')} Ft</span>
                                            </div>

                                            <h2 className="text-gold fw-bold mb-4 mt-3 text-end">
                                                {totalCost.toLocaleString('hu-HU')} Ft <span className="details-text-muted" style={{ fontSize: "1rem" }}>/ végösszeg</span>
                                            </h2>

                                            <button 
                                                className="btn details-submit-btn btn-lg w-100 mb-4" 
                                                onClick={handleBooking}
                                            >
                                                Bérlés Megerősítése
                                            </button>
                                        </>
                                    ) : (
                                        <div className="text-center py-4">
                                            <h2 className="text-gold fw-bold mb-3">
                                                {carDailyPrice.toLocaleString('hu-HU')} Ft <span className="details-text-muted" style={{ fontSize: "1rem" }}>/ nap</span>
                                            </h2>
                                            <div className="alert alert-dark small" style={{ backgroundColor: "#333", color: "#bbb", borderColor: "#444" }}>
                                                Kérjük, válassza ki a bérlés dátumait a folytatáshoz!
                                            </div>
                                            <button 
                                                className="btn details-submit-btn btn-lg w-100 mb-4" 
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
                                        <div className="text-center p-4 details-locked-card shadow-lg" style={{ maxWidth: '95%' }}>
                                            {isGuest ? (
                                                <>
                                                    <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>🔒</div>
                                                    <h5 className="mb-3 text-white fw-bold">Jelentkezz be a bérléshez!</h5>
                                                    <p className="details-text-muted small mb-4">Az árak és a foglalási naptár eléréséhez kérjük, lépj be a fiókodba.</p>
                                                    <button 
                                                        className="btn details-submit-btn w-100" 
                                                        onClick={() => navigate('/Register')}
                                                    >
                                                        Bejelentkezés / Regisztráció
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>✉️</div>
                                                    <h5 className="mb-3 text-white fw-bold">Fiók megerősítése szükséges!</h5>
                                                    <p className="details-text-muted small mb-4">A bérléshez a fiók megerősítése szükséges. Irány a profilod!</p>
                                                    <button 
                                                        className="btn details-submit-btn w-100" 
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

                            <hr style={{ borderColor: '#444' }} />

                            <h4 className="mb-3 mt-3 text-gold">Műszaki Adatok</h4>
                            <div className="row">
                                <div className="col-6 mb-3">
                                    <small className="details-text-muted d-block">Teljesítmény</small>
                                    <strong className="text-white">{carDetails.hp ? `${carDetails.hp} LE` : "N/A"}</strong>
                                </div>
                                <div className="col-6 mb-3">
                                    <small className="details-text-muted d-block">Végsebesség</small>
                                    <strong className="text-white">{carDetails.topSpeed ? `${carDetails.topSpeed} km/h` : "N/A"}</strong>
                                </div>
                                <div className="col-6 mb-3">
                                    <small className="details-text-muted d-block">Gyorsulás (0-100)</small>
                                    <strong className="text-white">{carDetails.acceleration ? `${carDetails.acceleration} mp` : "N/A"}</strong>
                                </div>
                                <div className="col-6 mb-3">
                                    <small className="details-text-muted d-block">Váltó</small>
                                    <strong className="text-white">{carDetails.transmission || "N/A"}</strong>
                                </div>
                                <div className="col-6 mb-3">
                                    <small className="details-text-muted d-block">Külső Szín</small>
                                    <strong className="text-white">{carDetails.exteriorColor || "N/A"}</strong>
                                </div>
                                <div className="col-6 mb-3">
                                    <small className="details-text-muted d-block">Hajtás</small>
                                    <strong className="text-white">{carDetails.drive || "N/A"}</strong>
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
