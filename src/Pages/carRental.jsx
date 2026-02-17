import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Navbar from "../Components/navbar";
import Footer from "../Components/footer";
import "../Css/CarRental.css";


const categories = [
  {
    name: "All",
    label: "Összes autó",
    images: ["https://www.auto-data.net/images/f40/BMW-M5-Touring-G91_2.jpg", "/images/all2.jpg", "/images/all3.jpg"]
  },
  {
    name: "Hatchback",
    label: "Hatchback",
    images: ["/images/hatchback1.jpg", "/images/hatchback2.jpg", "/images/hatchback3.jpg"]
  },
  {
    name: "SUV",
    label: "SUV",
    images: ["https://www.auto-data.net/images/f99/Leapmotor-B10.jpg", "https://www.auto-data.net/images/f78/Renault-Filante.jpg", "https://www.auto-data.net/images/f79/Renault-Filante.jpg"]
  },
  {
    name: "Sedan",
    label: "Sedan",
    images: ["https://www.auto-data.net/images/f104/Alfa-Romeo-Giulia-952-facelift-2022_2.jpg", "https://www.auto-data.net/images/f74/Alfa-Romeo-Giulia-952-facelift-2022.jpg", "https://www.auto-data.net/images/f81/Alfa-Romeo-Giulia-952-facelift-2022.jpg"]
  },
  {
    name: "StationWagon",
    label: "Station wagon",
    images: ["https://www.auto-data.net/images/f99/Leapmotor-B10.jpg", "https://www.auto-data.net/images/f78/Renault-Filante.jpg", "https://www.auto-data.net/images/f79/Renault-Filante.jpg"]
  }
];

export default function CarRental() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cars, setCars] = useState([]);
  const [imageIndexes, setImageIndexes] = useState(categories.map(() => 0));

  // ================= FETCH CARS =================
  useEffect(() => {
    if (selectedCategory === null) return;


    // If "All" is selected, don't pass category
    /*const url =
      selectedCategory === "All"
        ? "https://localhost:7065/api/vehicles"
        : `https://localhost:7065/api/vehicles?category=${selectedCategory}`;
    */
    const url = "https://localhost:7065/api/vehicles";
    const params = selectedCategory === "All" ? {} : { category: selectedCategory}

    axios.get(url, {params})
      .then(res =>{
        setCars(res.data)
      })
      .catch(err =>{
        console.log("Axios error: ", err)
      })
  }, [selectedCategory]);

  // ================= ROTATE CATEGORY IMAGES =================
  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndexes(prev =>
        prev.map((idx, i) => (idx + 1) % categories[i].images.length)
      );
    }, 3000); // change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Navbar />

      {/* ================= CATEGORY SCREEN ================= */}
      {!selectedCategory && (
        <div className="container mt-5">
          <div className="row g-0">
            {categories.map((cat, i) => (
              <div
                className="car-card car-card-hover position-relative text-white col-md-4 mb-2" key={cat.name}
                style={{
                  height: "250px",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  backgroundImage: `url(${cat.images[imageIndexes[i]]})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease"
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
            ))}
          </div>
        </div>
      )}

      {/* ================= CAR LIST SCREEN ================= */}
      {selectedCategory && (
        <div className="container car-container mt-5">
          <button className="btn btn-outline-secondary mb-4 car-card car-card-hover" onClick={() => { setSelectedCategory(null); setCars([]); }} > ← Vissza a kategóriákhoz </button>
          {cars.map(car => {
            const primaryImage = car.images.find(img => img.isPrimary);

            return (
              <div className="car-card car-card-hover position-relative text-white" key={car.id}
                style={{
                  height: "300px",
                  backgroundImage: primaryImage ? `url(${primaryImage.imageUrl})` : undefined,
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
                  className="card-content position-absolute bottom-0 start-50 translate-middle-x p-3"
                  style={{ zIndex: 2 }}
                >
                  <h3 style={{ margin: "0px 0px 50px 0px" }}>{car.brand} {car.model}</h3>
                  <a href={`/cars/${car.id}`} className="btn btn-primary">Részletek</a>
                </div>
              </div>
            );
          })}
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
