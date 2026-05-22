import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Navbar as BNavbar, Nav, Container, Button } from 'react-bootstrap';

const Navbar = () => {
    const { user, logout, isAdmin } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <BNavbar bg="dark" variant="dark" expand="lg" sticky="top">
            <Container>
                <BNavbar.Brand as={Link} to="/" className="fw-bold text-warning">Flash News</BNavbar.Brand>
                <BNavbar.Toggle aria-controls="basic-navbar-nav" />
                <BNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        {user && (
                            <>
                                <Nav.Link as={Link} to="/bookmarks">Bookmarks</Nav.Link>
                                {isAdmin && <Nav.Link as={Link} to="/manage">Manage News</Nav.Link>}
                                <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                            </>
                        )}
                    </Nav>
                    <Nav>
                        {user ? (
                            <>
                                <BNavbar.Text className="me-3">
                                    Signed in as: <span className="text-light fw-semibold">{user.name || user.username}</span>
                                </BNavbar.Text>
                                <Button variant="outline-light" size="sm" onClick={handleLogout}>Logout</Button>
                            </>
                        ) : (
                            <Nav.Link as={Link} to="/login">
                                <Button variant="warning" size="sm">Login</Button>
                            </Nav.Link>
                        )}
                    </Nav>
                </BNavbar.Collapse>
            </Container>
        </BNavbar>
    );
};

export default Navbar;

