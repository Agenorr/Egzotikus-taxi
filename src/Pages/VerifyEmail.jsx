import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState('E-mail megerősítése folyamatban...');
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            // Elküldjük a tokent a backendnek
            fetch(`https://localhost:7065/api/auth/verify?token=${token}`, { 
                method: 'POST' 
            })
            .then(res => {
                if (res.ok) {
                    setStatus('Sikeres e-mail megerősítés! Üdvözlünk a 2-es szinten.');
                    // 3 másodperc múlva átirányítjuk a profiljára
                    setTimeout(() => navigate('/Profile'), 3000); 
                } else {
                    setStatus('Hiba: Érvénytelen vagy lejárt megerősítő link.');
                }
            })
            .catch(() => {
                setStatus('Hiba történt a szerverhez való kapcsolódáskor.');
            });
        } else {
            setStatus('Érvénytelen link (hiányzó token).');
        }
    }, [token, navigate]);

    return (
        <div className="container mt-5 text-center text-white" style={{ minHeight: '60vh', paddingTop: '100px' }}>
            <h2 style={{ color: '#DAA520' }}>{status}</h2>
        </div>
    );
};

export default VerifyEmail;