import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, ListGroup, Image } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Comments = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [error, setError] = useState('');
    const { user } = useAuth();
    

    const fetchComments = async () => {
        try {
            const response = await axios.get(`http://localhost:5020/api/comments/post/${postId}`);
            setComments(response.data);
        } catch (error) {
            setError('Errore nel caricamento dei commenti');
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5020/api/comments', {
                content: newComment,
                author: user._id,
                post: postId
            });
            setComments([response.data, ...comments]);
            setNewComment('');
            setError('');
        } catch (error) {
            setError('Errore nella pubblicazione del commento');
        }
    };

    const handleDelete = async (commentId) => {
        try {
            await axios.delete(`http://localhost:5020/api/comments/${commentId}`);
            setComments(comments.filter(comment => comment._id !== commentId));
        } catch (error) {
            setError('Errore nell\'eliminazione del commento');
        }
    };

    return (
        <div className="mt-5">
            <h4 className="text-white">Commenti</h4>
            {error && <Alert variant="danger">{error}</Alert>}
            {user && (
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Scrivi un commento..."
                            required
                        />
                    </Form.Group>
                    <Button type="submit" variant="primary">
                        Pubblica commento
                    </Button>
                </Form>
            )}
            <ListGroup className="mt-4">
                {comments.map(comment => (
                    <ListGroup.Item key={comment._id} className="d-flex justify-content-between align-items-center">
                        <div className="ms-2 me-auto">
                            <div className="mb-2 d-flex align-items-center">
                                <Image
                                    src={comment.author.profileImage || `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${comment.author.firstName}+${comment.author.lastName}`}
                                    roundedCircle
                                    width={40}
                                    height={40} 
                                    className="me-2"
                                />
                                <small className="text-muted">{comment.author.firstName} {comment.author.lastName} ha scritto:</small>
                            </div>
                            {comment.content}
                            <div className="mt-2
                            3">
                                <small className="text-muted">{new Date(comment.createdAt).toLocaleString()}</small>
                            </div>
                        </div>
                        {user && user._id === comment.author._id && (
                            <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDelete(comment._id)}>
                                    Cancella
                                <i className="fas fa-trash"></i>
                            </Button>
                        )}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
};

export default Comments;