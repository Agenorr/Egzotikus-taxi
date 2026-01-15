import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Navbar from "../Components/navbar";
import Footer from "../Components/footer";
import "../autoberles.css";

const categories = [
  {name: "All", label: "Összes autó", image: "/images/all.jpg"},
  { name: "Hatchback", label: "Hatchback", image: "/images/hatchback.jpg" },
  { name: "SUV", label: "SUV", image: "/images/suv.jpg" },
  { name: "Sedan", label: "Sedan", image: "/images/sedan.jpg" }
];

export default function Autoberles() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  if (selectedCategory === null) return;

  setLoading(true);

  // If "All" is selected, don't pass category
  const url =
    selectedCategory === "All"
      ? "http://localhost:5183/api/vehicles"
      : `http://localhost:5183/api/vehicles?category=${selectedCategory}`;

  fetch(url)
    .then(res => res.json())
    .then(data => setCars(data))
    .catch(err => console.error("Fetch error:", err))
    .finally(() => setLoading(false));
}, [selectedCategory]);


  return (
    <div>
      <Navbar />

      {/* ================= CATEGORY SCREEN ================= */}
      {!selectedCategory && (
        <div className="container mt-5">
          <div className="row">
            {categories.map(cat => (
              <div className="col-md-4 mb-4" key={cat.name}>
                <div
                  className="car-card position-relative text-white"
                  style={{
                    height: "250px",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    backgroundImage: `url(${cat.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                  }}
                  onClick={() => setSelectedCategory(cat.name)}
                >
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
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= CAR LIST SCREEN ================= */}
      {selectedCategory && (
        <div className="container car-container mt-5">
          <button
            className="btn btn-outline-secondary mb-4"
            onClick={() => {
              setSelectedCategory(null);
              setCars([]);
            }}
          >
            ← Vissza a kategóriákhoz
          </button>

          <h2 className="mb-4">{selectedCategory}</h2>

          {loading && <p>Kérjök várjon...</p>}

          <div className="row">
            {cars.map(car => {
              const primaryImage = car.images.find(img => img.isPrimary);

              return (
                <div className="col-md-4 mb-4" key={car.id}>
                  <div
                    className="car-card position-relative text-white"
                    style={{
                      height: "300px",
                      borderRadius: "0.5rem",
                      overflow: "hidden",
                      backgroundImage: primaryImage
                        ? `url(${primaryImage.imageUrl})`
                        : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center"
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        width: "90%",
                        height: "90%",
                        backgroundColor: "rgba(0,0,0,0.4)",
                        transform: "translate(-50%, -50%)",
                        borderRadius: "0.5rem"
                      }}
                    />

                    <div
                      className="card-content position-absolute bottom-0 p-3"
                      style={{ zIndex: 2 }}
                    >
                      <h3>{car.brand} {car.model}</h3>
                      <p>{car.description}</p>
                      <a href={`/cars/${car.id}`} className="btn btn-primary">
                        Részletek
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= INFO SECTION ================= */}
      <div className="container mt-5 mb-5">
        <div className="row text-center">
          <div className="col-md-4">
            <i className="fa fa-car fa-3x mb-3" />
            <h5>Különleges flotta</h5>
            <p>Magas minőségű kabrióktól a hyperautókig</p>
          </div>
          <div className="col-md-4">
            <i className="fa fa-phone fa-3x mb-3" />
            <h5>Rugalmas ügyfélszolgálat</h5>
            <p>7-24 rendelkezésére állunk</p>
          </div>
          <div className="col-md-4">
            <i className="fa fa-heart fa-3x mb-3" />
            <h5>Kivételes szolgáltatás</h5>
            <p>Nincsenek rejtett költségek</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
