import Navbar from '../Components/navbar';
import Footer from '../Components/footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../Css/RentingInfo.css';


const RentingInfo = () => {
  return (
    <div className="renting-info-page">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="hero text-center py-5 bg-dark text-white">
        <div className="hero-content">
          <h1>Bérlési Feltételek</h1>
          <br />
          <p className="lead">Rugalmas és megbízható autóbérlési lehetőségek az Ön igényeire szabva.</p>
        </div>
      </section>

      {/* Policies Section */}
      <section id="policies" className="policies py-5">
        <div className="container">
          <h2 className="text-center mb-5">Bérlési Szabályzat</h2>

          <div className="row g-4">
            {/* Korcsoport */}
            <div className="col-md-6 col-lg-4">
              <div className="policy p-4 border rounded shadow-sm h-100">
                <i className="fa fa-id-card fa-2x mb-3"></i>
                <h3>Korcsoport és Jogosítvány</h3>
                <p>A bérlőnek legalább 18 évesnek kell lennie, és érvényes jogosítvánnyal kell rendelkeznie, amelyet legalább 1 éve birtokol.</p>
              </div>
            </div>

            {/* Időtartam */}
            <div className="col-md-6 col-lg-4">
              <div className="policy p-4 border rounded shadow-sm h-100">
                <i className="fa fa-clock-o fa-2x mb-3"></i>
                <h3>Bérleti Időtartam</h3>
                <p>Az autóbérlés minimális időtartama 1 óra. Az időtartam meghosszabbítása esetén előzetes értesítést kérünk.</p>
              </div>
            </div>

            {/* Üzemanyag */}
            <div className="col-md-6 col-lg-4">
              <div className="policy p-4 border rounded shadow-sm h-100">
                <i className="fa fa-battery-full fa-2x mb-3"></i>
                <h3>Üzemanyag</h3>
                <p>A gépjárművek tele tankkal kerülnek kiadásra, és tele tankkal kell visszaszolgáltatni őket. Eltérés esetén tankolási díjat számolunk fel.</p>
              </div>
            </div>

            {/* Biztosítás */}
            <div className="col-md-6 col-lg-4">
              <div className="policy p-4 border rounded shadow-sm h-100">
                <i className="fa fa-shield fa-2x mb-3"></i>
                <h3>Biztosítás és Kaució</h3>
                <p>Minden autóbérlés tartalmaz alapvető biztosítást. A bérlés megkezdése előtt kauciót kell letétbe helyezni, amelyet a jármű visszaadásakor visszatérítünk.</p>
              </div>
            </div>

            {/* Büntetések */}
            <div className="col-md-6 col-lg-4">
              <div className="policy p-4 border rounded shadow-sm h-100">
                <i className="fa fa-bell fa-2x mb-3"></i>
                <h3>Büntetések és Késedelmi Díjak</h3>
                <p>Bármilyen közlekedési szabálysértésért a bérlő felelős. A késedelmes visszajuttatás esetén óránkénti késedelmi díjat számolunk fel.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section (Extra ikonok alul) */}
      <div className="container mt-5 mb-5">
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
};

export default RentingInfo;