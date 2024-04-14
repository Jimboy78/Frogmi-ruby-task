import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

function CommentsForm({ onCommentSubmit, featureId }) {
  const [comment, setComment] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch(`http://localhost:8000/api/features/${featureId}/comments`, {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ comment: { content: comment, feature_id: featureId } }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        if (onCommentSubmit) onCommentSubmit(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
  );
}

export default CommentsForm;
