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

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    useEffect(() => {
        const fetchFullCarDetails = async () => {
            try {
                const response = await axios.get(`https://localhost:7065/api/vehicles/${id}`);
                setCarDetails(response.data);
                
                // Kezdő kép beállítása (elsődleges keresése)
                if (response.data.images && response.data.images.length > 0) {
                    const primaryIdx = response.data.images.findIndex(img => img.isPrimary);
                    setCurrentImageIndex(primaryIdx !== -1 ? primaryIdx : 0);
                }
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
        start.setHours(0,0,0,0);
        end.setHours(0,0,0,0);

        const diffTime = end - start;
        const dayCount = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
        
        diffDays = dayCount > 0 ? dayCount : 1;
        totalCost = carDailyPrice * diffDays;
    }

    const nextImage = () => {
        if (!carDetails?.images) return;
        setCurrentImageIndex((prev) => (prev === carDetails.images.length - 1 ? 0 : prev + 1));
    };

    const prevImage = () => {
        if (!carDetails?.images) return;
        setCurrentImageIndex((prev) => (prev === 0 ? carDetails.images.length - 1 : prev - 1));
    };

    const handleBooking = async () => {
        if (!user || !user.id) {
            alert("Kérjük, jelentkezzen be a bérléshez!");
            navigate('/Register');
            return;
        }

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

    const currentImageUrl = carDetails.images?.[currentImageIndex]?.imageUrl;
    
    const isGuest = !user || !user.id;
    const isLowClearance = user && user.clearance < 2;
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
                        
                        <div className="gallery-slider-section mb-4">
                            <div className="main-image-slider-wrapper position-relative">
                                {currentImageUrl ? (
                                    <img 
                                        key={currentImageIndex}
                                        src={currentImageUrl} 
                                        alt={`${carDetails.brand} ${carDetails.model}`} 
                                        className="img-fluid rounded main-details-img-slider shadow-lg fade-in-image" 
                                    />
                                ) : (
                                    <div className="rounded main-details-img-slider-placeholder"></div>
                                )}

                                
                                {carDetails.images?.length > 1 && (
                                    <>
                                        <button className="slider-arrow prev-arrow" onClick={prevImage}>
                                            <i className="fa fa-chevron-left"></i>
                                        </button>
                                        <button className="slider-arrow next-arrow" onClick={nextImage}>
                                            <i className="fa fa-chevron-right"></i>
                                        </button>
                                    </>
                                )}
                            </div>

                            
                            <div className="slider-indicators-row d-flex justify-content-center gap-2 mt-3">
                                {carDetails.images?.map((_, idx) => (
                                    <div 
                                        key={idx} 
                                        className={`indicator-line-item ${currentImageIndex === idx ? 'active' : ''}`}
                                        onClick={() => setCurrentImageIndex(idx)}
                                    />
                                ))}
                            </div>
                        </div>
                        
                        
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
                            
                            <div style={{ position: "relative" }}>
                                
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

                                {isLocked && (
                                    <div className="lock-overlay">
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