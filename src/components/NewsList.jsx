import React, { useContext, useState, useEffect } from 'react';
import { Row, Col, Form, InputGroup } from 'react-bootstrap';
import NewsCard from './NewsCard';
import { NewsContext } from '../context/NewsContext';
import { AuthContext } from '../context/AuthContext';

const NewsList = ({ isManageMode = false, isBookmarkMode = false, onEdit, sortBy = 'Newest', selectedCategory }) => {
    const { articles, deleteArticle } = useContext(NewsContext);
    const { user } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [showOnlyMine, setShowOnlyMine] = useState(false);
    const [bookmarkIds, setBookmarkIds] = useState([]);

    const loadBookmarks = () => {
        if (user) {
            const bookmarks = JSON.parse(localStorage.getItem(`flashNewsBookmarks_${user.username}`)) || [];
            setBookmarkIds(bookmarks);
        } else {
            setBookmarkIds([]);
        }
    };

    useEffect(() => {
        loadBookmarks();
    }, [user, isBookmarkMode]);

    // Extract unique categories for dropdown
    const categories = [...new Set(articles.map(a => a.category))];

    const filteredArticles = articles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        const activeCategory = selectedCategory !== undefined ? selectedCategory : categoryFilter;
        const matchesCategory = activeCategory ? article.category === activeCategory : true;
        
        let matchesBookmark = true;
        if (isBookmarkMode) {
            matchesBookmark = bookmarkIds.includes(article.id);
        }

        let matchesCreator = true;
        if (isManageMode && showOnlyMine && user) {
            matchesCreator = article.createdBy === user.username;
        }

        let matchesStatus = true;
        if (article.status === 'Draft') {
            matchesStatus = isManageMode && user && article.createdBy === user.username;
        }

        return matchesSearch && matchesCategory && matchesBookmark && matchesCreator && matchesStatus;
    });

    const sortedArticles = [...filteredArticles].sort((a, b) => {
        if (sortBy === 'Popular') {
            const likesA = a.likes?.length || 0;
            const likesB = b.likes?.length || 0;
            if (likesB !== likesA) return likesB - likesA;
            return b.id - a.id;
        } else if (sortBy === 'Oldest') {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            if (dateA - dateB !== 0) return dateA - dateB;
            return a.id - b.id;
        } else {
            // Newest by default
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            if (dateB - dateA !== 0) return dateB - dateA;
            return b.id - a.id;
        }
    });

    return (
        <div>
            <Row className="mb-4 align-items-center">
                <Col md={isManageMode ? 5 : (selectedCategory !== undefined ? 12 : 6)} className="mb-2 mb-md-0">
                    <InputGroup>
                        <InputGroup.Text className="bg-white border-end-0">
                            🔍
                        </InputGroup.Text>
                        <Form.Control
                            placeholder="Search news by title or keyword..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border-start-0"
                        />
                    </InputGroup>
                </Col>
                {selectedCategory === undefined && (
                    <Col md={isManageMode ? 3 : 4} className="mb-2 mb-md-0">
                        <Form.Select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </Form.Select>
                    </Col>
                )}
                {isManageMode && user && (
                    <Col md={4} className="d-flex align-items-center pt-2 pt-md-0">
                        <Form.Check 
                            type="switch"
                            id="show-only-mine"
                            label="Show only my articles"
                            checked={showOnlyMine}
                            onChange={(e) => setShowOnlyMine(e.target.checked)}
                            className="fw-semibold text-secondary"
                        />
                    </Col>
                )}
            </Row>

            {sortedArticles.length === 0 ? (
                <div className="text-center py-5 bg-white rounded shadow-sm border p-5">
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                        {isBookmarkMode ? '⭐' : '📰'}
                    </div>
                    <h4 className="text-muted mb-2">
                        {isBookmarkMode 
                            ? 'No bookmarked articles yet.' 
                            : 'No news articles found.'}
                    </h4>
                    <p className="text-muted small mb-0">
                        {isBookmarkMode 
                            ? 'Bookmark articles from the home page to read them later!' 
                            : 'Try adjusting your search filters or category selects.'}
                    </p>
                </div>
            ) : (
                <Row xs={1} md={2} lg={3} className="g-4">
                    {sortedArticles.map(article => (
                        <Col key={article.id}>
                            <NewsCard
                                article={article}
                                isManageMode={isManageMode}
                                onDelete={deleteArticle}
                                onEdit={onEdit}
                                onBookmarkChange={loadBookmarks}
                            />
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default NewsList;

