import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from "../Components/navbar";
import Footer from "../Components/footer";
import '../Css/BookTaxi.css'; // We will create this next
import '../Css/Base.css';

const BookTaxi = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Extract the data passed from the Taxi page
    const { car, startDate, endDate } = location.state || {};

    const [carDetails, setCarDetails] = useState(null);
    const [selectedDriverId, setSelectedDriverId] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Mock Drivers Data (Since it's not in your DB yet)
    const mockDrivers = [
        { id: 1, name: 'Kovács Péter', experience: '5 év', rating: 4.9, dailyFee: 50 },
        { id: 2, name: 'Nagy Anna', experience: '3 év', rating: 4.7, dailyFee: 40 },
        { id: 3, name: 'Tóth Gábor', experience: '7 év', rating: 5.0, dailyFee: 65 },
        { id: 4, name: 'Sofőr nélkül (Saját vezetés)', experience: 'N/A', rating: 'N/A', dailyFee: 0 }
    ];

    useEffect(() => {
        // If someone navigates here directly without selecting a car, send them back
        if (!car) {
            navigate('/taxi');
            return;
        }

        // Fetch FULL car details from the DB using the specific ID
        const fetchFullCarDetails = async () => {
            try {
                const response = await axios.get(`https://localhost:7065/api/vehicles/${car.id}`);
                setCarDetails(response.data);
            } catch (error) {
                console.error("Hiba az autó részleteinek betöltésekor", error);
                // Fallback to the brief details passed from the previous page
                setCarDetails(car);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFullCarDetails();
    }, [car, navigate]);

    if (isLoading) {
        return <div className="loading-screen">Betöltés...</div>;
    }

    // --- Calculations ---
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; // Minimum 1 day

    const selectedDriver = mockDrivers.find(d => d.id === parseInt(selectedDriverId));
    const driverCost = selectedDriver ? selectedDriver.dailyFee * diffDays : 0;
    
    // Fallback to car.price_per_day if the detailed endpoint uses a different casing
    const carDailyPrice = carDetails.pricePerDay || carDetails.price_per_day || car.price_per_day;
    const carCost = carDailyPrice * diffDays;
    
    const totalCost = carCost + driverCost;

    return (
        <div className="booking-page-container">
            <Navbar />
            
            <div className="booking-content">
                <h1 className="booking-title">Foglalás Véglegesítése</h1>
                
                <div className="booking-grid">
                    {/* Left Column: Car Details */}
                    <div className="booking-left">
                        <img 
                            src={carDetails.images ? carDetails.images[0].imageUrl : car.image_url} 
                            alt={carDetails.model} 
                            className="booking-main-image" 
                        />
                        <div className="booking-car-info">
                            <h2>{carDetails.brand} {carDetails.model}</h2>
                            <p className="booking-description">{carDetails.description}</p>
                            
                            <ul className="specs-list">
                                <li><strong>Kategória:</strong> {carDetails.category}</li>
                                {carDetails.hp && <li><strong>Lóerő:</strong> {carDetails.hp} HP</li>}
                                {carDetails.topSpeed && <li><strong>Végsebesség:</strong> {carDetails.topSpeed} km/h</li>}
                                {carDetails.acceleration && <li><strong>Gyorsulás 0-100:</strong> {carDetails.acceleration}</li>}
                            </ul>
                        </div>
                    </div>

                    {/* Right Column: Calculations & Form */}
                    <div className="booking-right">
                        <div className="summary-box">
                            <h3>Foglalás Részletei</h3>
                            <div className="summary-row">
                                <span>Átvétel:</span>
                                <span>{startDate}</span>
                            </div>
                            <div className="summary-row">
                                <span>Visszavétel:</span>
                                <span>{endDate}</span>
                            </div>
                            <div className="summary-row">
                                <span>Időtartam:</span>
                                <span>{diffDays} nap</span>
                            </div>
                            <hr />
                            
                            {/* Driver Selection */}
                            <div className="driver-selection">
                                <label>Válasszon sofőrt (Opcionális)</label>
                                <select 
                                    value={selectedDriverId} 
                                    onChange={(e) => setSelectedDriverId(e.target.value)}
                                    className="driver-select"
                                >
                                    <option value="" disabled>Kérjük, válasszon...</option>
                                    {mockDrivers.map(driver => (
                                        <option key={driver.id} value={driver.id}>
                                            {driver.name} {driver.dailyFee > 0 ? `(+$${driver.dailyFee}/nap)` : ''}
                                        </option>
                                    ))}
                                </select>
                                
                                {selectedDriver && selectedDriver.dailyFee > 0 && (
                                    <div className="driver-details-snippet">
                                        Értékelés: ⭐{selectedDriver.rating} | Tapasztalat: {selectedDriver.experience}
                                    </div>
                                )}
                            </div>

                            <hr />
                            
                            {/* Price Breakdown */}
                            <div className="summary-row">
                                <span>Autó bérleti díj:</span>
                                <span>${carCost.toFixed(2)}</span>
                            </div>
                            {driverCost > 0 && (
                                <div className="summary-row">
                                    <span>Sofőr díj:</span>
                                    <span>${driverCost.toFixed(2)}</span>
                                </div>
                            )}
                            
                            <div className="summary-row total-row">
                                <span>Becsült Végösszeg:</span>
                                <span>${totalCost.toFixed(2)}</span>
                            </div>

                            <button className="confirm-booking-btn" onClick={() => alert("Foglalási kérelem elküldve a szervernek!")}>
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