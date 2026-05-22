import React from 'react';
import { Container } from 'react-bootstrap';
import NewsList from '../components/NewsList';

const Bookmarks = () => {
    return (
        <Container className="py-5">
            <div className="text-center mb-5">
                <h1 className="fw-bold display-4">Saved Articles</h1>
                <p className="lead text-muted">Review the stories and headlines you've bookmarked.</p>
            </div>
            <NewsList isBookmarkMode={true} />
        </Container>
    );
};

export default Bookmarks;
