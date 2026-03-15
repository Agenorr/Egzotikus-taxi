import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Navbar from "../Components/navbar";
import Footer from "../Components/footer";
import "../Css/carRental.css";

const categories = [
  {
    name: "All",
    label: "Összes autó",
    images: ["https://i0.wp.com/www.hesol.co.in/wp-content/uploads/2020/12/AUTOMOTIVE.jpg?fit=1500%2C938&ssl=1"]
  },
  {
    name: "Sedan",
    label: "Sedan",
    images: ["https://www.auto-data.net/images/f66/Bentley-Flying-Spur-IV.jpg", "https://www.auto-data.net/images/f42/Mercedes-Benz-E-class-W214.jpg", "https://www.auto-data.net/images/f109/Genesis-G80-II-facelift-2023.jpg"]
  },
  {
    name: "Coupe",
    label: "Coupe",
    images: ["https://www.auto-data.net/images/f87/BMW-M2-G87.jpg", "https://www.auto-data.net/images/f56/Lamborghini-Revuelto_2.jpg", "https://www.auto-data.net/images/f55/Porsche-911-992-facelift-2024.jpg"]
  },
  {
    name: "Hatchback",
    label: "Hatchback",
    images: ["https://www.auto-data.net/images/f107/Volkswagen-Golf-VIII_2.jpg", "https://www.auto-data.net/images/f46/Honda-Civic-Type-R-FL5.jpg", "https://www.auto-data.net/images/f33/Acura-Integra-V_2.jpg"]
  },
  {
    name: "Crossover",
    label: "Crossover",
    images: ["https://www.auto-data.net/images/f5/file9888950.jpg", "https://www.auto-data.net/images/f35/Renault-Koleos-II-Phase-II.jpg", "https://www.auto-data.net/images/f115/Subaru-Ascent-facelift-2023.jpg"]
  },
  {
    name: "SUV",
    label: "SUV",
    images: ["https://www.auto-data.net/images/f99/Leapmotor-B10.jpg", "https://www.auto-data.net/images/f78/Renault-Filante.jpg", "https://www.auto-data.net/images/f79/Renault-Filante.jpg"]
  },
  {
    name: "Luxury",
    label: "Luxury",
    images: ["https://www.auto-data.net/images/f99/Leapmotor-B10.jpg", "https://www.auto-data.net/images/f78/Renault-Filante.jpg", "https://www.auto-data.net/images/f79/Renault-Filante.jpg"]
  },
  {
    name: "Pickup",
    label: "Pickup",
    images: ["https://www.auto-data.net/images/f129/Ford-F-Series-F-150-XIV-SuperCrew-facelift-2023.jpg", "https://www.auto-data.net/images/f8/big1418.jpg", "https://www.auto-data.net/images/f69/Chevrolet-Silverado-1500-IV-Crew-Cab-Short-Box.jpg"]
  },
  {
    name: "Wagon",
    label: "Wagon",
    images: ["https://www.auto-data.net/images/f34/Volvo-XC90-II-facelift-2024_2.jpg", "https://www.auto-data.net/images/f16/file8366809.jpg", "https://www.auto-data.net/images/f109/Volkswagen-Passat-Variant-B9.jpg"]
  },
  {
    name: "Minivan",
    label: "Minivan",
    images: ["https://www.auto-data.net/images/f86/Mercedes-Benz-V-class-Long-facelift-2019_2.jpg", "https://www.auto-data.net/images/f58/Volkswagen-ID.Buzz-Long.jpg", "https://www.auto-data.net/images/f99/Lexus-LM-II.jpg"]
  }
];

