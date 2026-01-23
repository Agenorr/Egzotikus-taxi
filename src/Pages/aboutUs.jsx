import React from "react";
import Navbar from "../Components/navbar";
import Footer from "../Components/footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../Css/AboutUs.css";

export default function AboutUs() {
  return (
    <div>
      <Navbar />

      <div className="container weblapminden">
        <section className="founders-section">
          <img src="/kepek/rolunkfokep.jpg" alt="Alapítók Kép" className="img-fluid" />
          <div className="founders-wrapper">
            <div className="founders-member">
              <h3 style={{ color: "#ff8c00" }}>Márton Roland</h3>
              <p>
                <i className="fa fa-user fa-briefcase"></i> Vezérigazgató és alapító{" "}
                <i className="fa fa-user fa-briefcase"></i>
              </p>
            </div>
            <div className="founders-member">
              <h3 style={{ color: "#ff8c00" }}>Futó Ábel</h3>
              <p>
                <i className="fa fa-user fa-briefcase"></i> Operatív igazgató és társalapító{" "}
                <i className="fa fa-user fa-briefcase"></i>
              </p>
            </div>
            <div className="founders-member">
              <h3 style={{ color: "#ff8c00" }}>Baráth Agenor</h3>
              <p>
                <i className="fa fa-user fa-briefcase"></i> Marketing igazgató és társalapító{" "}
                <i className="fa fa-user fa-briefcase"></i>
              </p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2 style={{ color: "#ff8c00" }}>Rólunk</h2>
          <p className="about-text">
            Az Exoticot 2015-ben alapította három szenvedélyes autórajongó: Márton Roland, Futó Ábel és Baráth
            Agenor. Egy kis, mindössze 5 autóból álló flottával kezdtük, de volt egy olyan ambícióink, hogy olyan
            autókölcsönző szolgáltatást hozzunk létre, amely nemcsak rugalmasságot és megfizethetőséget kínál, hanem
            egy széles lehetőségi skálát is, amely lehetővé teszi, hogy az alkalmi utazóktól kezdve az üzleti
            vezetőkön át mindenki megtalálja a számára legmegfelelőbb megoldást.
          </p>

          <div id="aboutCarousel" className="carousel slide my-4" data-bs-ride="carousel" data-bs-interval="4000">
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img src="kepek/rolunkslideshowagenor.jpg" className="d-block w-100 carousel-img-small"
                  style={{ height: "250px", borderRadius: "15px", objectFit: "cover" }} alt="First Slide" />
                <div className="carousel-caption d-none d-md-block">
                  <h5 style={{ color: "#ff8c00" }}>Baráth Agenor</h5>
                  <p>"Life is too short to drive a boring car."</p>
                </div>
              </div>
              <div className="carousel-item">
                <img src="kepek/rolunkslideshowabel.jpg" className="d-block w-100 carousel-img-small"
                  style={{ height: "250px", borderRadius: "15px", objectFit: "cover" }} alt="Second Slide" />
                <div className="carousel-caption d-none d-md-block">
                  <h5 style={{ color: "#ff8c00" }}>Futó Ábel</h5>
                  <p>"A car is like a mother-in-law - if you let it, it will rule your life."</p>
                </div>
              </div>
              <div className="carousel-item">
                <img src="kepek/rolunkslideshowroli.png" className="d-block w-100"
                  style={{ height: "250px", borderRadius: "15px", objectFit: "cover" }} alt="Third Slide" />
                <div className="carousel-caption d-none d-md-block">
                  <h5 style={{ color: "#ff8c00" }}>Márton Roland</h5>
                  <p>"The cars we drive say a lot about us."</p>
                </div>
              </div>
            </div>

            <button className="carousel-control-prev" type="button" data-bs-target="#aboutCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Előző</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#aboutCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Következő</span>
            </button>
          </div>

          <br />
          <h2 style={{ color: "#ff8c00" }}>Terveink a jövőben</h2>
          <p className="about-text">
            Előre tekintve, tervezzük, hogy új városokra terjeszkedünk, és különösen izgatottak vagyunk a
            teljesen elektromos flotta bevezetése az elkövetkező években.
            Emellett egy olyan mobilalkalmazást fejlesztünk, amely lehetővé teszi majd az ügyfelek számára, hogy
            könnyedén foglalhassanak, kezelhessenek és nyomon követhessék a fuvarokat.
          </p>
        </section>
      </div>

      <div className="container weblapminden mt-5 mb-5">
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

      <Footer />
    </div>
  );
}