import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext'; // <-- Make sure this path is correct!
import Navbar from "../Components/navbar";
import Footer from "../Components/footer";
import '../Css/Base.css';

const CarDetails = () => {
    const { id } = useParams(); 
    const location = useLocation();
    const navigate = useNavigate();
    
    // Grab the logged-in user from AuthContext
    const { user } = useContext(AuthContext);
    
    // Grab dates if they happen to come from a previous flow
    const { startDate, endDate } = location.state || {};

    // Local state for the built-in calendar
    const [localStartDate, setLocalStartDate] = useState(startDate || '');
    const [localEndDate, setLocalEndDate] = useState(endDate || '');
    
    const [carDetails, setCarDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Date logic for the calendar (prevent past dates)
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

    // --- Pure Car Rental Calculations ---
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

    // --- API POST Request Logic ---
    const handleBooking = async () => {
        // 1. Check if user is logged in
        if (!user || !user.id) {
            alert("Kérjük, jelentkezzen be a bérléshez!");
            navigate('/Register'); // Redirect to login/register if they aren't signed in
            return;
        }

        // 2. Format the data to match your C# CreateOrderDto
        const orderData = {
            userId: user.id,
            vehicleId: parseInt(id),
            startDate: localStartDate,
            endDate: localEndDate,
            totalPrice: totalCost
        };

        // 3. Send it to the backend!
        try {
            const response = await axios.post('https://localhost:7065/api/orders', orderData);
            alert("Bérlési kérelem sikeresen elküldve!");
            navigate('/Profile'); // Send them to their profile to view the order
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

    return (
        <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
            <Navbar />
            
            <div className="container mt-5 mb-5">
                <button onClick={() => navigate('/CarRental')} className="btn btn-outline-secondary mb-4 font-weight-bold">
                    ← Vissza a kínálathoz
                </button>

                <div className="row g-5">
                    {/* LEFT SIDE: Image & Description */}
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

                    {/* RIGHT SIDE: Booking & Specs */}
                    <div className="col-lg-5">
                        <div className="bg-white p-4 rounded shadow-sm mb-4">
                            <h1 className="mb-1">{carDetails.brand} {carDetails.model}</h1>
                            <h5 className="text-muted mb-4">{carDetails.category} • Évjárat: {carDetails.year || "N/A"}</h5>
                            
                            {/* Built-in Calendar System */}
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

                            {/* Dynamic Content based on date selection */}
                            {hasValidDates ? (
                                <>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Autó bérleti díj ({diffDays} nap):</span>
                                        <span>{totalCost.toLocaleString('hu-HU')} Ft</span>
                                    </div>

                                    <h2 className="text-warning font-weight-bold mb-4 mt-3 text-end">
                                        {totalCost.toLocaleString('hu-HU')} Ft <span className="text-muted" style={{ fontSize: "1rem" }}>/ végösszeg</span>
                                    </h2>

                                    {/* POST REQUEST BUTTON */}
                                    <button 
                                        className="btn btn-primary btn-lg w-100 mb-4" 
                                        style={{ backgroundColor: "#e65100", borderColor: "#e65100", fontWeight: "bold" }}
                                        onClick={handleBooking}
                                    >
                                        Bérlés Megerősítése
                                    </button>
                                </>
                            ) : (
                                /* What to show before they pick dates */
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

                            <hr />

                            {/* Technical Specs Grid */}
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