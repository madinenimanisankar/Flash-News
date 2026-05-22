import React, { createContext, useState, useEffect } from 'react';
import { dummyUsers } from '../data/dummyData';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Initialize users list from localStorage or dummyData
        const storedUsers = localStorage.getItem('flashNewsUsers');
        if (storedUsers) {
            setUsers(JSON.parse(storedUsers));
        } else {
            setUsers(dummyUsers);
            localStorage.setItem('flashNewsUsers', JSON.stringify(dummyUsers));
        }

        // Check local storage for an existing session on load
        const storedUser = localStorage.getItem('flashNewsUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (username, password) => {
        const currentUsers = JSON.parse(localStorage.getItem('flashNewsUsers')) || users;
        const foundUser = currentUsers.find(
            (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
        );
        if (foundUser) {
            const userToStore = { id: foundUser.id, username: foundUser.username, role: foundUser.role, name: foundUser.name };
            setUser(userToStore);
            localStorage.setItem('flashNewsUser', JSON.stringify(userToStore));
            return true;
        }
        return false;
    };

    const register = (username, name, password) => {
        const currentUsers = JSON.parse(localStorage.getItem('flashNewsUsers')) || users;
        const userExists = currentUsers.some(
            (u) => u.username.toLowerCase() === username.toLowerCase()
        );

        if (userExists) {
            return { success: false, message: 'Username is already taken' };
        }

        const newUser = {
            id: Date.now(),
            username,
            name,
            password,
            role: 'normal'
        };

        const updatedUsers = [...currentUsers, newUser];
        setUsers(updatedUsers);
        localStorage.setItem('flashNewsUsers', JSON.stringify(updatedUsers));
        return { success: true };
    };

    const updateProfile = (name, password) => {
        if (!user) return { success: false, message: 'Not authenticated' };

        const currentUsers = JSON.parse(localStorage.getItem('flashNewsUsers')) || users;
        const updatedUsers = currentUsers.map((u) => {
            if (u.username === user.username) {
                return { ...u, name: name.trim(), password: password || u.password };
            }
            return u;
        });

        setUsers(updatedUsers);
        localStorage.setItem('flashNewsUsers', JSON.stringify(updatedUsers));

        // Update active session
        const updatedUser = { ...user, name: name.trim() };
        setUser(updatedUser);
        localStorage.setItem('flashNewsUser', JSON.stringify(updatedUser));

        // Dynamically update author name on all their articles in localStorage
        const storedArticles = localStorage.getItem('flashNewsArticles');
        if (storedArticles) {
            const articlesList = JSON.parse(storedArticles);
            const updatedArticlesList = articlesList.map(art => {
                if (art.createdBy === user.username) {
                    return { ...art, author: name.trim() };
                }
                return art;
            });
            localStorage.setItem('flashNewsArticles', JSON.stringify(updatedArticlesList));
        }

        return { success: true };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('flashNewsUser');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, updateProfile, logout, isAdmin: user?.role === 'admin' }}>
            {children}
        </AuthContext.Provider>
    );
};


