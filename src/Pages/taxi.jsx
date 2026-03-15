import Navbar from "../Components/navbar"
import Footer from "../Components/footer"
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import '../Css/Taxi.css'; 

const Taxi = () => {
  const navigate = useNavigate(); 
  
  // Fül szövegének beállítása
  useEffect(() => {
    document.title = "Exotic | Taxi Rendelés";
  }, []);

  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('12:00'); 
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  
  const [availableCars, setAvailableCars] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(''); 
  const [isSearching, setIsSearching] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  // Generates military time options (00:00 - 23:30)
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      const h = hour.toString().padStart(2, '0');
      times.push(`${h}:00`);
      times.push(`${h}:30`);
    }
    return times;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!pickupDate || !pickupTime || !pickupLocation || !dropoffLocation) {
      alert("Kérjük, töltsön ki minden mezőt.");
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get('https://localhost:7065/api/vehicles');
      const data = response.data;

      const formattedCars = data.map(car => ({
        id: car.id,
        brand: car.brand,
        model: car.model,
        category: car.category || 'Egyéb',
        image_url: car.images && car.images.length > 0 ? car.images[0].imageUrl : '',
        price_per_day: car.pricePerDay || 0, 
        description: car.description || `${car.brand} ${car.model}`
      }));

      setAvailableCars(formattedCars);
    } catch (error) {
      console.error("Hiba:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleBookCar = (car) => {
    navigate('/book-taxi', { 
      state: { car, pickupDate, pickupTime, pickupLocation, dropoffLocation } 
    });
  };

  const uniqueCategories = [...new Set(availableCars.map(car => car.category).filter(Boolean))];
  const filteredCars = selectedCategory 
    ? availableCars.filter(car => car.category === selectedCategory)
    : availableCars;
  
  return (
    <div><Navbar/>
    <div className="rentals-container">
      
      
      <div className="rentals-header">
        <h1 className="navbar-title rentals-title">Foglalja le Egzotikus Autóját</h1>
      </div>

      <div className="search-form-container">
        <form onSubmit={handleSearch} className="search-form">
          <div className="form-group">
            <label>Felvétel Helye</label>
            <input type="text" className="date-input" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Leadás Helye</label>
            <input type="text" className="date-input" value={dropoffLocation} onChange={(e) => setDropoffLocation(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Dátum</label>
            <input type="date" className="date-input" min={today} value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Időpont (24h)</label>
            <select className="date-input" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)}>
              {generateTimeOptions().map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="search-button-wrapper">
            <button type="submit" className="search-submit-btn">
              {isSearching ? 'Keresés...' : 'Elérhető Járművek Keresése'}
            </button>
          </div>
        </form>
      </div>

      {availableCars.length > 0 && (
        <div className="filter-container">
          <select className="category-filter" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">Minden Kategória</option>
            {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      )}

      <div className="results-section">
        <div className="results-grid">
          {filteredCars.map((car) => (
            <div key={car.id} className="car-card">
              <div className="car-image-container">
                <img src={car.image_url} alt={car.model} className="car-image" />
              </div>
              <div className="car-details">
                <h3 className="car-title">{car.brand} {car.model}</h3>
                <div className="car-footer">
                  <span className="car-price">${car.price_per_day}<span>/út</span></span>
                  <button onClick={() => handleBookCar(car)} className="book-now-btn">Foglalás Most</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer/>
    </div>
    </div>
  );
};

export default Taxi;