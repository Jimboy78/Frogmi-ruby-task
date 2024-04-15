import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link, Button, TablePagination, Box, Typography, Container, CircularProgress } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useEarthquakes } from '../contexts/EarthquakeContext';

function EarthquakeList() {
  const { earthquakes, setEarthquakes } = useEarthquakes();
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 0,
    total_count: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchEarthquakes = (page, rowsPerPage) => {
    setIsLoading(true);
    setEarthquakes([]);

    fetch(`http://localhost:8000/api/v1/earthquakes?page=${page}&per_page=${rowsPerPage}`)
      .then((response) => response.json())
      .then((data) => {
        setEarthquakes(data.earthquakes || []);
        setPagination({
          current_page: data.pagination.current_page,
          total_pages: data.pagination.total_pages,
          total_count: data.pagination.total_count,
        });
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchEarthquakes(pagination.current_page, rowsPerPage);
  }, [pagination.current_page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    fetchEarthquakes(newPage + 1, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    fetchEarthquakes(pagination.current_page, parseInt(event.target.value, 10));
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Earthquake Data
      </Typography>
      <Paper sx={{ width: '100%', overflow: 'hidden', position: 'relative' }}>
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: 'rgba(255,255,255,0.8)', zIndex: 1 }}>
            <CircularProgress />
          </Box>
        )}
        <TableContainer component={Paper}>
          <Table aria-label="Earthquake Data Table" sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell align="right">Magnitude</TableCell>
                <TableCell align="right">Place</TableCell>
                <TableCell align="right">Time</TableCell>
                <TableCell align="right">Depth (km)</TableCell>
                <TableCell align="right">Type</TableCell>
                <TableCell align="right">Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {earthquakes.map((earthquake, index) => (
                <TableRow key={index} hover>
                  <TableCell component="th" scope="row">{earthquake.title || "N/A"}</TableCell>
                  <TableCell align="right">{earthquake.magnitude || "N/A"}</TableCell>
                  <TableCell align="right">{earthquake.place || "N/A"}</TableCell>
                  <TableCell align="right">{new Date(earthquake.time * 1000).toLocaleString() || "N/A"}</TableCell>
                  <TableCell align="right">{earthquake.depth ? `${earthquake.depth} km` : "N/A"}</TableCell>
                  <TableCell align="right">{earthquake.magType || "N/A"}</TableCell>
                  <TableCell align="right">
                    <RouterLink to={`/earthquake/${earthquake.id}`}>Details</RouterLink>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component="div"
          count={pagination.total_count}
          rowsPerPage={rowsPerPage}
          page={pagination.current_page - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
}

export default EarthquakeList;
