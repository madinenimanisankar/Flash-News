import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import ManageNews from './pages/ManageNews';
import ArticleDetail from './pages/ArticleDetail';
import Bookmarks from './pages/Bookmarks';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { NewsProvider } from './context/NewsContext';

function App() {
    return (
        <AuthProvider>
            <NewsProvider>
                <div className="min-vh-100 bg-light">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />

                        {/* Protected Routes */}
                        <Route
                            path="/article/:id"
                            element={
                                <ProtectedRoute>
                                    <ArticleDetail />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/bookmarks"
                            element={
                                <ProtectedRoute>
                                    <Bookmarks />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />

                        {/* Manage News (Only open to Admins) */}
                        <Route
                            path="/manage"
                            element={
                                <ProtectedRoute requireAdmin={true}>
                                    <ManageNews />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </div>
            </NewsProvider>
        </AuthProvider>
    );
}

export default App;

