import React from "react";
import Navbar from "../Components/navbar";
import Footer from "../Components/footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Css/AboutUs.css";

import roliKep from "../Img/rolunk_roli.png";
import abelKep from "../Img/rolunk_abel.jpg";
import agenorKep from "../Img/rolunk_agenor.jpg";

export default function AboutUs() {
  return (
    <>
      <Navbar />

      <section 
        className="about-hero text-center text-white" 
        style={{ 
          // Ne felejtsd el ellenőrizni, hogy az about-bg.jpg ezen az útvonalon van-e!
          background: `url(${require("../Img/rolunk_kep.jpg")}) no-repeat center center / cover` 
        }}
      >
        {/* Ez a div felel az alsó fehér átmenetért */}
        <div className="about-hero-fade"></div>

        <div className="about-hero-content">
          <h1 className="about-hero-title">Rólunk</h1>
          <div className="about-hero-accent" />
          <p className="lead about-hero-sub mt-3">
            Nem csupán autókat adunk bérbe. Élményt teremtünk minden egyes kilométeren.
          </p>
        </div>
      </section>

      <div className="about-page">

        {/* Alapítók */}
        <section className="section-card">
          <h2 className="section-title text-center">Alapítók</h2>

          <div className="founders-grid">
            <div className="founder-card">
              <img src={abelKep} alt="Futó Ábel" />
              <h3>Futó Ábel</h3>
              <p>Operatív igazgató és társalapító</p>
            </div>

            <div className="founder-card">
              <img src={roliKep} alt="Márton Roland" />
              <h3>Márton Roland</h3>
              <p>Vezérigazgató és alapító</p>
            </div>

            <div className="founder-card">
              <img src={agenorKep} alt="Baráth Agenor" />
              <h3>Baráth Agenor</h3>
              <p>Marketing igazgató és társalapító</p>
            </div>
          </div>
        </section>

        {/* Rólunk */}
        <section className="section-card text-center">
          <h2 className="section-title">Rólunk</h2>
          <p className="about-text">
            Az Exoticot 2025-ben alapította három szenvedélyes autórajongó.
            Küldetésünk egy prémium, mégis elérhető autókölcsönzési élmény
            biztosítása, amely modern, rugalmas és teljes mértékben ügyfélközpontú.
          </p>
        </section>

        {/* Jövőkép */}
        <section className="section-card text-center">
          <h2 className="section-title">Jövőkép</h2>
          <p className="about-text">
            Folyamatos terjeszkedés, teljesen elektromos flotta és egy modern
            mobilalkalmazás fejlesztése, amely egyszerűvé és átláthatóvá teszi
            a teljes foglalási folyamatot.
          </p>
        </section>

        <div className="container mt-5 mb-5">
          <div className="row text-center">
            <div className="col-md-4 mb-4 renting-feature">
              <i className="fa fa-car fa-3x mb-3 renting-feature-icon" aria-hidden="true"></i>
              <h5 className="renting-feature-title">Különleges flotta</h5>
              <p className="renting-feature-text">Magas minőségű kabrióktól a hyperautókig</p>
            </div>
            <div className="col-md-4 mb-4 renting-feature">
              <i className="fa fa-phone fa-3x mb-3 renting-feature-icon" aria-hidden="true"></i>
              <h5 className="renting-feature-title">Rugalmas ügyfélszolgálat</h5>
              <p className="renting-feature-text">7-24 rendelkezésére állunk legyen bármilyen problémája vagy kérdése</p>
            </div>
            <div className="col-md-4 mb-4 renting-feature">
              <i className="fa fa-heart fa-3x mb-3 renting-feature-icon" aria-hidden="true"></i>
              <h5 className="renting-feature-title">Kivételes szolgáltatás</h5>
              <p className="renting-feature-text">Stresszmentes, megbízható, nincsenek rejtett költségek</p>
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </>
  );
}