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

      <section className="title">
        <h1 className="highlight-text">Flottánk</h1>
        <p>Böngésszen és válassza ki a tökéletes autót az utazásához.</p>
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
              <img src={src} alt={`Gallery Image ${index + 1}`} />
              <div className="gallery-overlay">Kép megnézése</div>
            </div>
          ))}
        </div>

        <div className="cta-container">
          <button className="cta-btn" onClick={() => (window.location.href = "autoberles.html")}>
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

      <Footer />
    </div>
  );
}
