import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../Context/AuthContext';
import '../Css/VerificationWidget.css';

const VerificationWidget = () => {
    const { user, isLoggedIn } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(true);

    if (!isLoggedIn || !user) return null;

    const currentLevel = user.clearance || user.Clearance || 1;

    if (currentLevel >= 2) return null;

    const isEmailVerified = user.is_verified || user.isVerified || user.IsVerified || false;
    
    const licenseVal = user.license_number || user.licenseNumber || user.LicenseNumber;
    const isLicenseUploaded = licenseVal && licenseVal.trim() !== "" ? true : false;

    return (
        <div className="verification-widget">
            <div className="widget-header" onClick={() => setIsOpen(!isOpen)}>
                <div className="header-title">
                    <span className="gold-text">Státusz:</span> Vendég   
                </div>
                <button className="toggle-btn">{isOpen ? '—' : '+'}</button>
            </div>

            {isOpen && (
                <div className="widget-body">
                    <p className="widget-subtitle">Visszaigazolás:</p>
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
