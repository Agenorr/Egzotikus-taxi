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
    <div className="renting-info-page">
      <Navbar />

      {/* Hero Section */}
      <section 
        id="home" 
        className="hero renting-hero text-center py-5 text-white"
        style={{ 
          // IDE ÍRD A BÉRLÉSI FELTÉTELEK HÁTTÉRKÉPÉNEK ÚTVONALÁT!
          background: `url(${require("../Img/berlesifeltetelek_kep.jpg")}) no-repeat center center / cover` 
        }}
      >
        <div className="hero-fade"></div>

        <div className="hero-content">
          <h1 className="renting-hero-title">Bérlési Feltételek</h1>
          <div className="renting-hero-accent" />
          <p className="lead renting-hero-sub">
            Rugalmas és megbízható autóbérlési lehetőségek az Ön igényeire szabva.
          </p>
        </div>
      </section>

      {/* Policies Section */}
      <section className="container my-5">
        <h2 className="text-center mb-4 renting-section-title">Bérlési Szabályzat</h2>

        <div className="renting-cards">
          {policies.map((item, index) => (
            <div key={index} className="renting-policy-card d-flex p-4 mb-3">
              <div className="renting-policy-left" />
              <i className={`fa ${item.icon} fa-2x me-3 mt-1 renting-policy-icon`} aria-hidden="true" />
              <div>
                <h5 className="fw-bold mb-1">{item.title}</h5>
                <p className="mb-0">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-5">
        <h2 className="text-center mb-4 renting-section-title">
          Jogi dokumentumok
        </h2>

        <div className="renting-legal-card text-center p-4">
          <i className="fa fa-file-pdf-o fa-3x mb-3 renting-legal-icon"></i>

          <h5 className="fw-bold mb-2">
            Autóbérlési szerződés és általános feltételek
          </h5>

          <p className="mb-4">
            A bérlés megkezdése előtt kérjük tekintse meg a hivatalos
            bérlési szerződést és az általános szerződési feltételeket.
          </p>

          <div className="renting-legal-buttons">
            <a
              href="/documents/exotic_autoberlesi_szerzodes_es_aszf.pdf"
              target="_blank"
              className="btn btn-dark me-3"
            >
              Megtekintés
            </a>

            <a
              href="/documents/exotic_autoberlesi_szerzodes_es_aszf.pdf"
              download
              className="btn btn-warning"
            >
              Letöltés
            </a>
          </div>
        </div>
      </section>

      <div className="container mt-5 mb-5">
        <div className="row text-center">
          <div className="col-md-4">
            <i className="fa fa-globe fa-3x mb-3" aria-hidden="true"></i>
            <h5>Globális elérhetőség</h5>
            <p>Több mint 1 000 Exotic állomás több mint 40 országban</p>
          </div>
          <div className="col-md-4">
            <i className="fa fa-car fa-3x mb-3" aria-hidden="true"></i>
            <h5>Különleges flotta</h5>
            <p>Magas minőségű kabrióktól a hyperautókig</p>
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
};

export default RentingInfo;