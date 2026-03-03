import { useEffect, useState } from "react";
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

  // ================= ROTATE CATEGORY IMAGES (SMOOTH) =================
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

  const handleCategoryClick = (categoryName) => {
    setIsFading(true); // Start fade out
    setTimeout(() => {
      setSelectedCategory(categoryName); // Change page content
      setIsFading(false); // Start fade in
    }, 300); // Wait 300ms (matches the CSS transition duration)
  };

  const handleBackClick = () => {
    setIsFading(true); // Start fade out
    setTimeout(() => {
      setSelectedCategory(null); // Change page content
      setCars([]); // Clear cars
      setIsFading(false); // Start fade in
    }, 300); // Wait 300ms
  };

  return (
    <div>
      <Navbar />

      {/* === THE GLOBAL BLACK FADE OVERLAY === */}
      <div className={`black-fade-overlay ${isFading ? 'active' : ''}`} />

      {/* ================= CATEGORY SCREEN ================= */}
      {!selectedCategory && (
        <div className="container mt-5">
          <div className="row g-0">
            {categories.map((cat, i) => (
              <div
                className="car-card car-card-hover position-relative text-white col-md-4 mb-2"
                key={cat.name}
                style={{
                  height: "250px",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease"
                }}
                onClick={() => handleCategoryClick(cat.name)}
              >

                {/* FADE BACKGROUND */}
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
        <div className="container mt-5">
          <div className="row">

            {/* LEFT COLUMN: Back Button */}
            <div className="col-md-3 col-lg-2 mb-4">
              <button
                className="btn btn-outline-secondary w-100 p-3"
                onClick={handleBackClick}
                style={{
                  position: "sticky",
                  top: "20px",
                  fontWeight: "bold"
                }}
              >
                ← Vissza
              </button>
            </div>

            {/* RIGHT COLUMN: Cars Grid with Left Border */}
            <div className="col-md-9 col-lg-10" style={{ borderLeft: "2px dashed #DAA520", paddingLeft: "30px" }}>

              {/* INNER BOOTSTRAP GRID FOR CARDS */}
              <div className="row g-4">
                {cars.map(car => {
                  // Fallback in case a car has no images to prevent crashes
                  const primaryImage = car.images?.find(img => img.isPrimary) || car.images?.[0];

                  return (
                    /* Each card takes up half the space on medium screens, and a third on extra-large screens */
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
                        {/* Dark Overlay */}
                        <div
                          style={{
                            position: "absolute",
                            inset: "5%", /* Automatically creates the 90% width/height centered effect */
                            backgroundColor: "rgba(0,0,0,0.5)",
                            borderRadius: "0.5rem"
                          }}
                        />
                        {/* Content */}
                        <div
                          className="card-content position-absolute bottom-0 start-50 translate-middle-x p-3 w-100 text-center"
                          style={{ zIndex: 2 }}
                        >
                          <h4 className="mb-5" style={{ textShadow: "0px 2px 4px rgba(0,0,0,0.8)" }}>{car.brand} {car.model}</h4>
                          <a href={`/cars/${car.id}`} className="btn btn-primary" style={{ backgroundColor: "#e65100", borderColor: "#e65100" }}>
                            Részletek
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}