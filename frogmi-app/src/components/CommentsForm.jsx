import React, { useState, useRef } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';

function CommentsForm({ earthquakeId, onAddComment }) {
    const [comment, setComment] = useState('');  
    const [error, setError] = useState('');     
    const commentInputRef = useRef(null);       
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        setLoading(true);
        event.preventDefault();  
        if (!comment.trim()) {   
            setError('Comment cannot be empty.');  
            return;
        }
        try {
            const response = await fetch(`http://localhost:8000/api/v1/earthquakes/${earthquakeId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ comment: { body: comment } }) 
            });
            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.error || 'Failed to post comment. Please try again.');
            }
            const newComment = await response.json();
            onAddComment(newComment);
            setComment('');
             
            setError('');  
            if (commentInputRef.current) {
                commentInputRef.current.focus();  
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false); 
        }
    }

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
                margin="normal"
                required
                fullWidth
                label="New Comment"
                autoFocus
                value={comment}
                onChange={(e) => {
                    setComment(e.target.value);  
                    if (error) setError('');  
                }}
                inputRef={commentInputRef}  
            />
            {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                    {error}  
                </Typography>
            )}
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading} 
            >
                {loading ? "Posting..." : "Post Comment"}  
            </Button>
        </Box>
    );
}

export default CommentsForm;
