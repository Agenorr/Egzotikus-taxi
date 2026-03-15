import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState("Verifying...");
    
    // 1. Pull user and the new updateUser function from Context
    const { user, updateUser } = useContext(AuthContext); 

    // Fül szövegének beállítása
    useEffect(() => {
        document.title = "Exotic | Email Megerősítése";
    }, []);

    useEffect(() => {
        const token = searchParams.get("token");
        
        axios.post(`https://localhost:7065/api/auth/verify?token=${encodeURIComponent(token)}`)
            .then(res => {
                setStatus("Verification Successful!");
                
                // 2. Call updateUser! This updates memory + localStorage instantly.
                if (user) {
                    updateUser({ 
                        ...user, 
                        is_verified: true, 
                        isVerified: true, 
                        IsVerified: true 
                    });
                }
            })
            .catch(err => {
                setStatus("Verification failed.");
            });
    }, []); 

    return <div>{status}</div>;
};

export default VerifyEmail;