import React, { useState, useEffect } from "react";
import axios from 'axios';
import Navbar from "../Components/navbar";
import Footer from "../Components/footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../Css/Gallery.css";

export default function Gallery() {
  const [modalImg, setModalImg] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Exotic | Galéria";
  }, []);

  useEffect(() => {
    axios.get('https://localhost:7065/api/gallery')
      .then(res => {
        console.log("Full Data Received:", res.data);
        setImages(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Connection Error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Navbar />

      <section 
        id="home" 
        className="hero renting-hero text-center py-5 text-white" 
        style={{ background: `url(${require("../Img/galeria_kep.jpg")}) no-repeat center center / cover` }}
      >
        <div className="hero-fade"></div>

        <div className="hero-content">
          <h1 className="renting-hero-title">Galéria</h1>
          <div className="renting-hero-accent" />
          <p className="lead renting-hero-sub">
            Utazások és élmények, amelyeket ügyfeleink velünk éltek át.
          </p>
        </div>
      </section>

      <div className="container my-5">
        
        {/* === ITT VAN A TÖKÉLETESÍTETT CÍMSOR === */}
        <h2 className="text-center mb-4 gallery-section-title">
          Élményképek
        </h2>

        {loading ? (
          <div className="d-flex flex-column align-items-center justify-content-center py-5" style={{ minHeight: '300px' }}>
            <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Betöltés...</span>
            </div>
            <p className="mt-3 text-muted">Képek betöltése...</p>
          </div>
        ) : (
          <div className="gallery-container">
            {images.length > 0 ? (
              images.map((img) => (
                <div
                  key={img.id}
                  className="gallery-item"
                  data-bs-toggle="modal"
                  data-bs-target="#galleryModal"
                  onClick={() => setModalImg(img.imageUrl)}
                >
                  <img src={img.imageUrl} alt={img.title || "Galéria Kép"} />
                  {img.title && (
                    <div className="gallery-title-overlay">
                      {img.title}
                    </div>
                  )}
                  <div className="gallery-overlay">Kép megnézése</div>
                </div>
              ))
            ) : (
              <div className="text-center w-100 py-5">
                <p className="text-muted">Nincsenek elérhető képek a galériában.</p>
              </div>
            )}
          </div>
        )}

        <div className="cta-container">
          <button className="cta-btn" onClick={() => (window.location.href = "carRental")}>
            Tovább a bérléshez
          </button>
        </div>
      </div>

      <div className="modal fade" id="galleryModal" tabIndex="-1" aria-labelledby="galleryModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <img src={modalImg} alt="Nagyított Galéria Kép" id="modalImage" style={{ width: "100%" }} />
            </div>
          </div>
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