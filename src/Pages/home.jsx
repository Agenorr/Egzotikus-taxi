import Navbar from '../Components/navbar';
import Footer from '../Components/footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../Css/Home.css';
import '../Css/carRental.css'; 
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";

const Home = ({ serverData }) => { 

    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        document.title = "Exotic | Kezdőlap";
    }, []);

    useEffect(() => {
        axios.get("https://localhost:7065/api/vehicles")
            .then(res => {
                const topThree = res.data
                    .sort((a, b) => (b.times_Rented || 0) - (a.times_Rented || 0))
                    .slice(0, 3);
                
                setVehicles(topThree);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: "#1a1a1a" }}>
            <Navbar />

            <div id="carSlideshow" className="carousel slide home-hero-section" data-bs-ride="carousel" data-bs-interval="3000">
                <div className="carousel-inner h-100">
                    <div className="carousel-item active h-100">
                        <img src="/Assets/mclaren1.jpg" className="d-block w-100 h-100 object-fit-cover" alt="Car 1" />
                    </div>
                    <div className="carousel-item h-100">
                        <img src="/Assets/mclaren2.jpg" className="d-block w-100 h-100 object-fit-cover" alt="Car 2" />
                    </div>
                    <div className="carousel-item h-100">
                        <img src="/Assets/mclaren3.jpg" className="d-block w-100 h-100 object-fit-cover" alt="Car 3" />
                    </div>
                </div>

                <div className="home-hero-fade"></div>

                <div className="greeting-text">
                    <h1 className="home-hero-title">Üdvözlünk az Exotic világában!</h1>
                    <div className="home-hero-accent" />
                    <p className="home-hero-sub">Vezess álmaid autóját - Stílus, Sebesség, Szenvedély.</p>
                </div>
                
                {/* Carousel Vezérlők */}
                <button className="carousel-control-prev" style={{ zIndex: 3 }} type="button" data-bs-target="#carSlideshow" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" style={{ zIndex: 3 }} type="button" data-bs-target="#carSlideshow" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>

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

            <div className="container mb-5">
                <h2 className="text-center mb-5" style={{ color: '#DAA520', fontWeight: 'bold', letterSpacing: '1px' }}>Legnépszerűbb autóink</h2>
                <div className="row justify-content-center g-4">
                    {vehicles.map((car) => {
                        const primaryImage = car.images?.find(img => img.isPrimary) || car.images?.[0];

                        return (
                            <div key={car.id} className="col-12 col-md-6 col-lg-4">
                                <div className="car-card car-card-hover position-relative text-white w-100"
                                    style={{
                                        height: "300px",
                                        backgroundImage: primaryImage ? `url(${primaryImage.imageUrl})` : 'none',
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                        borderRadius: "8px",
                                        overflow: "hidden"
                                    }}
                                >
                                    <div className="card-fade-bottom"></div>

                                    <div className="card-content position-absolute bottom-0 start-50 translate-middle-x w-100 text-center pb-4" style={{ zIndex: 2 }}>
                                        <h3 className="mb-1" style={{ 
                                            textShadow: "2px 2px 10px rgba(0,0,0,1), -1px -1px 4px rgba(0,0,0,0.8)", 
                                            fontWeight: "bold", 
                                            textTransform: "uppercase", 
                                            letterSpacing: "1px" 
                                        }}>
                                            {car.brand}
                                        </h3>
                                        <h5 className="mb-4" style={{ 
                                            textShadow: "2px 2px 10px rgba(0,0,0,1), -1px -1px 4px rgba(0,0,0,0.8)", 
                                            fontWeight: "300", 
                                            color: "#e0e0e0" 
                                        }}>
                                            {car.model}
                                        </h5>
                                    </div>

                                    <Link
                                        to={`/CarRental/${car.id}`}
                                        className="btn car-details-btn no-focus-ring"
                                    >
                                        Béreld ki!
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            <Footer />
        </div>
    );
};

export default Home;