import React, { createContext, useState, useEffect } from 'react';
import { dummyArticles } from '../data/dummyData';

export const NewsContext = createContext();

export const NewsProvider = ({ children }) => {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        // Load articles from localStorage or default dummy data
        const storedArticles = localStorage.getItem('flashNewsArticles');
        if (storedArticles) {
            setArticles(JSON.parse(storedArticles));
        } else {
            // Add initial structure to dummyArticles if they don't have them
            const structuredDummy = dummyArticles.map(art => ({
                ...art,
                createdBy: 'admin',
                author: 'Admin User',
                likes: [],
                comments: [],
                status: 'Published'
            }));
            setArticles(structuredDummy);
            localStorage.setItem('flashNewsArticles', JSON.stringify(structuredDummy));
        }
    }, []);

    const addArticle = (article, user) => {
        const newArticle = {
            status: 'Published', // Default status if not provided
            ...article,
            id: Date.now(),
            createdBy: user ? user.username : 'admin',
            author: user ? user.name : 'Admin User',
            likes: [],
            comments: []
        };
        const updatedArticles = [newArticle, ...articles];
        setArticles(updatedArticles);
        localStorage.setItem('flashNewsArticles', JSON.stringify(updatedArticles));
    };


    const editArticle = (id, updatedData) => {
        const updatedArticles = articles.map((article) =>
            article.id === id ? { ...article, ...updatedData } : article
        );
        setArticles(updatedArticles);
        localStorage.setItem('flashNewsArticles', JSON.stringify(updatedArticles));
    };

    const deleteArticle = (id) => {
        const updatedArticles = articles.filter((article) => article.id !== id);
        setArticles(updatedArticles);
        localStorage.setItem('flashNewsArticles', JSON.stringify(updatedArticles));
    };

    const toggleLike = (articleId, username) => {
        const updatedArticles = articles.map((article) => {
            if (article.id === articleId) {
                const likes = article.likes || [];
                const updatedLikes = likes.includes(username)
                    ? likes.filter((name) => name !== username)
                    : [...likes, username];
                return { ...article, likes: updatedLikes };
            }
            return article;
        });
        setArticles(updatedArticles);
        localStorage.setItem('flashNewsArticles', JSON.stringify(updatedArticles));
    };

    const addComment = (articleId, commentText, user) => {
        const updatedArticles = articles.map((article) => {
            if (article.id === articleId) {
                const comments = article.comments || [];
                const newComment = {
                    id: Date.now(),
                    username: user.username,
                    name: user.name,
                    text: commentText,
                    date: new Date().toISOString().split('T')[0]
                };
                return { ...article, comments: [...comments, newComment] };
            }
            return article;
        });
        setArticles(updatedArticles);
        localStorage.setItem('flashNewsArticles', JSON.stringify(updatedArticles));
    };

    const deleteComment = (articleId, commentId) => {
        const updatedArticles = articles.map((article) => {
            if (article.id === articleId) {
                const comments = article.comments || [];
                const updatedComments = comments.filter((comment) => comment.id !== commentId);
                return { ...article, comments: updatedComments };
            }
            return article;
        });
        setArticles(updatedArticles);
        localStorage.setItem('flashNewsArticles', JSON.stringify(updatedArticles));
    };

    return (
        <NewsContext.Provider value={{
            articles,
            addArticle,
            editArticle,
            deleteArticle,
            toggleLike,
            addComment,
            deleteComment
        }}>
            {children}
        </NewsContext.Provider>
    );
};

