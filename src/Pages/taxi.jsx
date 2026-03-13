import Navbar from "../Components/navbar"
import Footer from "../Components/footer"
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import '../Css/Taxi.css'; 
import '../Css/Base.css';    

const Taxi = () => {
  const navigate = useNavigate(); // <-- Initialize navigate
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [availableCars, setAvailableCars] = useState([]);
  
  // CHANGED: State is now for category dropdown instead of text search
  const [selectedCategory, setSelectedCategory] = useState(''); 
  
  const [selectedCar, setSelectedCar] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      alert("Kérjük, válassza ki az átvétel és a visszavétel dátumát is.");
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
        category: car.category || 'Egyéb', // Fetching the category from the backend
        image_url: car.images && car.images.length > 0 ? car.images[0].imageUrl : '',
        price_per_day: car.pricePerDay || 0, 
        description: car.description || `${car.brand} ${car.model} - ${car.category}`
      }));

      setAvailableCars(formattedCars);

    } catch (error) {
      console.error("Hiba történt a járművek lekérdezésekor:", error);
      alert("Nem sikerült csatlakozni a szerverhez a járművek kereséséhez.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleBookCar = (car) => {
    if (!startDate || !endDate) {
      alert("Kérjük, válassza ki az átvétel és a visszavétel dátumát a keresőben a foglalás előtt!");
      return;
    }
    navigate('/book-taxi', { state: { car, startDate, endDate } });
  };



  // NEW: Dynamically get all unique categories from the fetched cars to populate the dropdown
  const uniqueCategories = [...new Set(availableCars.map(car => car.category).filter(Boolean))];

  // NEW: Filter based on the selected category from the dropdown
  const filteredCars = selectedCategory 
    ? availableCars.filter(car => car.category === selectedCategory)
    : availableCars;

  return (
    <div className="rentals-container">  <Navbar/>
      
      <div className="rentals-header">
        <h1 className="navbar-title rentals-title">Foglalja le Egzotikus Autóját</h1>
      </div>

      <div className="search-form-container">
        <form onSubmit={handleSearch} className="search-form">
          <div className="form-group">
            <label>Átvétel Dátuma</label>
            <input 
              type="date" 
              className="date-input" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Visszavétel Dátuma</label>
            <input 
              type="date" 
              className="date-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <div className="search-button-wrapper">
            <button type="submit" className="search-submit-btn">
              {isSearching ? 'Flotta Keresése...' : 'Elérhető Járművek Keresése'}
            </button>
          </div>
        </form>
      </div>

      {/* CHANGED: Text Input replaced with a Dropdown Filter */}
      {availableCars.length > 0 && (
        <div className="filter-container">
          <select 
            className="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Minden Kategória</option>
            {uniqueCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      )}

      {availableCars.length > 0 && (
        <div className="results-section">
          <div className="results-grid">
            {filteredCars.map((car) => (
              <div key={car.id} className="car-card">
                
                {/* CHANGED: Image wrapper now has a dark overlay that appears on hover */}
                <div className="car-image-container">
                  <img src={car.image_url} alt={car.model} className="car-image" />
                  
                  <div className="hover-overlay">
                    <h4 className="hover-car-name">{car.brand} {car.model}</h4>
                    <button onClick={() => handleBookCar(car)} className="hover-book-btn">
                      Tovább a lefoglaláshoz
                    </button>
                  </div>

                </div>

                <div className="car-details">
                  <h3 className="car-title">{car.brand} {car.model}</h3>
                  <p className="car-desc">{car.description}</p>
                  <div className="car-footer">
                    <span className="car-price">${car.price_per_day}<span>/nap</span></span>
                    <button onClick={() => handleBookCar(car)} className="book-now-btn">
                      Foglalás Most
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <Footer/>
    </div>
  );
};

export default Taxi;
