import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, Button, Link, Box } from '@mui/material';
import CommentsForm from './CommentsForm';
import { useEarthquakes } from '../contexts/EarthquakeContext';

function EarthquakeDetails() {
    const { earthquakeId } = useParams();
    const { earthquakes } = useEarthquakes();
    const earthquake = earthquakes.find(eq => eq.id.toString() === earthquakeId);

    const [comments, setComments] = useState([]);

    useEffect(() => {
        async function fetchEarthquakeAndComments() {
            if (!earthquake) {
                try {
                    const res = await fetch(`http://localhost:8000/api/v1/earthquakes/${earthquakeId}`);
                    const data = await res.json();
                    
                } catch (error) {
                    console.error('Failed to fetch earthquake details:', error);
                }
            }

            try {
                const res = await fetch(`http://localhost:8000/api/v1/earthquakes/${earthquakeId}/comments`);
                const data = await res.json();
                setComments(data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))); 
            } catch (error) {
                console.error('Failed to fetch comments:', error);
            }
        }

        fetchEarthquakeAndComments();
    }, [earthquakeId, earthquake]);

    const handleAddComment = (newComment) => {
        setComments(prevComments => [newComment, ...prevComments]); 
    };

    if (!earthquake) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography variant="h4" component="h2">Earthquake details not found</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, m: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>Earthquake Details</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Card raised>
                        <CardContent>
                            <Typography variant="h5" component="h2" gutterBottom>{earthquake.title}</Typography>
                            <Typography variant="body1" color="textSecondary">Magnitude: {earthquake.magnitude} {earthquake.magType}</Typography>
                            <Typography variant="body1" color="textSecondary">Location: {earthquake.place}</Typography>
                            <Typography variant="body1" color="textSecondary">Time: {new Date(earthquake.time * 1000).toLocaleString()}</Typography>
                            <Typography variant="body1" color="textSecondary">Depth: {earthquake.depth} km</Typography>
                            <Typography variant="body1" color="textSecondary">Coordinates: {earthquake.latitude}, {earthquake.longitude}</Typography>
                            <Typography variant="body1" color="textSecondary">Tsunami: {earthquake.tsunami ? 'Yes' : 'No'}</Typography>
                            <Typography variant="body1" color="textSecondary">
                                <Link href={earthquake.url} target="_blank" rel="noopener noreferrer">More Info</Link>
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <CommentsForm earthquakeId={earthquakeId} onAddComment={handleAddComment} />
                </Grid>
                <Grid item xs={12}>
                    <Card raised>
                        <CardContent>
                            <Typography variant="h6" component="h3">Comments</Typography>
                            {comments.length > 0 ? comments.map((comment, index) => (
                                <Typography key={index} variant="body2" style={{ marginTop: '10px' }}>
                                    {comment.body} - {new Date(comment.created_at).toLocaleString()}
                                </Typography>
                            )) : <Typography variant="body2" color="textSecondary">No comments yet.</Typography>}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Box mt={2}>
                <Button variant="outlined" color="primary" component={RouterLink} to="/">
                    Back to list
                </Button>
            </Box>
        </Box>
    );
}

export default EarthquakeDetails;
