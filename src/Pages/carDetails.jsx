import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../Components/navbar";
import Footer from "../Components/footer";

export default function CarDetails() {
  const { id } = useParams(); 
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`https://localhost:7065/api/vehicles/${id}`)
      .then(res => {
        setCar(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching car:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <h2 className="text-center mt-5">Betöltés...</h2>;
  if (!car) return <h2 className="text-center mt-5">Az autó nem található.</h2>;

  const primaryImage = car.images?.find(img => img.isPrimary)?.imageUrl || car.images?.[0]?.imageUrl;

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Navbar />
      
      <div className="container mt-5 mb-5">
        <Link to="/CarRental" className="btn btn-outline-secondary mb-4 font-weight-bold">
          ← Vissza a kínálathoz
        </Link>

        <div className="row g-5">
          {/* LEFT SIDE: Image & Description */}
          <div className="col-lg-7">
            {primaryImage ? (
              <img 
                src={primaryImage} 
                alt={`${car.brand} ${car.model}`} 
                className="img-fluid rounded shadow mb-4"
                style={{ width: "100%", maxHeight: "500px", objectFit: "cover" }}
              />
            ) : (
              <div className="bg-secondary rounded mb-4" style={{ height: "400px" }}></div>
            )}
            
            <div className="bg-white p-4 rounded shadow-sm">
              <h4 className="mb-3">Leírás</h4>
              <p className="lead" style={{ fontSize: "1.1rem", color: "#555" }}>
                {car.description || "Nincs elérhető leírás ehhez a járműhöz."}
              </p>
              
              {car.extras && (
                <>
                  <h5 className="mt-4 mb-2">Extrák:</h5>
                  <p className="text-muted">{car.extras}</p>
                </>
              )}
            </div>
          </div>

          {/* RIGHT SIDE: Tech Specs & Booking */}
          <div className="col-lg-5">
            <div className="bg-white p-4 rounded shadow-sm mb-4">
              <h1 className="mb-1">{car.brand} {car.model}</h1>
              <h5 className="text-muted mb-4">{car.category} • Évjárat: {car.year}</h5>
              
              <h2 className="text-warning font-weight-bold mb-4">
                {car.pricePerDay?.toLocaleString('hu-HU')} Ft <span className="text-muted" style={{ fontSize: "1rem" }}>/ nap</span>
              </h2>

              <button className="btn btn-primary btn-lg w-100 mb-4" style={{ backgroundColor: "#e65100", borderColor: "#e65100", fontWeight: "bold" }}>
                Bérlés indítása
              </button>

              <hr />

              <h4 className="mb-3 mt-3">Műszaki Adatok</h4>
              <div className="row">
                <div className="col-6 mb-3">
                  <small className="text-muted d-block">Teljesítmény</small>
                  <strong>{car.hp ? `${car.hp} LE` : "N/A"}</strong>
                </div>
                <div className="col-6 mb-3">
                  <small className="text-muted d-block">Nyomaték</small>
                  <strong>{car.torque ? `${car.torque} Nm` : "N/A"}</strong>
                </div>
                <div className="col-6 mb-3">
                  <small className="text-muted d-block">Gyorsulás (0-100)</small>
                  <strong>{car.acceleration ? `${car.acceleration} mp` : "N/A"}</strong>
                </div>
                <div className="col-6 mb-3">
                  <small className="text-muted d-block">Végsebesség</small>
                  <strong>{car.topSpeed ? `${car.topSpeed} km/h` : "N/A"}</strong>
                </div>
                <div className="col-6 mb-3">
                  <small className="text-muted d-block">Hajtás</small>
                  <strong>{car.drive || "N/A"}</strong>
                </div>
                <div className="col-6 mb-3">
                  <small className="text-muted d-block">Váltó</small>
                  <strong>{car.transmission || "N/A"}</strong>
                </div>
              </div>

              <hr />

              <h4 className="mb-3 mt-3">Felszereltség</h4>
              <div className="row">
                <div className="col-6 mb-3">
                  <small className="text-muted d-block">Külső Szín</small>
                  <strong>{car.exteriorColor || "N/A"}</strong>
                </div>
                <div className="col-6 mb-3">
                  <small className="text-muted d-block">Belső Tér</small>
                  <strong>{car.interior || "N/A"}</strong>
                </div>
                <div className="col-6 mb-3">
                  <small className="text-muted d-block">Kerekek</small>
                  <strong>{car.wheelStyle || "N/A"}</strong>
                </div>
                <div className="col-6 mb-3">
                  <small className="text-muted d-block">Súly</small>
                  <strong>{car.weight ? `${car.weight} kg` : "N/A"}</strong>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}