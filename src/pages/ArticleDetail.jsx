import React, { useContext, useState, useEffect } from 'react';
import { Container, Card, Badge, Button, Form, Alert } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { NewsContext } from '../context/NewsContext';
import { AuthContext } from '../context/AuthContext';

const ArticleDetail = () => {
    const { id } = useParams();
    const { articles, toggleLike, addComment, deleteComment } = useContext(NewsContext);
    const { user, isAdmin } = useContext(AuthContext);
    const navigate = useNavigate();

    const [isBookmarked, setIsBookmarked] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [commentError, setCommentError] = useState('');
    const [showShareAlert, setShowShareAlert] = useState(false);

    const article = articles.find(a => a.id === parseInt(id));

    useEffect(() => {
        if (user && article) {
            const bookmarks = JSON.parse(localStorage.getItem(`flashNewsBookmarks_${user.username}`)) || [];
            setIsBookmarked(bookmarks.includes(article.id));
        } else {
            setIsBookmarked(false);
        }
    }, [user, article]);

    if (!article) {
        return (
            <Container className="py-5 text-center">
                <h2>Article not found</h2>
                <Button onClick={() => navigate('/')} variant="primary" className="mt-3">Back to Home</Button>
            </Container>
        );
    }

    const handleBookmarkToggle = () => {
        if (!user) return;

        const storageKey = `flashNewsBookmarks_${user.username}`;
        const bookmarks = JSON.parse(localStorage.getItem(storageKey)) || [];
        
        let updatedBookmarks;
        if (bookmarks.includes(article.id)) {
            updatedBookmarks = bookmarks.filter(bid => bid !== article.id);
            setIsBookmarked(false);
        } else {
            updatedBookmarks = [...bookmarks, article.id];
            setIsBookmarked(true);
        }
        
        localStorage.setItem(storageKey, JSON.stringify(updatedBookmarks));
    };

    const handleShareClick = () => {
        navigator.clipboard.writeText(window.location.href);
        setShowShareAlert(true);
        setTimeout(() => {
            setShowShareAlert(false);
        }, 3000);
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        setCommentError('');

        if (!commentText.trim()) {
            setCommentError('Comment text cannot be empty.');
            return;
        }

        addComment(article.id, commentText.trim(), user);
        setCommentText('');
    };

    // Calculate Read Time dynamically
    const wordsCount = article.description ? article.description.trim().split(/\s+/).length : 0;
    const readTime = Math.max(1, Math.ceil(wordsCount / 200));

    const hasLiked = user && article.likes?.includes(user.username);
    const commentsList = article.comments || [];

    return (
        <Container className="py-5" style={{ maxWidth: '850px' }}>
            {showShareAlert && (
                <Alert 
                    variant="success" 
                    className="py-2 px-3 mb-4 shadow-sm d-flex justify-content-between align-items-center"
                    style={{ borderRadius: '10px' }}
                    onClose={() => setShowShareAlert(false)} 
                    dismissible
                >
                    <span className="fw-semibold">🔗 Link copied to clipboard! Share it with your friends.</span>
                </Alert>
            )}

            <div className="d-flex justify-content-between align-items-center mb-4">
                <Button as={Link} to="/" variant="light" className="shadow-sm border">
                    &larr; Back to News
                </Button>
                <div className="d-flex gap-2">
                    <Button 
                        variant="light" 
                        className="shadow-sm border d-flex align-items-center gap-1 text-muted"
                        onClick={handleShareClick}
                    >
                        <span>🔗</span>
                        <span className="fw-bold">Share</span>
                    </Button>
                    {user && (
                        <>
                            <Button 
                                variant="light" 
                                className={`shadow-sm border d-flex align-items-center gap-1 ${hasLiked ? 'text-danger' : 'text-muted'}`}
                                onClick={() => toggleLike(article.id, user.username)}
                            >
                                <span>{hasLiked ? '❤️' : '🤍'}</span>
                                <span className="fw-bold">{article.likes?.length || 0} Likes</span>
                            </Button>
                            <Button 
                                variant="light" 
                                className="shadow-sm border d-flex align-items-center gap-1"
                                onClick={handleBookmarkToggle}
                            >
                                <span style={{ fontSize: '1.1rem' }}>{isBookmarked ? '★' : '☆'}</span>
                                <span className="fw-bold">{isBookmarked ? 'Saved' : 'Bookmark'}</span>
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <Card className="shadow border-0 mb-5 overflow-hidden" style={{ borderRadius: '16px' }}>
                <Card.Img
                    variant="top"
                    src={article.image || 'https://via.placeholder.com/800x400?text=News+Image'}
                    style={{ maxHeight: '420px', objectFit: 'cover' }}
                />
                <Card.Body className="p-4 p-md-5">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <Badge bg="primary" className="fs-6 px-3 py-2">{article.category}</Badge>
                        <span className="text-muted fw-semibold">{article.date}</span>
                    </div>

                    <Card.Title className="display-5 fw-bold mb-4" style={{ color: '#0F172A' }}>{article.title}</Card.Title>
                    
                    <div className="d-flex align-items-center gap-3 text-muted mb-4 pb-3 border-bottom" style={{ fontSize: '0.95rem' }}>
                        <div>By <strong className="text-dark">{article.author || 'Admin User'}</strong></div>
                        <div>•</div>
                        <div>⏱️ {readTime} min read</div>
                        <div>•</div>
                        <div>💬 {commentsList.length} comments</div>
                    </div>

                    <Card.Text className="fs-5" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', color: '#334155' }}>
                        {article.description}
                    </Card.Text>
                </Card.Body>
            </Card>

            {/* Comments Section */}
            <div className="bg-white rounded p-4 p-md-5 shadow-sm border" style={{ borderRadius: '16px' }}>
                <h3 className="mb-4 font-bold border-bottom pb-3">Comments ({commentsList.length})</h3>

                {/* Comment Form */}
                {user ? (
                    <Form onSubmit={handleCommentSubmit} className="mb-5">
                        <Form.Group className="mb-3" controlId="newCommentText">
                            <Form.Label className="fw-semibold">Join the discussion</Form.Label>
                            {commentError && <Alert variant="danger" className="py-2">{commentError}</Alert>}
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Add your perspective..."
                                required
                                style={{ borderRadius: '10px' }}
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end">
                            <Button type="submit" variant="primary" className="px-4">
                                Post Comment
                            </Button>
                        </div>
                    </Form>
                ) : (
                    <Alert variant="warning" className="mb-5" style={{ borderRadius: '10px' }}>
                        Please <Link to="/login" className="alert-link font-bold text-decoration-none">login</Link> to share a comment on this story.
                    </Alert>
                )}

                {/* Comments List */}
                {commentsList.length === 0 ? (
                    <div className="text-center py-4 text-muted">
                        <p className="mb-0">No comments yet. Be the first to share your thoughts!</p>
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-4">
                        {commentsList.map((comment) => {
                            const initials = comment.name ? comment.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'US';
                            const isCommentOwner = user && comment.username === user.username;
                            
                            return (
                                <div key={comment.id} className="d-flex gap-3 pb-3 border-bottom align-items-start">
                                    <div 
                                        className="d-flex align-items-center justify-content-center text-white bg-secondary rounded-circle fw-bold shadow-sm"
                                        style={{ width: '40px', height: '40px', flexShrink: 0, fontSize: '0.9rem' }}
                                    >
                                        {initials}
                                    </div>
                                    <div className="w-100">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <span className="fw-bold" style={{ color: '#1E293B' }}>{comment.name || comment.username}</span>
                                            <span className="text-muted small">{comment.date}</span>
                                        </div>
                                        <p className="mb-0 text-secondary" style={{ whiteSpace: 'pre-wrap', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                            {comment.text}
                                        </p>
                                        {(isCommentOwner || isAdmin) && (
                                            <div className="d-flex justify-content-end mt-2">
                                                <Button 
                                                    variant="link" 
                                                    size="sm" 
                                                    className="text-danger p-0 text-decoration-none small fw-semibold"
                                                    onClick={() => deleteComment(article.id, comment.id)}
                                                >
                                                    🗑️ Delete Comment
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </Container>
    );
};

export default ArticleDetail;

