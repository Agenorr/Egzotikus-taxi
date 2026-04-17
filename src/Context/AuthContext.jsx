import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
});
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            setIsLoggedIn(true);

            if (parsedUser && parsedUser.id) {
                axios.get(`https://localhost:7065/api/auth/me/${parsedUser.id}`)
                    .then(res => {
                        const freshUser = res.data;
                        setUser(freshUser);
                        localStorage.setItem('user', JSON.stringify(freshUser));
                    })
                    .catch(err => {
                        console.error("Could not sync latest user data:", err);
                        if (err.response && err.response.status === 404) {
                            logout();
                        }
                    });
            }
        }
    }, []);

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