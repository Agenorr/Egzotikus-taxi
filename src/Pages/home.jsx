import Navbar from '../Components/navbar';
import Footer from '../Components/footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
//import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";
import '../Home.css'
import '../Base.css'

const Home = ({ serverData }) => {
  return (
    <div>
      <Navbar/>
      <div id="carSlideshow" className="carousel slide fade-bottom-white" data-bs-ride="carousel" data-bs-interval="3000">
        <div className="greeting-text">
            <h1>Üdvözlünk az Exotic világában!</h1>
            <p>Vezess álmaid autóját – Stílus, Sebesség, Szenvedély.</p>
        </div>

        <div className="carousel-inner">
            <div className="carousel-item active">
                <img src="/Assets/mclaren1.jpg" alt="Car 1"/>
            </div>
            <div className="carousel-item">
                <img src="/Assets/mclaren2.jpg" alt="Car 2"/>
            </div>
            <div className="carousel-item">
                <img src="/Assets/mclaren3.jpg" alt="Car 3"/>
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
        <div className="image-box">
            <img src="/Assets/mclaren1.jpg" alt="Car 1"/>
            <div className="image-overlay">
            </div>
        </div>
        <div className="image-box">
            <img src="/Assets/mclaren1.jpg" alt="Car 2"/>
            <div className="image-overlay">
            </div>
        </div>
        <div className="image-box">
            <img src="/Assets/mclaren1.jpg" alt="Car 3"/>
            <div className="image-overlay">
                <button className="image-button">Béreld ki!</button>
            </div>
        </div>
    </div>
    <Footer/>
    </div>
  );
};
export default Home;
