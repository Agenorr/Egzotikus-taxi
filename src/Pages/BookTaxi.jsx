import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext'; 
import Navbar from "../Components/navbar";
import Footer from "../Components/footer";
import '../Css/BookTaxi.css'; 
import '../Css/Base.css';

const BookTaxi = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext); 

    const { car, pickupDate, pickupTime, pickupLocation, dropoffLocation } = location.state || {};

    const [carDetails, setCarDetails] = useState(null);
    const [drivers, setDrivers] = useState([]);
    const [selectedDriverId, setSelectedDriverId] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false); 

    useEffect(() => {
        document.title = "Exotic | Foglalás Véglegesítése";
    }, []);

    useEffect(() => {
        if (!car) { navigate('/taxi'); return; }

        const fetchData = async () => {
            try {
                const [carRes, driversRes] = await Promise.all([
                    axios.get(`https://localhost:7065/api/vehicles/${car.id}`),
                    axios.get(`https://localhost:7065/api/drivers`)
                ]);
                
                setCarDetails(carRes.data);
                setDrivers(driversRes.data);
                
                if (driversRes.data.length > 0) {
                    setSelectedDriverId(driversRes.data[0].id.toString());
                }
            } catch (error) {
                console.error("Adatlekérési hiba:", error);
                setCarDetails(car);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [car, navigate]);

    if (isLoading) return <div className="loading-screen">Betöltés...</div>;

    const carCost = carDetails?.pricePerDay || carDetails?.price_per_day || car?.price_per_day;

    const handleConfirmBooking = async () => {
        if (!user) {
            alert("Kérjük, jelentkezzen be a foglaláshoz!");
            navigate('/login');
            return;
        }

        if (!selectedDriverId) {
            alert("Kérjük, válasszon sofőrt!");
            return;
        }

        setIsSubmitting(true);

        const pickupDateTime = `${pickupDate}T${pickupTime}:00`;

        const bookingPayload = {
            userId: user.id,
            vehicleId: carDetails.id,
            driverId: parseInt(selectedDriverId),
            pickupLocation: pickupLocation,
            dropoffLocation: dropoffLocation,
            pickupDateTime: pickupDateTime,
            totalPrice: parseFloat(carCost)
        };

        try {
            await axios.post('https://localhost:7065/api/orders/taxi', bookingPayload);
            alert("Foglalás sikeresen elküldve!");
            navigate('/profile'); 
        } catch (error) {
            console.error("Hiba a foglalás során:", error);
            alert("Hiba történt a foglalás során. Kérjük próbálja újra.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="booking-page-container">
            <Navbar />
            <div className="booking-content">
                <button className="back-to-search-btn" onClick={() => navigate(-1)}>
                    &larr; Vissza a kereséshez
                </button>
                <h1 className="booking-title">Foglalás Véglegesítése</h1>
                <div className="booking-grid">
                    <div className="booking-left">
                        <img src={carDetails?.images ? carDetails.images[0].imageUrl : car?.image_url} alt={carDetails?.model} className="booking-main-image" />
                        <div className="booking-car-info">
                            <h2>{carDetails?.brand} {carDetails?.model}</h2>
                            <p className="booking-description">{carDetails?.description}</p>
                        </div>
                    </div>

                    <div className="booking-right">
                        <div className="summary-box">
                            <h3>Foglalás Részletei</h3>
                            <div className="summary-row"><span>Időpont:</span><span>{pickupDate} {pickupTime}</span></div>
                            <div className="summary-row"><span>Útvonal:</span><span>{pickupLocation} ➔ {dropoffLocation}</span></div>
                            <hr />
                            <div className="driver-selection">
                                <label>Válasszon sofőrt (Benne van az árban)</label>
                                {/* 3. Map over the REAL drivers */}
                                <select 
                                    value={selectedDriverId} 
                                    onChange={(e) => setSelectedDriverId(e.target.value)} 
                                    className="driver-select" 
                                    disabled={isSubmitting || drivers.length === 0}
                                >
                                    {drivers.length === 0 ? (
                                        <option value="">Nincs elérhető sofőr...</option>
                                    ) : (
                                        drivers.map(d => (
                                            <option key={d.id} value={d.id}>
                                                {d.name} ({d.rating} ⭐)
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>
                            <hr />
                            <div className="summary-row total-row">
                                <span>Végösszeg:</span>
                                <span>{parseFloat(carCost).toLocaleString()} Ft</span>
                            </div>
                            
                            <button 
                                className="confirm-booking-btn" 
                                onClick={handleConfirmBooking}
                                disabled={isSubmitting || drivers.length === 0}
                                style={{ opacity: (isSubmitting || drivers.length === 0) ? 0.7 : 1 }}
                            >
                                {isSubmitting ? "Feldolgozás..." : "Foglalás Megerősítése"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default BookTaxi;
