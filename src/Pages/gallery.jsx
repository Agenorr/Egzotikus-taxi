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

      <section className="gallery">
        <div className="car-card">
          <img src="kepek/galeriasedan.jpg" alt="Sedan" />
          <div className="car-info">
            <h2>Sedan</h2>
            <p>Kényelmes és elegáns a városi utazásokhoz.</p>
          </div>
          <div className="overlay">
            <button onClick={() => (window.location.href = "autoberles.html")}>Bérlés</button>
          </div>
        </div>

        <div className="car-card">
          <img src="kepek/galerialuxury.jpg" alt="Luxury" />
          <div className="car-info">
            <h2>Luxury</h2>
            <p>Az elegancia, a kényelem és a legmodernebb technológiák tökéletes ötvözete.</p>
          </div>
          <div className="overlay">
            <button onClick={() => (window.location.href = "autoberles.html")}>Bérlés</button>
          </div>
        </div>

        <div className="car-card">
          <img src="kepek/galeriacompact.webp" alt="Compact" />
          <div className="car-info">
            <h2>Compact</h2>
            <p>Tökéletes ahhoz, hogy stílusosan és könnyedén száguldozz a városi dzsungelben.</p>
          </div>
          <div className="overlay">
            <button onClick={() => (window.location.href = "autoberles.html")}>Bérlés</button>
          </div>
        </div>

        <div className="car-card">
          <img src="kepek/galeriasuv.jpg" alt="SUV" />
          <div className="car-info">
            <h2>SUV</h2>
            <p>Tágas és erőteljes családi utazásokhoz.</p>
          </div>
          <div className="overlay">
            <button onClick={() => (window.location.href = "autoberles.html")}>Bérlés</button>
          </div>
        </div>

        <div className="car-card">
          <img src="kepek/galeriaeconomy.jpg" alt="Economy" />
          <div className="car-info">
            <h2>Electric</h2>
            <p>Környezetbarát a modern városi közlekedéshez.</p>
          </div>
          <div className="overlay">
            <button onClick={() => (window.location.href = "autoberles.html")}>Bérlés</button>
          </div>
        </div>
      </section>

      
      <div className="container mt-5 mb-5">
        <div className="row text-center">
          <div className="col-md-4">
            <i className="fa fa-car fa-3x mb-3" aria-hidden="true"></i>
            <h5>Különleges flotta</h5>
            <p>Magas minőségű kabrióktól a hyperautókig</p>
          </div>
          <div className="col-md-4">
            <i className="fa fa-phone fa-3x mb-3" aria-hidden="true"></i>
            <h5>Rugalmas ügyfélszolgálat</h5>
            <p>7-24 rendelkezésére állunk legyen bármilyen problémája vagy kérdése</p>
          </div>
          <div className="col-md-4">
            <i className="fa fa-heart fa-3x mb-3" aria-hidden="true"></i>
            <h5>Kivételes szolgáltatás</h5>
            <p>Stresszmentes, megbízható, nincsenek rejtett költségek</p>
          </div>
        </div>
      </div>

     
      <div className="container my-5">
        <h1 className="highlight-text">Élményképek</h1>

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

        <p className="info-text">
          Áraink az áfát tartalmazzák!
          <br />
          Napi km limit 400km/nap. Ennél hosszabb táv megtétele esetén 200 Ft/km kerül kiszámlázásra.
          <br />
          <br />
          A bérlőknek biztosítjuk:
          <br />
          - Ingyenes autópálya matrica Magyarország területén.
          <br />
          - CASCO, utas-, és poggyászbiztosítás az utazás idejére.
        </p>
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