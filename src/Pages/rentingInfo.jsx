import React, { useEffect } from 'react';
import Navbar from '../Components/navbar';
import Footer from '../Components/footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'font-awesome/css/font-awesome.min.css';
import '../Css/RentingInfo.css';

const RentingInfo = () => {

  useEffect(() => {
    document.title = "Exotic | Bérlési Feltételek";
  }, []);

  const policies = [
    {
      icon: "fa-id-card",
      title: "Korcsoport és Jogosítvány",
      text: "A bérlőnek legalább 18 évesnek kell lennie, és érvényes jogosítvánnyal kell rendelkeznie, amelyet legalább 1 éve birtokol.",
    },
    {
      icon: "fa-clock-o",
      title: "Bérleti Időtartam",
      text: "Az autóbérlés minimális időtartama 1 óra. Az időtartam meghosszabbítása esetén előzetes értesítést kérünk.",
    },
    {
      icon: "fa-tint",
      title: "Üzemanyag",
      text: "A gépjárművek tele tankkal kerülnek kiadásra, és tele tankkal kell visszaszolgáltatni őket. Eltérés esetén tankolási díjat számolunk fel.",
    },
    {
      icon: "fa-shield",
      title: "Biztosítás és Kaució",
      text: "Minden autóbérlés tartalmaz alapvető biztosítást. A bérlés megkezdése előtt kauciót kell letétbe helyezni, amelyet a jármű visszaadásakor visszatérítünk.",
    },
    {
      icon: "fa-exclamation-triangle",
      title: "Büntetések és Késedelmi Díjak",
      text: "Bármilyen közlekedési szabálysértésért a bérlő felelős. A késedelmes visszajuttatás esetén óránkénti késedelmi díjat számolunk fel.",
    },
  ];

  return (
    <div className="d-flex flex-column min-vh-100 renting-info-page" style={{ backgroundColor: "#1a1a1a", color: "#fff" }}>
      <Navbar />

      <section 
        id="home" 
        className="renting-hero text-center text-white"
        style={{ 
          background: `url(${require("../Img/berlesifeltetelek_kep.jpg")}) no-repeat center center / cover` 
        }}
      >
        <div className="renting-hero-fade"></div>

        <div className="hero-content">
          <h1 className="renting-hero-title">Bérlési Feltételek</h1>
          <div className="renting-hero-accent" />
          <p className="renting-hero-sub">
            Rugalmas és megbízható autóbérlési lehetőségek az Ön igényeire szabva.
          </p>
        </div>
      </section>

      <section className="container my-5">
        <h2 className="text-center mb-5 renting-section-title">Bérlési Szabályzat</h2>

        <div className="renting-cards">
          {policies.map((item, index) => (
            <div key={index} className="renting-policy-card d-flex p-4 mb-3">
              <div className="renting-policy-left" />
              <i className={`fa ${item.icon} fa-2x me-3 mt-1 renting-policy-icon`} aria-hidden="true" />
              <div>
                <h5 className="fw-bold mb-1">{item.title}</h5>
                <p className="mb-0 text-muted-custom">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-5">
        <h2 className="text-center mb-5 renting-section-title">
          Jogi dokumentumok
        </h2>

        <div className="renting-legal-card text-center p-4">
          <i className="fa fa-file-pdf-o fa-3x mb-3 renting-legal-icon"></i>

          <h5 className="fw-bold mb-2 text-white">
            Autóbérlési szerződés és általános feltételek
          </h5>

          <p className="mb-4 text-muted-custom">
            A bérlés megkezdése előtt kérjük tekintse meg a hivatalos
            bérlési szerződést és az általános szerződési feltételeket.
          </p>

          <div className="renting-legal-buttons mt-4">
            <a
              href="/documents/exotic_autoberlesi_szerzodes_es_aszf.pdf"
              target="_blank"
              className="btn outline-gold-btn me-3"
            >
              Megtekintés
            </a>

            <a
              href="/documents/exotic_autoberlesi_szerzodes_es_aszf.pdf"
              download
              className="btn solid-gold-btn"
            >
              Letöltés
            </a>
          </div>
        </div>
      </section>

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
};

export default RentingInfo;
