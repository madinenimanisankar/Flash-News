import React, { useContext, useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { NewsContext } from '../context/NewsContext';
import { AuthContext } from '../context/AuthContext';
import NewsList from '../components/NewsList';
import AddEditNewsForm from '../components/AddEditNewsForm';

const ManageNews = () => {
    const { addArticle, editArticle } = useContext(NewsContext);
    const { user } = useContext(AuthContext);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingArticle, setEditingArticle] = useState(null);

    const handleSave = (articleData) => {
        if (editingArticle) {
            editArticle(editingArticle.id, articleData);
            setEditingArticle(null);
        } else {
            addArticle(articleData, user);
            setShowAddForm(false);
        }
    };


    const handleEditInit = (article) => {
        setEditingArticle(article);
        setShowAddForm(false);
        // Scroll to top to see the form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setShowAddForm(false);
        setEditingArticle(null);
    };

    return (
        <Container className="py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Manage News Articles</h2>
                {!showAddForm && !editingArticle && (
                    <Button variant="success" onClick={() => setShowAddForm(true)}>
                        + Add New Article
                    </Button>
                )}
            </div>

            {(showAddForm || editingArticle) && (
                <AddEditNewsForm
                    onSave={handleSave}
                    initialData={editingArticle}
                    onCancel={handleCancel}
                />
            )}

            <hr className="my-5" />

            <h3 className="mb-4">Current Articles</h3>
            <NewsList isManageMode={true} onEdit={handleEditInit} />
        </Container>
    );
};

export default ManageNews;
