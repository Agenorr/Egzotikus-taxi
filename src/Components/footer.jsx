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
    <footer style={{ backgroundColor: '#0d0d0d', borderTop: '1px solid #222', padding: '40px 0 15px 0' }}>
      <div className="container">

        <div className="row mb-5 align-items-center">

          <div className="col-md-4 mb-4 mb-md-0 d-flex justify-content-center">
            <img
              src="/Assets/Exotic_logo.webp"
              alt="Exotic Logo"
              style={{ width: '160px', opacity: '0.9' }}
            />
          </div>

          <div className="col-md-4 mb-4 mb-md-0 d-flex flex-column align-items-center text-center">
            <h5 style={{ color: '#DAA520', marginBottom: '20px', fontSize: '16px', fontWeight: 'bold', letterSpacing: '1px' }}>
              Navigáció
            </h5>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }} className="d-flex flex-column gap-2">
              {mainLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.path}
                    style={{ color: '#bbb', textDecoration: 'none', fontSize: '14.5px', transition: 'all 0.3s ease' }}
                    onMouseOver={(e) => { e.target.style.color = '#DAA520'; e.target.style.letterSpacing = '0.5px'; }}
                    onMouseOut={(e) => { e.target.style.color = '#bbb'; e.target.style.letterSpacing = 'normal'; }}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-md-4 d-flex flex-column align-items-center text-center">
            <h5 style={{ color: '#DAA520', marginBottom: '20px', fontSize: '16px', fontWeight: 'bold', letterSpacing: '1px' }}>
              Kapcsolat
            </h5>
            <div className="d-flex flex-column gap-3 w-100">
              <div className="d-flex justify-content-center align-items-center gap-2">
                <div style={{ width: '24px', display: 'flex', justifyContent: 'center' }}>
                  <i className="fa fa-envelope" style={{ color: '#DAA520', fontSize: '18px' }}></i>
                </div>
                <a 
                  href="mailto:exoticrentals@gmail.com" 
                  style={{ fontSize: '14.5px', color: '#bbb', letterSpacing: '0.5px', textDecoration: 'none', transition: 'color 0.3s' }}
                  onMouseOver={(e) => e.target.style.color = '#fff'}
                  onMouseOut={(e) => e.target.style.color = '#bbb'}
                >
                  exoticrentals@gmail.com
                </a>
              </div>

              <div className="d-flex justify-content-center align-items-center gap-2">
                <div style={{ width: '24px', display: 'flex', justifyContent: 'center' }}>
                  <i className="fa fa-phone" style={{ color: '#DAA520', fontSize: '18px' }}></i>
                </div>
                <a 
                  href="tel:+36706286383" 
                  style={{ fontSize: '14.5px', color: '#bbb', letterSpacing: '0.5px', textDecoration: 'none', transition: 'color 0.3s' }}
                  onMouseOver={(e) => e.target.style.color = '#fff'}
                  onMouseOut={(e) => e.target.style.color = '#bbb'}
                >
                  +36 70 628 6383
                </a>
              </div>

            </div>
          </div>
        </div>

        <div className="row" style={{ borderTop: '1px solid #222', paddingTop: '20px' }}>
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
                Általános Szerződési Feltételek
              </a>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}
