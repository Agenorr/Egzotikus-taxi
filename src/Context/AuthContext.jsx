import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // 1. Immediately load the user from Local Storage for a fast UI
        const savedUser = localStorage.getItem('user');
        
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            setIsLoggedIn(true);

            // 2. SILENT BACKGROUND SYNC: 
            // Ask the backend for the absolute latest data for this user ID
            if (parsedUser && parsedUser.id) {
                axios.get(`https://localhost:7065/api/auth/me/${parsedUser.id}`)
                    .then(res => {
                        const freshUser = res.data;
                        // Overwrite React memory and Local Storage with the fresh DB data!
                        setUser(freshUser);
                        localStorage.setItem('user', JSON.stringify(freshUser));
                    })
                    .catch(err => {
                        console.error("Could not sync latest user data:", err);
                        // Optional: If the backend returns 404 (user deleted), log them out automatically
                        if (err.response && err.response.status === 404) {
                            logout();
                        }
                    });
            }
        }
    }, []); // Empty array means this runs once every time the website is opened/refreshed

    const login = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        setIsLoggedIn(false);
    };

    const updateUser = (updatedUserData) => {
        localStorage.setItem('user', JSON.stringify(updatedUserData));
        setUser(updatedUserData);
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};