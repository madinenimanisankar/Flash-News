import React, { useContext, useState, useEffect } from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { NewsContext } from '../context/NewsContext';

const NewsCard = ({ article, isManageMode, onDelete, onEdit, onBookmarkChange }) => {
    const { user, isAdmin } = useContext(AuthContext);
    const { toggleLike } = useContext(NewsContext);
    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
        if (user) {
            const bookmarks = JSON.parse(localStorage.getItem(`flashNewsBookmarks_${user.username}`)) || [];
            setIsBookmarked(bookmarks.includes(article.id));
        } else {
            setIsBookmarked(false);
        }
    }, [user, article.id]);

    const handleBookmarkToggle = (e) => {
        e.preventDefault();
        if (!user) return;

        const storageKey = `flashNewsBookmarks_${user.username}`;
        const bookmarks = JSON.parse(localStorage.getItem(storageKey)) || [];
        
        let updatedBookmarks;
        if (bookmarks.includes(article.id)) {
            updatedBookmarks = bookmarks.filter(id => id !== article.id);
            setIsBookmarked(false);
        } else {
            updatedBookmarks = [...bookmarks, article.id];
            setIsBookmarked(true);
        }
        
        localStorage.setItem(storageKey, JSON.stringify(updatedBookmarks));
        if (onBookmarkChange) {
            onBookmarkChange();
        }
    };

    // Calculate Read Time dynamically
    const wordsCount = article.description ? article.description.trim().split(/\s+/).length : 0;
    const readTime = Math.max(1, Math.ceil(wordsCount / 200));

    const hasLiked = user && article.likes?.includes(user.username);
    const canManage = isAdmin;

    return (
        <Card 
            className="h-100 shadow-sm border-0 position-relative"
            style={{ 
                border: article.status === 'Draft' ? '2.5px dashed #f59e0b' : 'none',
                backgroundColor: article.status === 'Draft' ? '#fcfbf7' : 'var(--card-bg)'
            }}
        >
            {user && (
                <button
                    onClick={handleBookmarkToggle}
                    className="position-absolute border-0 bg-white rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                    style={{
                        top: '12px',
                        right: '12px',
                        width: '36px',
                        height: '36px',
                        zIndex: 10,
                        cursor: 'pointer',
                        fontSize: '1.2rem',
                        transition: 'transform 0.2s'
                    }}
                    title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    {isBookmarked ? '★' : '☆'}
                </button>
            )}

            <Card.Img
                variant="top"
                src={article.image || 'https://via.placeholder.com/800x400?text=News+Image'}
                style={{ height: '200px', objectFit: 'cover' }}
            />
            <Card.Body className="d-flex flex-column p-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                        <Badge bg="primary">{article.category}</Badge>
                        {article.status === 'Draft' && (
                            <Badge bg="warning" text="dark" className="ms-2">DRAFT</Badge>
                        )}
                    </div>
                    <small className="text-muted d-flex align-items-center gap-1">
                        <span>⏱️ {readTime} min read</span>
                    </small>
                </div>
                <Card.Title className="h5 mb-2 font-bold">{article.title}</Card.Title>
                <div className="text-muted small mb-3">
                    By <strong>{article.author || 'Admin User'}</strong> • {article.date}
                </div>
                <Card.Text className="text-truncate mb-4" style={{ maxHeight: '3.6rem', whiteSpace: 'normal', overflow: 'hidden', color: 'var(--text-muted)' }}>
                    {article.description}
                </Card.Text>
                
                <div className="mt-auto d-flex justify-content-between align-items-center pt-3 border-top">
                    <div className="d-flex align-items-center gap-2">
                        <Button as={Link} to={`/article/${article.id}`} variant="outline-primary" size="sm" className="px-3">
                            Read More
                        </Button>
                        {user && (
                            <Button 
                                variant="light" 
                                size="sm" 
                                className={`d-flex align-items-center gap-1 border-0 ${hasLiked ? 'text-danger' : 'text-muted'}`}
                                onClick={() => toggleLike(article.id, user.username)}
                            >
                                <span>{hasLiked ? '❤️' : '🤍'}</span>
                                <small className="fw-bold">{article.likes?.length || 0}</small>
                            </Button>
                        )}
                    </div>
                    {isManageMode && canManage && (
                        <div>
                            <Button variant="warning" size="sm" className="me-2 px-3" onClick={() => onEdit(article)}>Edit</Button>
                            <Button variant="danger" size="sm" className="px-3" onClick={() => onDelete(article.id)}>Delete</Button>
                        </div>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
};

export default NewsCard;

