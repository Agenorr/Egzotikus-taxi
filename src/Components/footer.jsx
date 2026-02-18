import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1a1a1a', color: 'white', padding: '20px 0' }}>
      <div className="container">
        <div className="row">

          <div className="col-md-4 d-flex flex-column align-items-center">
            <img
              src="/Assets/Exotic_logo.webp"
              alt="Exotic Logo"
              style={{ width: '150px', marginBottom: '10px' }}
            />
          </div>

          <div className="col-md-4 text-center">
            <p style={{ margin: '5px 0' }}>
              <i className="fa fa-instagram" style={{ fontSize: '20px', color: 'white' }} />{' '}
              ExoticCarDealership
            </p>
            <p style={{ margin: '5px 0' }}>
              <i className="fa fa-envelope" style={{ fontSize: '20px', color: 'white' }} />{' '}
              Exotic@gmail.com
            </p>
            <p style={{ margin: '5px 0' }}>Ügyfélszolgálat: +36 30 000 0000</p>
            <p style={{ margin: '5px 0' }}>Székhely: cím</p>
          </div>

          <div className="col-md-4 d-flex justify-content-center">
            <div>
              <h5 style={{ marginBottom: '10px', color: 'white' }}>Follow us</h5>
              <a href="#" className="me-3">
                <i className="fa fa-facebook-square" style={{ fontSize: '25px', color: 'white' }} />
              </a>
              <a href="#" className="me-3">
                <i className="fa fa-twitter-square" style={{ fontSize: '25px', color: 'white' }} />
              </a>
              <a href="#">
                <i className="fa fa-instagram" style={{ fontSize: '25px', color: 'white' }} />
              </a>
            </div>
          </div>

        </div>

        <div className="row mt-3">
          <div className="col-12 text-center">
            <p style={{ fontSize: '12px', margin: 0 }}>
              © 2026 Exotic. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
