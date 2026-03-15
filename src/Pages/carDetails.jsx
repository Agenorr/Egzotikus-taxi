import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from "../Components/navbar";
import Footer from "../Components/footer";
import '../Css/Base.css';

const CarDetails = () => {
    // 1. URL-ből szedjük az ID-t, így frissítésnél is megmarad!
    const { id } = useParams(); 
    const location = useLocation();
    const navigate = useNavigate();
    
    // 2. Kinyerjük a dátumokat, ha a Taxi (foglalás) oldalról jöttek
    const { startDate, endDate } = location.state || {};
    const hasDates = startDate && endDate; // Ellenőrizzük, hogy vannak-e dátumok

    const [carDetails, setCarDetails] = useState(null);
    const [selectedDriverId, setSelectedDriverId] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Mock Drivers Data
    const mockDrivers = [
        { id: 1, name: 'Kovács Péter', experience: '5 év', rating: 4.9, dailyFee: 20000 },
        { id: 2, name: 'Nagy Anna', experience: '3 év', rating: 4.7, dailyFee: 15000 },
        { id: 3, name: 'Tóth Gábor', experience: '7 év', rating: 5.0, dailyFee: 25000 },
        { id: 4, name: 'Sofőr nélkül (Saját vezetés)', experience: 'N/A', rating: 'N/A', dailyFee: 0 }
    ];

    useEffect(() => {
        // A C# backend endpointod meghívása az URL-ben lévő ID alapján
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

    if (isLoading) return <h2 className="text-center mt-5">Betöltés...</h2>;
    
    // Ha a C# backend nem találja az autót
    if (!carDetails) return (
        <div className="text-center mt-5">
            <h2>Az autó nem található.</h2>
            <button onClick={() => navigate(-1)} className="btn btn-outline-secondary mt-3">
                ← Vissza
            </button>
        </div>
    );

    // --- Számolások (Csak akkor, ha vannak dátumok) ---
    let diffDays = 1;
    let driverCost = 0;
    let carCost = 0;
    let totalCost = 0;

    const carDailyPrice = carDetails.pricePerDay || carDetails.price_per_day || 0;

    if (hasDates) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

        const selectedDriver = mockDrivers.find(d => d.id === parseInt(selectedDriverId));
        driverCost = selectedDriver ? selectedDriver.dailyFee * diffDays : 0;
        
        carCost = carDailyPrice * diffDays;
        totalCost = carCost + driverCost;
    }

    const primaryImage = carDetails.images?.find(img => img.isPrimary)?.imageUrl || carDetails.images?.[0]?.imageUrl;

    return (
        <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
            <Navbar />
            
            <div className="container mt-5 mb-5">
                <button onClick={() => navigate(-1)} className="btn btn-outline-secondary mb-4 font-weight-bold">
                    ← Vissza
                </button>

                <div className="row g-5">
                    {/* BAL OLDAL: Kép és Leírás */}
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

                    {/* JOBB OLDAL: Adatok és Foglalás */}
                    <div className="col-lg-5">
                        <div className="bg-white p-4 rounded shadow-sm mb-4">
                            <h1 className="mb-1">{carDetails.brand} {carDetails.model}</h1>
                            <h5 className="text-muted mb-4">{carDetails.category} • Évjárat: {carDetails.year || "N/A"}</h5>
                            
                            {/* Csak akkor mutatjuk a foglalási matekot, ha a Taxi oldalról jöttek dátummal */}
                            {hasDates ? (
                                <>
                                    <div className="p-3 mb-4 rounded" style={{ backgroundColor: "#f1f3f5" }}>
                                        <h5 className="mb-3">Foglalás Részletei</h5>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-muted">Átvétel:</span>
                                            <strong>{startDate}</strong>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-muted">Visszavétel:</span>
                                            <strong>{endDate}</strong>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <span className="text-muted">Időtartam:</span>
                                            <strong>{diffDays} nap</strong>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label font-weight-bold">Válasszon sofőrt (Opcionális)</label>
                                        <select 
                                            className="form-select"
                                            value={selectedDriverId} 
                                            onChange={(e) => setSelectedDriverId(e.target.value)}
                                        >
                                            <option value="" disabled>Kérjük, válasszon...</option>
                                            {mockDrivers.map(driver => (
                                                <option key={driver.id} value={driver.id}>
                                                    {driver.name} {driver.dailyFee > 0 ? `(+${driver.dailyFee.toLocaleString('hu-HU')} Ft/nap)` : ''}
                                                </option>
                                            ))}
                                        </select>
                                        {selectedDriver && selectedDriver.dailyFee > 0 && (
                                            <small className="text-muted d-block mt-2">
                                                Értékelés: ⭐{selectedDriver.rating} | Tapasztalat: {selectedDriver.experience}
                                            </small>
                                        )}
                                    </div>

                                    <hr />

                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Autó bérleti díj ({diffDays} nap):</span>
                                        <span>{carCost.toLocaleString('hu-HU')} Ft</span>
                                    </div>
                                    {driverCost > 0 && (
                                        <div className="d-flex justify-content-between mb-3">
                                            <span className="text-muted">Sofőr díj ({diffDays} nap):</span>
                                            <span>{driverCost.toLocaleString('hu-HU')} Ft</span>
                                        </div>
                                    )}

                                    <h2 className="text-warning font-weight-bold mb-4 mt-3 text-end">
                                        {totalCost.toLocaleString('hu-HU')} Ft <span className="text-muted" style={{ fontSize: "1rem" }}>/ végösszeg</span>
                                    </h2>

                                    <button 
                                        className="btn btn-primary btn-lg w-100 mb-4" 
                                        style={{ backgroundColor: "#e65100", borderColor: "#e65100", fontWeight: "bold" }}
                                        onClick={() => alert("Foglalási kérelem elküldve a szervernek!")}
                                    >
                                        Foglalás Megerősítése
                                    </button>
                                </>
                            ) : (
                                /* Ha csak nézelődnek a galériából, csak a napi árat mutatjuk */
                                <>
                                    <h2 className="text-warning font-weight-bold mb-4">
                                        {carDailyPrice.toLocaleString('hu-HU')} Ft <span className="text-muted" style={{ fontSize: "1rem" }}>/ nap</span>
                                    </h2>
                                    <button 
                                        className="btn btn-primary btn-lg w-100 mb-4" 
                                        style={{ backgroundColor: "#e65100", borderColor: "#e65100", fontWeight: "bold" }}
                                        onClick={() => navigate('/taxi')}
                                    >
                                        Bérlés indítása
                                    </button>
                                </>
                            )}

                            <hr />

                            {/* Műszaki Adatok */}
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