import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from "../Components/navbar";
import Footer from "../Components/footer";
import '../Css/BookTaxi.css'; 
import '../Css/Base.css';

const BookTaxi = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { car, pickupDate, pickupTime, pickupLocation, dropoffLocation } = location.state || {};

    const [carDetails, setCarDetails] = useState(null);
    const [selectedDriverId, setSelectedDriverId] = useState('1');
    const [isLoading, setIsLoading] = useState(true);

    const mockDrivers = [
        { id: 1, name: 'Kovács Péter', experience: '5 év', rating: 4.9 },
        { id: 2, name: 'Nagy Anna', experience: '3 év', rating: 4.7 },
        { id: 3, name: 'Tóth Gábor', experience: '7 év', rating: 5.0 }
    ];

    useEffect(() => {
        if (!car) { navigate('/taxi'); return; }
        const fetchDetails = async () => {
            try {
                const response = await axios.get(`https://localhost:7065/api/vehicles/${car.id}`);
                setCarDetails(response.data);
            } catch { setCarDetails(car); }
            finally { setIsLoading(false); }
        };
        fetchDetails();
    }, [car, navigate]);

    if (isLoading) return <div className="loading-screen">Betöltés...</div>;

    const carCost = carDetails.pricePerDay || carDetails.price_per_day || car.price_per_day;

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
                        <img src={carDetails.images ? carDetails.images[0].imageUrl : car.image_url} alt={carDetails.model} className="booking-main-image" />
                        <div className="booking-car-info">
                            <h2>{carDetails.brand} {carDetails.model}</h2>
                            <p className="booking-description">{carDetails.description}</p>
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
                                <select value={selectedDriverId} onChange={(e) => setSelectedDriverId(e.target.value)} className="driver-select">
                                    {mockDrivers.map(d => <option key={d.id} value={d.id}>{d.name} ({d.experience})</option>)}
                                </select>
                            </div>
                            <hr />
                            <div className="summary-row total-row">
                                <span>Végösszeg:</span>
                                <span>${parseFloat(carCost).toFixed(2)}</span>
                            </div>
                            <button className="confirm-booking-btn" onClick={() => alert("Foglalás elküldve!")}>
                                Foglalás Megerősítése
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
