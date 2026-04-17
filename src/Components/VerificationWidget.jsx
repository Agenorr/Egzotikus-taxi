import React, { useState, useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
import '../Css/VerificationWidget.css';

const VerificationWidget = () => {
    const { user, isLoggedIn } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(true);

    // Ha nincs bejelentkezve, vagy nincs user adat, nem mutatunk semmit
    if (!isLoggedIn || !user) return null;

    // A clearance szint lekérése (figyelve minden lehetséges elnevezésre)
    const currentLevel = user.clearance ?? user.Clearance ?? 1;

    // Ha már 2-es szintű (vagy nagyobb), a widgetnek el kell tűnnie
    if (currentLevel >= 2) return null;

    // Email ellenőrzése (0/1 vagy false/true kezelése)
    const isEmailVerified = 
        user.is_verified === 1 || 
        user.is_verified === true || 
        user.isVerified === true || 
        user.IsVerified === true;
    
    // Jogosítvány ellenőrzése
    const licenseVal = user.license_number || user.licenseNumber || user.LicenseNumber;
    const isLicenseUploaded = licenseVal && licenseVal.trim() !== "";

    return (
        <div className="verification-widget">
            <div className="widget-header" onClick={() => setIsOpen(!isOpen)}>
                <div className="header-title">
                    <span className="gold-text">Státusz:</span> Vendég 
                    <small className="ms-2" style={{fontSize: '0.7rem', color: '#888'}}>(Szint: {currentLevel})</small>
                </div>
                <button className="toggle-btn">{isOpen ? '—' : '+'}</button>
            </div>

            {isOpen && (
                <div className="widget-body">
                    <p className="widget-subtitle">A bérléshez szükséges:</p>
                    <ul className="task-list">
                        <li className={isEmailVerified ? 'task completed' : 'task pending'}>
                            <span className="icon">{isEmailVerified ? '✓' : '○'}</span>
                            Email visszaigazolása
                        </li>
                        <li className={isLicenseUploaded ? 'task completed' : 'task pending'}>
                            <span className="icon">{isLicenseUploaded ? '✓' : '○'}</span>
                            Vezetői engedély feltöltése
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default VerificationWidget;