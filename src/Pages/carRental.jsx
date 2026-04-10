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
    images: ["https://www.auto-data.net/images/f17/lamborghini-urus.jpg", "https://www.auto-data.net/images/f85/BMW-X7-G07-facelift-2022_4.jpg", "https://www.auto-data.net/images/f110/Cadillac-Escalade-IQ.jpg"]
  },
  {
    name: "Luxury",
    label: "Luxury",
    images: ["https://www.auto-data.net/images/f100/Rolls-Royce-Phantom-VIII-Extended-Wheelbase.jpg", "https://www.auto-data.net/images/f73/Bugatti-La-Voiture-Noire.jpg", "https://www.auto-data.net/images/f77/Mercedes-Benz-S-class-Long-V223-facelift-2026.jpg"]
  },
  {
    name: "Pickup",
    label: "Pickup",
    images: ["https://www.auto-data.net/images/f126/Ford-Ranger-V-SuperCrew-Americas_2.jpg", "https://www.auto-data.net/images/f33/Jeep-Gladiator-JT-facelift-2023_4.jpg", "https://www.auto-data.net/images/f38/Chevrolet-Silverado-3500-HD-IV-T1XX-facelift-2024-Crew-Cab-Long-Bed.jpg"]
  },
  {
    name: "Wagon",
    label: "Wagon",
    images: ["https://www.auto-data.net/images/f99/Skoda-Superb-IV.jpg", "https://www.auto-data.net/images/f80/Volkswagen-Passat-Variant-B9.jpg", "https://www.auto-data.net/images/f49/Audi-RS6-Avant-C8.jpg"]
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

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransmissions, setSelectedTransmissions] = useState([]);
  const [selectedDrivetrains, setSelectedDrivetrains] = useState([]);
  const [selectedFuel, setSelectedFuel] = useState([]);

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    document.title = "Exotic | Autóbérlés";
  }, []);

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

  const filteredCars = cars.filter(car => {
    const isAvailable = car.status === 1;

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

    return isAvailable && matchesSearch && matchesTransmission && matchesDrivetrain && matchesFuel;
  });

  const toggleFilter = (list, setList, value) => {
    setList(prev => prev.includes(value) ? prev.filter(i => i !== value) : [...prev, value]);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedTransmissions([]);
    setSelectedDrivetrains([]);
    setSelectedFuel([]);
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
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: "#1a1a1a" }}>
      <Navbar />

      <div className={`black-fade-overlay ${isFading ? 'active' : ''}`} />

      <div className={`flex-grow-1 d-flex flex-column page-transition ${isFading ? 'page-hidden' : ''}`}>

        <section className="carrental-hero w-100">
          <div className="carrental-hero-content">
            <h1 className="carrental-hero-title">Prémium Autóbérlés</h1>
            <div className="carrental-hero-accent" />
            <p className="carrental-hero-sub">
              Találja meg az Ön számára tökéletes luxusautót kínálatunkban.
            </p>
          </div>
        </section>

        {!selectedCategory && (
          <div className="container mt-4 mb-5">
            <h2 className="text-center mb-5" style={{ color: '#DAA520', fontWeight: 'bold', letterSpacing: '1px' }}>Válasszon Kategóriát</h2>
            <div className="row w-100 mx-0">
              {categories.map((cat, i) => (
                <div
                  className="car-card car-card-hover position-relative text-white col-md-4 mb-3 p-1 mx-auto"
                  key={cat.name}
                  style={{
                    height: "250px",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    border: "1px solid #333"
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
                      backgroundColor: "rgba(0,0,0,0.6)",
                      borderRadius: "0.5rem"
                    }}
                  />
                  
                  <div className="position-absolute top-50 start-50 translate-middle w-100" style={{ zIndex: 2 }}>
                    <h2 style={{ textShadow: "2px 2px 10px rgba(0,0,0,1), -1px -1px 4px rgba(0,0,0,0.8)", letterSpacing: "2px", fontWeight: "bold" }}>{cat.label}</h2>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedCategory && (
          <div className="container mt-4 mb-5">
            <div className="row w-100 mx-0">

              <div className="col-md-4 col-lg-3 px-2 mb-4">
                <div style={{ position: "sticky", top: "20px" }}>

                  <button
                    className="btn w-100 p-3 mb-4 no-focus-ring back-to-categories-btn shadow-sm"
                    onClick={handleBackClick}
                  >
                    <i className="fa fa-arrow-left me-2"></i> Vissza a kategóriákhoz
                  </button>

                  <div className="filter-panel-custom p-4 shadow-lg">

                    <div className="d-flex justify-content-between align-items-center mb-4 border-bottom-gold pb-2">
                      <h4 className="filter-title m-0">SZŰRÉS</h4>
                      <span className="badge text-dark py-1 px-2 rounded-1" style={{ backgroundColor: "#DAA520", fontWeight: "bold" }}>
                        {filteredCars.length} találat
                      </span>
                    </div>

                    <div className="mb-4">
                      <label className="filter-section-title mb-2 d-block">GYORSKERESŐ</label>
                      <input type="text" className="form-control filter-input shadow-none p-2"
                        placeholder="Márka vagy típus..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>

                    <div className="mb-4">
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

                    <div className={`advanced-filters-wrapper ${showAdvancedFilters ? 'open' : ''}`}>
                      <hr className="filter-divider" />

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
                    </div>

                    <div className="text-center mb-4 mt-3">
                      <button
                        className="btn btn-link text-decoration-none shadow-none toggle-btn-text p-0 no-focus-ring"
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                      >
                        {showAdvancedFilters ? "▲ Kevesebb szűrő" : "▼ További szűrők"}
                      </button>
                    </div>

                    <button
                      className="btn w-100 clear-btn-outline no-focus-ring"
                      onClick={handleClearFilters}
                    >
                      Szűrés törlése
                    </button>

                  </div>
                </div>
              </div>

              <div className="col-md-8 col-lg-9 px-4 position-relative" style={{ borderLeft: "1px dashed #444" }}>
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
                              borderRadius: "8px",
                              overflow: "hidden"
                            }}
                          >
                            <div className="card-fade-bottom"></div>
                            
                            <div className="card-content position-absolute bottom-0 start-50 translate-middle-x w-100 text-center pb-5" style={{ zIndex: 2 }}>
                              <h4 className="mb-4" style={{ textShadow: "2px 2px 10px rgba(0,0,0,1), -1px -1px 4px rgba(0,0,0,0.8)", fontWeight: "bold" }}>{car.brand} {car.model}</h4>
                            </div>
                            
                            <Link to={`/CarRental/${car.id}`} className="btn no-focus-ring">
                              Részletek
                            </Link>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-12 text-center mt-5 p-5" style={{ backgroundColor: "#222", borderRadius: "8px", border: "1px solid #333" }}>
                      <i className="fa fa-car fa-3x mb-3" style={{ color: "#777" }}></i>
                      <h4 style={{ color: "#fff", textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}>Nincs a szűrésnek megfelelő autó.</h4>
                      <button className="btn btn-link no-focus-ring mt-2" style={{ color: "#DAA520", fontWeight: "bold" }} onClick={handleClearFilters}>Összes autó megjelenítése</button>
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
