import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState("Verifying...");
    
    const { user, updateUser } = useContext(AuthContext); 

    useEffect(() => {
        document.title = "Exotic | Email Megerősítése";
    }, []);

    useEffect(() => {
        const token = searchParams.get("token");
        
        axios.post(`https://localhost:7065/api/auth/verify?token=${encodeURIComponent(token)}`)
            .then(res => {
                setStatus("Verification Successful!");
                
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
