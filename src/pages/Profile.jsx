import React, { useContext, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { NewsContext } from '../context/NewsContext';

const Profile = () => {
    const { user, updateProfile } = useContext(AuthContext);
    const { articles } = useContext(NewsContext);

    const [name, setName] = useState(user?.name || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    if (!user) return null;

    // Calculate metrics in real time
    const myArticles = articles.filter(art => art.createdBy === user.username);
    const totalPosts = myArticles.length;
    
    const totalLikesReceived = myArticles.reduce((sum, art) => {
        return sum + (art.likes?.length || 0);
    }, 0);

    let totalCommentsWritten = 0;
    articles.forEach(art => {
        (art.comments || []).forEach(comm => {
            if (comm.username === user.username) {
                totalCommentsWritten++;
            }
        });
    });

    const bookmarks = JSON.parse(localStorage.getItem(`flashNewsBookmarks_${user.username}`)) || [];
    const totalBookmarks = bookmarks.length;

    const handleSave = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!name.trim()) {
            setError('Full Name cannot be empty.');
            return;
        }

        if (password) {
            if (password.length < 6) {
                setError('New password must be at least 6 characters.');
                return;
            }
            if (password !== confirmPassword) {
                setError('Passwords do not match.');
                return;
            }
        }

        const res = updateProfile(name, password);
        if (res.success) {
            setSuccess('Profile updated successfully!');
            setPassword('');
            setConfirmPassword('');
        } else {
            setError(res.message || 'Profile update failed.');
        }
    };

    return (
        <Container className="py-5">
            <div className="text-center mb-5">
                <h1 className="fw-bold display-4">My Profile</h1>
                <p className="lead text-muted">Manage your account and monitor your stats.</p>
            </div>

            {/* Statistics Row */}
            <Row className="mb-5 g-4 text-center">
                <Col xs={6} md={3}>
                    <Card className="border-0 shadow-sm h-100 py-3" style={{ borderRadius: '12px' }}>
                        <Card.Body>
                            <div className="fs-1 mb-2">📰</div>
                            <h5 className="text-muted fw-bold mb-1">Articles Posted</h5>
                            <h2 className="fw-extrabold text-primary mb-0">{totalPosts}</h2>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={6} md={3}>
                    <Card className="border-0 shadow-sm h-100 py-3" style={{ borderRadius: '12px' }}>
                        <Card.Body>
                            <div className="fs-1 mb-2">❤️</div>
                            <h5 className="text-muted fw-bold mb-1">Likes Received</h5>
                            <h2 className="fw-extrabold text-danger mb-0">{totalLikesReceived}</h2>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={6} md={3}>
                    <Card className="border-0 shadow-sm h-100 py-3" style={{ borderRadius: '12px' }}>
                        <Card.Body>
                            <div className="fs-1 mb-2">💬</div>
                            <h5 className="text-muted fw-bold mb-1">Comments Posted</h5>
                            <h2 className="fw-extrabold text-success mb-0">{totalCommentsWritten}</h2>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={6} md={3}>
                    <Card className="border-0 shadow-sm h-100 py-3" style={{ borderRadius: '12px' }}>
                        <Card.Body>
                            <div className="fs-1 mb-2">★</div>
                            <h5 className="text-muted fw-bold mb-1">Saved Bookmarks</h5>
                            <h2 className="fw-extrabold text-warning mb-0">{totalBookmarks}</h2>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Settings Card */}
            <Card className="border-0 shadow mx-auto" style={{ maxWidth: '650px', borderRadius: '16px' }}>
                <Card.Body className="p-4 p-md-5">
                    <h3 className="mb-4 font-bold border-bottom pb-3">Account Settings</h3>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}

                    <Form onSubmit={handleSave}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="profileUsername">
                                    <Form.Label>Username (Read-Only)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={user.username}
                                        disabled
                                        className="bg-light"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="profileName">
                                    <Form.Label>Full Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter full name"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <hr className="my-4" />
                        <h5 className="mb-3 text-secondary">Change Password</h5>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="profilePassword">
                                    <Form.Label>New Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Leave blank to keep current"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-4" controlId="profileConfirmPassword">
                                    <Form.Label>Confirm New Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-end mt-2">
                            <Button type="submit" variant="primary" className="px-5 py-2">
                                Save Changes
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Profile;
