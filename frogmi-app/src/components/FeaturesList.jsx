import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link, Button, TablePagination } from '@mui/material';

function FeaturesList() {
  const [features, setFeatures] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 0,
    total_count: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchFeatures = (page, rowsPerPage) => {
    setIsLoading(true);
    console.log("Fetching data from API...");

    fetch(`http://localhost:8000/api/features?page=${page}&per_page=${rowsPerPage}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Data received:", data);
        setFeatures(data.earthquakes || []);
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
    fetchFeatures(pagination.current_page, rowsPerPage);
  }, [pagination.current_page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    fetchFeatures(newPage + 1, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    fetchFeatures(1, parseInt(event.target.value, 10));
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table aria-label="Earthquake Data Table">
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
            {features.map((feature, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">{feature.title || "N/A"}</TableCell>
                <TableCell align="right">{feature.magnitude || "N/A"}</TableCell>
                <TableCell align="right">{feature.place || "N/A"}</TableCell>
                <TableCell align="right">{feature.time ? new Date(feature.time * 1000).toLocaleString() : "N/A"}</TableCell>
                <TableCell align="right">{feature.depth ? `${feature.depth} km` : "N/A"}</TableCell>
                <TableCell align="right">{feature.magType || "N/A"}</TableCell>
                <TableCell align="right">{feature.url ? <Link href={feature.url} target="_blank">Link</Link> : "N/A"}</TableCell>
              </TableRow>
            ))}
            {isLoading && (
              <TableRow>
                <TableCell colSpan={7} align="center">Loading data...</TableCell>
              </TableRow>
            )}
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
    </div>
  );
}

export default FeaturesList;
