import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Navbar from "../Components/navbar";
import Footer from "../Components/footer";

export default function Autoberles() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetch("/car-cards.json") // file in public/
      .then((res) => res.json())
      .then((data) => setCars(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return (
    <div>
      <Navbar />

      <div className="container car-container mt-5">
        <div className="row">
          {cars.map((car, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="card">
                <img src={car.image} className="card-img-top" alt={car.name} />
                <div className="card-body">
                  <h5 className="card-title">{car.name}</h5>
                  <p className="card-text">{car.description}</p>
                </div>
              </div>
            </div>
          ))}
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
