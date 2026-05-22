import React, { useState, useContext } from 'react';
import { Form, Button, Card, Alert, Nav } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthForm = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { login, register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (isRegistering) {
            // Validation
            if (password.length < 6) {
                setError('Password must be at least 6 characters long.');
                return;
            }
            if (!name.trim()) {
                setError('Full Name is required.');
                return;
            }

            const res = register(username.trim(), name.trim(), password);
            if (res.success) {
                setSuccess('Account created successfully! Logging you in...');
                setTimeout(() => {
                    login(username.trim(), password);
                    navigate('/');
                }, 1500);
            } else {
                setError(res.message || 'Registration failed');
            }
        } else {
            if (login(username.trim(), password)) {
                navigate('/');
            } else {
                setError('Invalid username or password');
            }
        }
    };

    return (
        <Card className="shadow mx-auto mt-5" style={{ maxWidth: '450px', borderRadius: '16px' }}>
            <Card.Body className="p-4">
                <Nav variant="underline" className="mb-4 justify-content-center border-bottom-0">
                    <Nav.Item>
                        <Nav.Link 
                            active={!isRegistering} 
                            onClick={() => { setIsRegistering(false); setError(''); setSuccess(''); }}
                            style={{ cursor: 'pointer', fontWeight: '600' }}
                        >
                            Sign In
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link 
                            active={isRegistering} 
                            onClick={() => { setIsRegistering(true); setError(''); setSuccess(''); }}
                            style={{ cursor: 'pointer', fontWeight: '600' }}
                        >
                            Create Account
                        </Nav.Link>
                    </Nav.Item>
                </Nav>

                <h3 className="text-center mb-4 font-bold">
                    {isRegistering ? 'Register for Flash News' : 'Login to Flash News'}
                </h3>
                
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                    {isRegistering && (
                        <Form.Group className="mb-3" controlId="registerName">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter full name"
                                required
                            />
                        </Form.Group>
                    )}

                    <Form.Group className="mb-3" controlId="authUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="authPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={isRegistering ? "At least 6 characters" : "Password"}
                            required
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100 mb-3 py-2">
                        {isRegistering ? 'Register' : 'Login'}
                    </Button>

                    {!isRegistering && (
                        <div className="text-muted text-center small mt-3 p-3 bg-light rounded" style={{ fontSize: '0.85rem' }}>
                            <p className="mb-1 font-semibold">Demo Accounts Available:</p>
                            <div className="d-flex justify-content-around">
                                <span><strong>User:</strong> user1 / password123</span>
                                <span><strong>Admin:</strong> admin / adminpassword</span>
                            </div>
                        </div>
                    )}
                </Form>
            </Card.Body>
        </Card>
    );
};

export default AuthForm;

