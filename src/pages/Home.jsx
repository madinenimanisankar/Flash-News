import React, { useContext, useState } from 'react';
import { Container, Badge, Button, Form } from 'react-bootstrap';
import NewsList from '../components/NewsList';
import { NewsContext } from '../context/NewsContext';

const Home = () => {
    const { articles } = useContext(NewsContext);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('Newest');

    // Extract unique categories from published articles
    const publishedArticles = articles.filter(a => a.status !== 'Draft');
    const categories = ['All', ...new Set(publishedArticles.map(a => a.category))];

    return (
        <Container className="py-5" style={{ maxWidth: '1200px' }}>
            {/* Live Breaking News Ticker */}
            {publishedArticles.length > 0 && (
                <div className="d-flex align-items-center bg-dark text-white rounded shadow-sm mb-4 p-2" style={{ height: '42px', overflow: 'hidden' }}>
                    <Badge 
                        bg="danger" 
                        className="text-uppercase px-3 py-2 me-3 fw-bold" 
                        style={{ fontSize: '0.75rem', letterSpacing: '1px', flexShrink: 0, borderRadius: '4px' }}
                    >
                        Breaking
                    </Badge>
                    <div style={{ flexGrow: 1, whiteSpace: 'nowrap', overflow: 'hidden' }}>
                        <marquee 
                            scrollamount="5" 
                            className="fw-semibold text-white-50 align-middle" 
                            style={{ cursor: 'pointer' }}
                            onMouseOver={(e) => e.target.stop()} 
                            onMouseOut={(e) => e.target.start()}
                        >
                            {publishedArticles.slice(0, 5).map((a, idx) => (
                                <span key={a.id} className="me-5">
                                    <span className="text-warning">⚡</span> {a.title} 
                                    <span className="text-white-50 small ms-2">({a.category})</span>
                                </span>
                            ))}
                        </marquee>
                    </div>
                </div>
            )}

            <div className="text-center mb-5 mt-3">
                <h1 className="fw-bold display-4 text-dark" style={{ letterSpacing: '-1.5px' }}>Flash News Network</h1>
                <p className="lead text-secondary">Discover insightful stories, breaking headlines, and global perspectives.</p>
            </div>

            {/* Horizontal Scrollable Category Filter Bar */}
            <div 
                className="d-flex gap-2 overflow-auto pb-3 mb-4 scrollbar-hidden" 
                style={{ 
                    whiteSpace: 'nowrap', 
                    scrollbarWidth: 'none', /* Firefox */
                    msOverflowStyle: 'none' /* IE/Edge */
                }}
            >
                {categories.map(cat => (
                    <Button
                        key={cat}
                        variant={selectedCategory === cat ? 'primary' : 'light'}
                        onClick={() => setSelectedCategory(cat)}
                        className="rounded-pill px-4 py-2 border shadow-sm"
                        style={{
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            transition: 'all 0.2s',
                        }}
                    >
                        {cat}
                    </Button>
                ))}
            </div>

            {/* Sort Controls & Section Header */}
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4 pb-2 border-bottom">
                <h3 className="fw-bold mb-0 text-dark" style={{ letterSpacing: '-0.5px' }}>
                    {selectedCategory === 'All' ? 'Latest Headlines' : `${selectedCategory} Articles`}
                </h3>
                <div className="d-flex align-items-center gap-2">
                    <span className="text-muted small fw-bold text-nowrap">Sort By:</span>
                    <Form.Select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{ width: '160px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                        className="shadow-sm fw-semibold"
                    >
                        <option value="Newest">📅 Newest</option>
                        <option value="Oldest">⏳ Oldest</option>
                        <option value="Popular">🔥 Popular</option>
                    </Form.Select>
                </div>
            </div>

            {/* News List */}
            <NewsList 
                selectedCategory={selectedCategory === 'All' ? '' : selectedCategory} 
                sortBy={sortBy} 
            />
        </Container>
    );
};

export default Home;
