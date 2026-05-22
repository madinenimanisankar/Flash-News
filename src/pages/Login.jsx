import React, { useContext, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import AuthForm from '../components/AuthForm';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        // If user is already logged in, redirect to home
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    return (
        <Container className="py-5">
            <AuthForm />
        </Container>
    );
};

export default Login;
