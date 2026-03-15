import Navbar from "../Components/navbar"
import Footer from "../Components/footer"
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import '../Css/Taxi.css';
import '../Css/Base.css';

const Taxi = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [availableCars, setAvailableCars] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCar, setSelectedCar] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    document.title = "Exotic | Taxi Rendelés";
  }, []);

  // FOOLPROOF CALENDAR: Get today's date in YYYY-MM-DD format based on local time
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const today = `${year}-${month}-${day}`;

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
        category: car.category || 'Egyéb',
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

  const uniqueCategories = [...new Set(availableCars.map(car => car.category).filter(Boolean))];

  const filteredCars = selectedCategory
    ? availableCars.filter(car => car.category === selectedCategory)
    : availableCars;

  return (
    <div>
      <Navbar />
      <div className="rentals-container">

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
                min={today} // <-- Prevents picking past dates
                onChange={(e) => {
                  const newStartDate = e.target.value;
                  setStartDate(newStartDate);
                  // <-- Auto-adjust endDate if the new startDate pushes past it
                  if (endDate && newStartDate > endDate) {
                    setEndDate(newStartDate);
                  }
                }}
                required
              />
            </div>
            <div className="form-group">
              <label>Visszavétel Dátuma</label>
              <input
                type="date"
                className="date-input"
                value={endDate}
                min={startDate || today} // <-- End date can never be before start date (or today)
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

      </div>
      <Footer />
    </div>
  );
};

export default Taxi;