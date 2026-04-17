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
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: "#1a1a1a", color: "#fff" }}>
      <Navbar />

      <section
        id="home"
        className="gallery-hero text-center text-white"
        style={{ background: `url(${require("../Img/galeria_kep.jpg")}) no-repeat center center / cover` }}
      >
        <div className="gallery-hero-fade"></div>

        <div className="hero-content">
          <h1 className="gallery-hero-title">Galéria</h1>
          <div className="gallery-hero-accent" />
          <p className="gallery-hero-sub">
            Utazások és élmények, amelyeket ügyfeleink velünk éltek át.
          </p>
        </div>
      </section>

      <div className="container my-5 flex-grow-1">

        <h2 className="text-center mb-5 gallery-section-title">
          Élményképek
        </h2>

        {loading ? (
          <div className="d-flex flex-column align-items-center justify-content-center py-5" style={{ minHeight: '300px' }}>
            <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem', color: '#DAA520' }}>
              <span className="visually-hidden">Betöltés...</span>
            </div>
            <p className="mt-3" style={{ color: '#bbb' }}>Képek betöltése...</p>
          </div>
        ) : images.length > 0 ? (
          // Ha vannak képek, akkor betesszük a Grid containerbe
          <div className="gallery-container">
            {images.map((img) => (
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
            ))}
          </div>
        ) : (
          // Ha nincsenek képek, a Gird-en KÍVÜL jelenítjük meg, így tökéletesen középen lesz
          <div className="d-flex justify-content-center align-items-center w-100 py-5" style={{ minHeight: '200px' }}>
            <p style={{ color: '#bbb', fontSize: '1.1rem' }}>Nincsenek elérhető képek a galériában.</p>
          </div>
        )}

        <div className="cta-container">
          <button className="cta-btn" onClick={() => (window.location.href = "carRental")}>
            Tovább a bérléshez
          </button>
        </div>
      </div>

      <div className="modal fade" id="galleryModal" tabIndex="-1" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered modal-xl">
    <div 
      className="modal-content mx-auto" 
      style={{ 
        backgroundColor: "transparent", 
        border: "none", 
        // EZ A KULCS: a tároló csak akkora lesz, mint a kép
        width: "fit-content", 
        boxShadow: "none" 
      }}
    >
      <div className="modal-body p-0 position-relative">
        
        {/* Bezáró gomb (X) */}
        <button 
          type="button" 
          className="btn-close btn-close-white position-absolute top-0 end-0 m-3" 
          data-bs-dismiss="modal" 
          aria-label="Close" 
          style={{ 
            zIndex: 11, 
            filter: "drop-shadow(0 0 5px black)",
            opacity: 0.8 
          }}
        ></button>
        
        {/* A KÉP */}
        <img 
          src={modalImg} 
          alt="Nagyított kép" 
          style={{ 
            maxWidth: "95vw",    // Ne lógjon ki széltében
            maxHeight: "90vh",   // Ne lógjon ki magasságban
            display: "block",    // Eltünteti az alsó extra helyet
            borderRadius: "8px",
            boxShadow: "0 0 40px rgba(0,0,0,0.9)",
            objectFit: "contain"
          }} 
        />
      </div>
    </div>
  </div>
</div>

      <div className="container mt-5 mb-5 text-white">
        <div className="row text-center g-4">
          <div className="col-md-4">
            <i className="fa fa-globe fa-3x mb-3" style={{ color: "#DAA520" }} aria-hidden="true"></i>
            <h5 style={{ fontWeight: 'bold' }}>Globális elérhetőség</h5>
            <p style={{ color: "#bbb" }}>Több mint 1 000 Exotic állomás több mint 40 országban</p>
          </div>
          <div className="col-md-4">
            <i className="fa fa-car fa-3x mb-3" style={{ color: "#DAA520" }} aria-hidden="true"></i>
            <h5 style={{ fontWeight: 'bold' }}>Különleges flotta</h5>
            <p style={{ color: "#bbb" }}>Magas minőségű kabrióktól a hyperautókig</p>
          </div>
          <div className="col-md-4">
            <i className="fa fa-heart fa-3x mb-3" style={{ color: "#DAA520" }} aria-hidden="true"></i>
            <h5 style={{ fontWeight: 'bold' }}>Kivételes szolgáltatás</h5>
            <p style={{ color: "#bbb" }}>Stresszmentes, megbízható, nincsenek rejtett költségek</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
