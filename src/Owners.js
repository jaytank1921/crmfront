// src/Owners.js
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Box
} from '@mui/material';

const ownersData = [
  { id: 1, property: 'Villa', address: '123 Main St', type: 'Sell', agreement: 'Signed' },
  { id: 2, property: 'Apartment', address: '456 Oak Ave', type: 'Rent', agreement: 'Pending' },
  { id: 3, property: 'Condo', address: '789 Pine Rd', type: 'Sell', agreement: 'Signed' },
];

const Owners = () => {
  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Navbar /> {/* Navigation bar at the top */}

      {/* Heading */}
      <Typography variant="h3" sx={{ textAlign: 'center', mb: 2 }}>
        Owners Details
      </Typography>

      {/* Table */}
      <TableContainer component={Paper} sx={{ width: '80%', margin: 'auto', boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'skyblue' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Property</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Address</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Sell or Rent</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Agreement</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ownersData.map(owner => (
              <TableRow key={owner.id}>
                <TableCell>{owner.property}</TableCell>
                <TableCell>{owner.address}</TableCell>
                <TableCell>{owner.type}</TableCell>
                <TableCell>{owner.agreement}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Button to go back to home page */}
      <Box textAlign="center" sx={{ mt: 3 }}>
        <Button
          variant="contained"
          component={Link}
          to="/home"
          sx={{ backgroundColor: 'skyblue', color: 'white' }}
        >
          Home Page
        </Button>
      </Box>
    </Box>
  );
};

export default Owners;
