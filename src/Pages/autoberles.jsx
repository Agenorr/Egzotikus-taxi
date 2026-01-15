import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Navbar from "../Components/navbar";
import Footer from "../Components/footer";
import '../autoberles.css';

export default function Autoberles() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5183/api/vehicles') // file in public/
      .then((res) => res.json())
      .then((data) => setCars(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container car-container mt-5">
        <div className="row">
          {cars.map(car => {
            const primaryImage = car.images.find(img => img.isPrimary);

            return (
              <div className="col-md-4 mb-4" key={car.id}>
                <div
                  className="car-card position-relative text-white"
                  style={{
                    height: "300px", // adjust as needed
                    borderRadius: "0.5rem",
                    overflow: "hidden",
                    backgroundImage: primaryImage ? `url(${primaryImage.imageUrl})` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat"
                  }}
                >
                  {/* Optional dark overlay for readability */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      backgroundColor: "rgba(0, 0, 0, 0.4)"
                    }}
                  />

                  {/* Card content */}
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
