import Navbar from "../Components/navbar"
import Footer from "../Components/footer"
import React, { useState } from 'react';
import '../Css/Taxi.css'; // Make sure to import the new CSS file
import '../Css/Base.css';    // Keep Base.css if it has global navbar/footer styles you need

const Taxi = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [availableCars, setAvailableCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // MOCK BACKEND
  const mockDatabaseCars = [
    {
      id: 4,
      brand: 'BMW',
      model: 'M5 G90 Hybrid',
      price_per_day: 850.00,
      image_url: 'https://www.auto-data.net/images/f111/BMW-M5-G90_4.jpg',
      description: 'The ultimate executive performance sedan with a new V8 plug-in hybrid system.',
    },
    {
      id: 5,
      brand: 'Porsche',
      model: '911 GT3 (992.2)',
      price_per_day: 950.00,
      image_url: 'https://www.auto-data.net/images/f60/Porsche-911-992-facelift-2024.jpg',
      description: 'A track-focused legend with a screaming naturally aspirated flat-six engine.',
    },
    {
      id: 7,
      brand: 'Lamborghini',
      model: 'Urus SE Hybrid',
      price_per_day: 1200.00,
      image_url: 'https://www.auto-data.net/images/f56/Lamborghini-Urus-facelift-2024.jpg',
      description: 'The fastest Super SUV in the world, now with high-performance electric aid.',
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    setIsSearching(true);

    setTimeout(() => {
      setAvailableCars(mockDatabaseCars);
      setIsSearching(false);
    }, 800);
  };

  const handleBookCar = (car) => {
    setSelectedCar(car);
    alert(`You have initiated a booking for the ${car.brand} ${car.model} from ${startDate} to ${endDate}.`);
  };

  return (
    <div className="rentals-container">  <Navbar/>
      
      <div className="rentals-header">
        <h1 className="navbar-title rentals-title">Reserve Your Exotic</h1>
      </div>

      <div className="search-form-container">
        <form onSubmit={handleSearch} className="search-form">
          <div className="form-group">
            <label>Pick-up Date</label>
            <input 
              type="date" 
              className="date-input" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Return Date</label>
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
              {isSearching ? 'Searching Fleet...' : 'Find Available Vehicles'}
            </button>
          </div>
        </form>
      </div>

      {availableCars.length > 0 && (
        <div className="results-section">
          <div className="results-grid">
            {availableCars.map((car) => (
              <div key={car.id} className="car-card">
                <img src={car.image_url} alt={car.model} className="car-image" />
                <div className="car-details">
                  <h3 className="car-title">{car.brand} {car.model}</h3>
                  <p className="car-desc">{car.description}</p>
                  <div className="car-footer">
                    <span className="car-price">${car.price_per_day}<span>/day</span></span>
                    <button onClick={() => handleBookCar(car)} className="book-now-btn">
                      Book Now
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

