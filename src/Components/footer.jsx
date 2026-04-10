import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function Footer() {
  const mainLinks = [
    { name: "Kezdőlap", path: "/" },
    { name: "Autóbérlés", path: "/CarRental" },
    { name: "Taxi Rendelés", path: "/Taxi" },
    { name: "Galéria", path: "/Gallery" },
    { name: "Rólunk", path: "/AboutUs" },
    { name: "Bérlési Feltételek", path: "/RentingInfo" }
  ];

  return (
    <footer style={{ backgroundColor: '#1a1a1a', borderTop: '1px solid #333', padding: '30px 0 10px 0' }}>
      <div className="container">

        {/* Hozzáadtam az align-items-center osztályt, így a Logó függőlegesen is tökéletesen középre kerül */}
        <div className="row mb-4 align-items-center">

          {/* 1. Oszlop: Logó (Vízszintesen is középre igazítva) */}
          <div className="col-md-4 mb-4 mb-md-0 d-flex justify-content-center">
            <img
              src="/Assets/Exotic_logo.webp"
              alt="Exotic Logo"
              style={{ width: '160px', opacity: '0.9' }}
            />
          </div>

          {/* 2. Oszlop: Navigáció (Középre igazított szöveg és kisebb sorköz) */}
          <div className="col-md-4 mb-4 mb-md-0 d-flex flex-column align-items-center text-center">
            <h5 style={{ color: '#fff', marginBottom: '20px', fontSize: '16px', fontWeight: 'bold', letterSpacing: '1px' }}>
              Navigáció
            </h5>
            {/* A gap-3 helyett gap-2 lett, hogy közelebb legyenek egymáshoz a linkek */}
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }} className="d-flex flex-column gap-2">
              {mainLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.path}
                    style={{ color: '#bbb', textDecoration: 'none', fontSize: '14px', transition: 'color 0.3s' }}
                    onMouseOver={(e) => e.target.style.color = '#DAA520'}
                    onMouseOut={(e) => e.target.style.color = '#bbb'}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Oszlop: Kapcsolat (Középre igazítva) */}
          <div className="col-md-4 d-flex flex-column align-items-center text-center">
            <h5 style={{ color: '#fff', marginBottom: '20px', fontSize: '16px', fontWeight: 'bold', letterSpacing: '1px' }}>
              Kapcsolat
            </h5>
            {/* A w-100 biztosítja, hogy a sorok kitöltsék az oszlopot, és középre tudjanak igazodni */}
            <div className="d-flex flex-column gap-2 w-100">

              {/* Email - Kattintható linkkel */}
              <div className="d-flex justify-content-center align-items-center gap-1">
                <div style={{ width: '20px', display: 'flex', justifyContent: 'center' }}>
                  <i className="fa fa-envelope" style={{ color: '#DAA520', fontSize: '18px' }}></i>
                </div>
                <a 
                  href="mailto:exoticrentals@gmail.com" 
                  style={{ fontSize: '14px', color: '#bbb', letterSpacing: '0.5px', textDecoration: 'none', transition: 'color 0.3s' }}
                  onMouseOver={(e) => e.target.style.color = '#DAA520'}
                  onMouseOut={(e) => e.target.style.color = '#bbb'}
                >
                  exoticrentals@gmail.com
                </a>
              </div>

              {/* Telefon - Kattintható linkkel */}
              <div className="d-flex justify-content-center align-items-center gap-1">
                <div style={{ width: '20px', display: 'flex', justifyContent: 'center' }}>
                  <i className="fa fa-phone" style={{ color: '#DAA520', fontSize: '18px' }}></i>
                </div>
                <a 
                  href="tel:+36706286383" 
                  style={{ fontSize: '14px', color: '#bbb', letterSpacing: '0.5px', textDecoration: 'none', transition: 'color 0.3s' }}
                  onMouseOver={(e) => e.target.style.color = '#DAA520'}
                  onMouseOut={(e) => e.target.style.color = '#bbb'}
                >
                  +36 70 628 6383
                </a>
              </div>

            </div>
          </div>
        </div>

        {/* Alsó rész: Copyright és ÁSZF */}
        <div className="row" style={{ borderTop: '1px solid #2a2a2a', paddingTop: '15px' }}>
          <div className="col-12 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">

            <p style={{ fontSize: '13px', color: '#777', margin: 0 }}>
              © {new Date().getFullYear()} Exotic. Minden jog fenntartva.
            </p>

            <div style={{ fontSize: '13px' }}>
              <a
                href="/documents/exotic_autoberlesi_szerzodes_es_aszf.pdf"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#777', textDecoration: 'none', transition: 'color 0.3s', fontWeight: 'bold' }}
                onMouseOver={(e) => e.target.style.color = '#DAA520'}
                onMouseOut={(e) => e.target.style.color = '#777'}
              >
                ÁSZF
              </a>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}
