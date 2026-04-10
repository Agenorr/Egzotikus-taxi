import Navbar from '../Components/navbar';
import Footer from '../Components/footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../Css/Home.css'
import { useState, useEffect } from 'react';
import axios from "axios";

const Home = ({ serverData }) => {

    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        document.title = "Exotic | Kezdőlap";
    }, []);

    useEffect(() => {
        axios.get("https://localhost:7065/api/vehicles")
            .then(res =>{
                const firstThree = res.data.slice(0,3);
                console.log(firstThree)
                setVehicles(firstThree);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <Navbar />
            
            <div id="carSlideshow" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
                
                <div className="home-hero-fade"></div>

                <div className="greeting-text">
                    <h1 className="home-hero-title">Üdvözlünk az Exotic világában!</h1>
                    <div className="home-hero-accent" />
                    <p className="home-hero-sub">Vezess álmaid autóját - Stílus, Sebesség, Szenvedély.</p>
                </div>

                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img src="/Assets/mclaren1.jpg" alt="Car 1" />
                    </div>
                    <div className="carousel-item">
                        <img src="/Assets/mclaren2.jpg" alt="Car 2" />
                    </div>
                    <div className="carousel-item">
                        <img src="/Assets/mclaren3.jpg" alt="Car 3" />
                    </div>
                </div>
                
                <button className="carousel-control-prev" type="button" data-bs-target="#carSlideshow" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carSlideshow" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>

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

            <div className="image-container">
                {vehicles.map((car) => {
                    const primaryImage = car.images?.find(img => img.isPrimary)?.imageUrl
                        || car.images?.[0]?.imageUrl
                        || 'https://via.placeholder.com/300';

                    return (
                        <div key={car.id} className="image-box">
                            <img src={primaryImage.trim()} alt={`${car.brand} ${car.model}`} className='home-image'/>
                            <div className="image-overlay">
                                <button className="image-button">Béreld ki!</button>
                            </div>
                        </div>
                    );
                })}
            </div>
            <Footer />
        </div>
    );
};
export default Home;