export default function CarRental() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cars, setCars] = useState([]);
  const [imageIndexes, setImageIndexes] = useState(categories.map(() => 0));
  const [isFading, setIsFading] = useState(false);

  // --- FILTER STATES ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransmissions, setSelectedTransmissions] = useState([]);
  const [selectedDrivetrains, setSelectedDrivetrains] = useState([]);
  const [selectedFuel, setSelectedFuel] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // ================= FETCH CARS =================
  useEffect(() => {
    if (selectedCategory === null) return;

    const url = "https://localhost:7065/api/vehicles";
    const params = selectedCategory === "All" ? {} : { category: selectedCategory }

    axios.get(url, { params })
      .then(res => {
        setCars(res.data)
      })
      .catch(err => {
        console.log("Axios error: ", err)
      })
  }, [selectedCategory]);

  // ================= ROTATE CATEGORY IMAGES =================
  useEffect(() => {
    const interval = setInterval(() => {
      document.querySelectorAll(".bg-img.current").forEach(el => {
        el.classList.add("fade-out");
      });
      document.querySelectorAll(".bg-img.next").forEach(el => {
        el.classList.add("fade-in");
      });
      setTimeout(() => {
        setImageIndexes(prev =>
          prev.map((idx, i) => (idx + 1) % categories[i].images.length)
        );
        document.querySelectorAll(".bg-img").forEach(el => {
          el.classList.remove("fade-in", "fade-out");
        });
      }, 500);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // ================= FILTERING LOGIC =================
  const filteredCars = cars.filter(car => {
    const matchesSearch =
      (car.brand && car.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (car.model && car.model.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTransmission =
      selectedTransmissions.length === 0 ||
      selectedTransmissions.includes(car.transmission);

    const matchesDrivetrain =
      selectedDrivetrains.length === 0 ||
      selectedDrivetrains.includes(car.drivetrain);

    const matchesFuel =
      selectedFuel.length === 0 ||
      selectedFuel.includes(car.fuel);

    const matchesSeats =
      selectedSeats.length === 0 ||
      selectedSeats.includes(String(car.seats));

    return matchesSearch && matchesTransmission && matchesDrivetrain && matchesFuel && matchesSeats;
  });

  const toggleFilter = (list, setList, value) => {
    setList(prev => prev.includes(value) ? prev.filter(i => i !== value) : [...prev, value]);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedTransmissions([]);
    setSelectedDrivetrains([]);
    setSelectedFuel([]);
    setSelectedSeats([]);
  };

  const handleCategoryClick = (categoryName) => {
    setIsFading(true);
    setTimeout(() => {
      setSelectedCategory(categoryName);
      setIsFading(false);
    }, 300);
  };

  const handleBackClick = () => {
    setIsFading(true);
    setTimeout(() => {
      setSelectedCategory(null);
      setCars([]);
      handleClearFilters();
      setShowAdvancedFilters(false);
      setIsFading(false);
    }, 300);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      {/* Sötétítő réteg, ami lefedi az oldalt az áttűnés alatt */}
      <div className={`black-fade-overlay ${isFading ? 'active' : ''}`} />

      {/* A tartalom wrapperje megkapta a page-transition-t, így el is halványul */}
      <div className={`flex-grow-1 d-flex flex-column page-transition ${isFading ? 'page-hidden' : ''}`}>

        {/* ================= CATEGORY SCREEN ================= */}
        {!selectedCategory && (
          <div className="container mt-5 mb-5">
            <div className="row w-100 mx-0">
              {categories.map((cat, i) => (
                <div
                  className="car-card car-card-hover position-relative text-white col-md-4 mb-2 p-1"
                  key={cat.name}
                  style={{
                    height: "250px",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    border: "none"
                  }}
                  onClick={() => handleCategoryClick(cat.name)}
                >
                  <div className="bg-fader">
                    <div
                      className="bg-img current"
                      style={{ backgroundImage: `url(${cat.images[imageIndexes[i]]})` }}
                    />
                    <div
                      className="bg-img next"
                      style={{ backgroundImage: `url(${cat.images[(imageIndexes[i] + 1) % cat.images.length]})` }}
                    />
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: "rgba(0,0,0,0.5)",
                      borderRadius: "0.5rem"
                    }}
                  />
                  <div className="position-absolute top-50 start-50 translate-middle">
                    <h2>{cat.label}</h2>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= CAR LIST SCREEN ================= */}
        {selectedCategory && (
          <div className="container mt-5 mb-5">
            <div className="row w-100 mx-0">

              {/* LEFT COLUMN: Controls & Filters */}
              <div className="col-md-4 col-lg-3 px-2 mb-4">
                <div style={{ position: "sticky", top: "20px" }}>

                  {/* Vissza gomb */}
                  <button
                    className="btn w-100 p-3 mb-4 no-focus-ring back-to-categories-btn"
                    onClick={handleBackClick}
                  >
                    ← Vissza a kategóriákhoz
                  </button>

                  {/* FILTER PANEL */}
                  <div className="filter-panel-custom p-4 shadow">

                    {/* Fejléc */}
                    <div className="d-flex justify-content-between align-items-center mb-4 border-bottom-gold pb-2">
                      <h4 className="filter-title m-0">SZŰRÉS</h4>
                      <span className="badge text-dark py-1 px-2 rounded-1" style={{ backgroundColor: "#DAA520", fontWeight: "bold" }}>
                        {filteredCars.length} találat
                      </span>
                    </div>

                    {/* Gyorskereső */}
                    <div className="mb-4">
                      <label className="filter-section-title mb-2 d-block">GYORSKERESŐ</label>
                      <input type="text" className="form-control filter-input shadow-none"
                        placeholder="Márka vagy típus..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>

                    {/* Motor (Felkerült alapból láthatóra) */}
                    <div className="mb-4">
                      {/* Optional: You can keep it as MOTOR or change it to ÜZEMANYAG */}
                      <label className="filter-section-title mb-2 d-block">ÜZEMANYAG / MOTOR</label>
                      {[
                        { id: 'Petrol', label: 'Benzin' },
                        { id: 'Diesel', label: 'Dízel' },
                        { id: 'Hybrid', label: 'Hibrid' },
                        { id: 'Electric', label: 'Elektromos' }
                      ].map(fuel => (
                        <div className="form-check d-flex align-items-center mb-2" key={fuel.id}>
                          <input
                            className="form-check-input white-checkbox me-2"
                            type="checkbox"
                            id={`fuel-${fuel.id}`}
                            checked={selectedFuel.includes(fuel.id)}
                            onChange={() => toggleFilter(selectedFuel, setSelectedFuel, fuel.id)}
                          />
                          <label className="form-check-label text-white small" htmlFor={`fuel-${fuel.id}`}>
                            {fuel.label}
                          </label>
                        </div>
                      ))}
                    </div>

                    {/* Haladó szűrők lenyíló része - ANIMÁLVA */}
                    <div className={`advanced-filters-wrapper ${showAdvancedFilters ? 'open' : ''}`}>
                      <hr className="filter-divider" />

                      {/* Váltó (Lekerült a haladó szűrők közé) */}
                      <div className="mb-4">
                        <label className="filter-section-title mb-2 d-block">VÁLTÓ</label>
                        {['Automata', 'Manuális'].map(type => (
                          <div className="form-check d-flex align-items-center mb-2" key={type}>
                            <input className="form-check-input white-checkbox me-2" type="checkbox" id={`trans-${type}`}
                              checked={selectedTransmissions.includes(type)} onChange={() => toggleFilter(selectedTransmissions, setSelectedTransmissions, type)} />
                            <label className="form-check-label text-white small" htmlFor={`trans-${type}`}>{type}</label>
                          </div>
                        ))}
                      </div>

                      {/* Hajtás */}
                      <div className="mb-4">
                        <label className="filter-section-title mb-2 d-block">HAJTÁS</label>
                        {['FWD', 'RWD', 'AWD'].map(type => (
                          <div className="form-check d-flex align-items-center mb-2" key={type}>
                            <input className="form-check-input white-checkbox me-2" type="checkbox" id={`drive-${type}`}
                              checked={selectedDrivetrains.includes(type)} onChange={() => toggleFilter(selectedDrivetrains, setSelectedDrivetrains, type)} />
                            <label className="form-check-label text-white small" htmlFor={`drive-${type}`}>{type}</label>
                          </div>
                        ))}
                      </div>

                      {/* Ülések száma */}
                      <div className="mb-4">
                        <label className="filter-section-title mb-2 d-block">ÜLÉSEK SZÁMA</label>
                        {['2', '4', '5', '7'].map(seat => (
                          <div className="form-check d-flex align-items-center mb-2" key={seat}>
                            <input className="form-check-input white-checkbox me-2" type="checkbox" id={`seat-${seat}`}
                              checked={selectedSeats.includes(seat)} onChange={() => toggleFilter(selectedSeats, setSelectedSeats, seat)} />
                            <label className="form-check-label text-white small" htmlFor={`seat-${seat}`}>{seat} ülés</label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Lenyíló Gomb */}
                    <div className="text-center mb-4 mt-3">
                      <button
                        className="btn btn-link text-decoration-none shadow-none toggle-btn-text p-0 no-focus-ring"
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                      >
                        {showAdvancedFilters ? "▲ Kevesebb szűrő" : "▼ További szűrők"}
                      </button>
                    </div>

                    {/* Szűrők törlése */}
                    <button
                      className="btn w-100 clear-btn-outline no-focus-ring"
                      onClick={handleClearFilters}
                    >
                      Szűrés törlése
                    </button>

                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Results Grid */}
              <div className="col-md-8 col-lg-9 px-4 position-relative" style={{ borderLeft: "1px dashed #DAA520" }}>
                <div className="row g-4">
                  {filteredCars.length > 0 ? (
                    filteredCars.map(car => {
                      const primaryImage = car.images?.find(img => img.isPrimary) || car.images?.[0];
                      return (
                        <div className="col-12 col-md-6 col-xl-4" key={car.id}>
                          <div className="car-card car-card-hover position-relative text-white w-100"
                            style={{
                              height: "300px",
                              backgroundImage: primaryImage ? `url(${primaryImage.imageUrl})` : 'none',
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              borderRadius: "0.5rem",
                              overflow: "hidden"
                            }}
                          >
                            <div style={{ position: "absolute", inset: "5%", backgroundColor: "rgba(0,0,0,0.5)", borderRadius: "0.5rem" }} />
                            <div className="card-content position-absolute bottom-0 start-50 translate-middle-x p-3 w-100 text-center" style={{ zIndex: 2 }}>
                              <h4 className="mb-5" style={{ textShadow: "0px 2px 4px rgba(0,0,0,0.8)" }}>{car.brand} {car.model}</h4>
                              <Link to={`/CarRental/${car.id}`} className="btn btn-primary no-focus-ring" style={{ backgroundColor: "#e65100", borderColor: "#e65100" }}>
                                Részletek
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-12 text-center mt-5">
                      <h4 className="text-muted">Nincs a szűrésnek megfelelő autó.</h4>
                      <button className="btn btn-link no-focus-ring" style={{ color: "#DAA520" }} onClick={handleClearFilters}>Összes autó megjelenítése</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
