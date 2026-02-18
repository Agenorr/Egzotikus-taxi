import React, { useState } from "react";
import Navbar from "../Components/navbar";
import Footer from "../Components/footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../Css/Gallery.css";

export default function Gallery() {
  const [modalImg, setModalImg] = useState("");

  const experienceImages = Array(12).fill("kepek/galeriaideigleneskep.webp");

  return (
    <div>
      <Navbar />

      <section id="home" className="hero renting-hero text-center py-5 text-white" style={{ background: `url(${require("../Img/gallery/galeriaeconomy.jpg")}) no-repeat center center / cover` }}>
        <div className="hero-content">
          <h1 className="renting-hero-title">Galéria</h1>
          <div className="renting-hero-accent" />
          <p className="lead renting-hero-sub">
            Utazások és élmények, amelyeket ügyfeleink velünk éltek át.
          </p>
        </div>
      </section>

      <div className="container my-5">
        <div className="text-center mb-4">
          <h1 className="highlight-text">Élményképek</h1>
        </div>

        <div className="gallery-container">
          {experienceImages.map((src, index) => (
            <div
              key={index}
              className="gallery-item"
              data-bs-toggle="modal"
              data-bs-target="#galleryModal"
              onClick={() => setModalImg(src)}
            >
              <img src={src} alt={`Galéria Kép ${index + 1}`} />
              <div className="gallery-overlay">Kép megnézése</div>
            </div>
          ))}
        </div>

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
