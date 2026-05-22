import React, { useState, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap';

const AddEditNewsForm = ({ onSave, initialData, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        image: '',
        status: 'Published'
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        setFormData({ title: '', description: '', category: '', date: new Date().toISOString().split('T')[0], image: '', status: 'Published' });
    };

    return (
        <Card className="shadow-sm mb-4">
            <Card.Body>
                <Card.Title className="mb-4">{initialData ? 'Edit News Article' : 'Add New Article'}</Card.Title>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="newsTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="Enter news title"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="newsCategory">
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Technology, Health, Sports"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="newsDate">
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="newsStatus">
                        <Form.Label>Publishing Status</Form.Label>
                        <Form.Select
                            name="status"
                            value={formData.status || 'Published'}
                            onChange={handleChange}
                        >
                            <option value="Published">Published (Publicly visible)</option>
                            <option value="Draft">Draft (Private draft)</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="newsImage">
                        <Form.Label>Image (URL or Upload)</Form.Label>
                        <div className="d-flex mb-2">
                            <Form.Control
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="Image URL"
                                className="me-2"
                            />
                            <span className="align-self-center mx-2 mt-1">OR</span>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                        {formData.image && (
                            <div className="mt-2 text-center">
                                <img src={formData.image} alt="Preview" style={{ maxHeight: '150px', objectFit: 'cover' }} className="rounded shadow-sm" />
                            </div>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="newsDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            placeholder="Write the full news article here..."
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-end">
                        {onCancel && (
                            <Button variant="secondary" className="me-2" onClick={onCancel}>
                                Cancel
                            </Button>
                        )}
                        <Button variant="primary" type="submit">
                            {initialData ? 'Update Article' : 'Publish Article'}
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default AddEditNewsForm;
