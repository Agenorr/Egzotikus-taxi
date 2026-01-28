import React, { useState } from 'react';
import '../CSS/BerlesiFeltetelek.css'; // A fenti CSS fájl importálása


export default function BerlesiFeltetelek() {
    return (
      <div>
            <div className="berlesi-feltetelek-page">
           

           {/* Hero Section */}
           <section id="home" className="hero">
               <div className="hero-content">
                   <h1>Bérlési Feltételek</h1>
                   <br />
                   <p>Rugalmas és megbízható autóbérlési lehetőségek az Ön igényeire szabva.</p>
               </div>
           </section>

           {/* Policies Section */}
           <section id="policies" className="policies">
               <div className="container">
                   <h2>Bérlési Szabályzat</h2>

                   <div className="policy">
                       <i className="fa-solid fa-address-card"></i>
                       <h3>Korcsoport és Jogosítvány</h3>
                       <p>A bérlőnek legalább 18 évesnek kell lennie, és érvényes jogosítvánnyal kell rendelkeznie, amelyet legalább 1 éve birtokol.</p>
                   </div>

                   <div className="policy">
                       <i className="fa-solid fa-clock"></i>
                       <h3>Bérleti Időtartam</h3>
                       <p>Az autóbérlés minimális időtartama 1 óra. Az időtartam meghosszabbítása esetén előzetes értesítést kérünk.</p>
                   </div>

                   <div className="policy">
                       <i className="fa-solid fa-gas-pump"></i>
                       <h3>Üzemanyag</h3>
                       <p>A gépjárművek tele tankkal kerülnek kiadásra, és tele tankkal kell visszaszolgáltatni őket. Eltérés esetén tankolási díjat számolunk fel.</p>
                   </div>

                   <div className="policy">
                       <i className="fa-solid fa-shield"></i>
                       <h3>Biztosítás és Kaució</h3>
                       <p>Minden autóbérlés tartalmaz alapvető biztosítást. A bérlés megkezdése előtt kauciót kell letétbe helyezni, amelyet a jármű visszaadásakor visszatérítünk.</p>
                   </div>

                   <div className="policy">
                       <i className="fa-solid fa-bell"></i>
                       <h3>Büntetések és Késedelmi Díjak</h3>
                       <p>Bármilyen közlekedési szabálysértésért a bérlő felelős. A késedelmes visszajuttatás esetén óránkénti késedelmi díjat számolunk fel.</p>
                   </div>
               </div>
           </section>

           {/* Features Section */}
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

          
       </div>
      </div>
    )
  }
    