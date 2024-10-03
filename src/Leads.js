import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Box,
} from '@mui/material';

// Create a Supabase client instance
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Leads = () => {
  const [contactValue, setContactValue] = useState('');
  const [fieldValue, setFieldValue] = useState('');
  const [nameValue, setNameValue] = useState('');
  const [addressValue, setAddressValue] = useState('');
  const [docTypeValue, setDocTypeValue] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [leadsData, setLeadsData] = useState([]);

  useEffect(() => {
    fetchLeadsData();
  }, []);

  const fetchLeadsData = async () => {
    try {
      const { data, error } = await supabase.from('leads').select('*');
      if (error) throw error;
      setLeadsData(data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newLead = {
      contact: contactValue,
      field: fieldValue,
      name: nameValue,
      address: addressValue,
      docType: docTypeValue,
    };

    try {
      const { data, error } = await supabase.from('leads').insert([newLead]);
      if (error) throw error;
      console.log('Lead added:', data);

      // Clear input fields
      setContactValue('');
      setFieldValue('');
      setNameValue('');
      setAddressValue('');
      setDocTypeValue('');
      setFormVisible(false);

      // Fetch updated leads data
      fetchLeadsData(); // Re-fetch the data after adding a new lead
    } catch (error) {
      console.error('Error adding lead:', error);
    }
  };

  return (
    <div className="container">
      <Typography variant="h4" gutterBottom>
        Leads
      </Typography>
      <Navbar />

      <Button variant="contained" onClick={() => setFormVisible(true)} sx={{ mb: 2 }} style={{marginTop:'10px'}}>
        Create Lead
      </Button>

      {formVisible && (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
          <TextField
            label="Contact"
            variant="outlined"
            fullWidth
            margin="normal"
            value={contactValue}
            onChange={(e) => setContactValue(e.target.value)}
            required
          />
          <TextField
            label="Field"
            variant="outlined"
            fullWidth
            margin="normal"
            value={fieldValue}
            onChange={(e) => setFieldValue(e.target.value)}
            required
          />
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            required
          />
          <TextField
            label="Address"
            variant="outlined"
            fullWidth
            margin="normal"
            value={addressValue}
            onChange={(e) => setAddressValue(e.target.value)}
            required
          />
          <TextField
            label="Doc Type"
            variant="outlined"
            fullWidth
            margin="normal"
            value={docTypeValue}
            onChange={(e) => setDocTypeValue(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" sx={{ mr: 1 }}>
            Add Lead
          </Button>
          <Button variant="outlined" onClick={() => setFormVisible(false)} style={{marginTop:'10px'}}>
            Cancel
          </Button>
        </Box>
      )}

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Contact</TableCell>
              <TableCell>Field</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Doc Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leadsData.map((lead, index) => (
              <TableRow key={index}>
                <TableCell>{lead.contact}</TableCell>
                <TableCell>{lead.field}</TableCell>
                <TableCell>{lead.name}</TableCell>
                <TableCell>{lead.address}</TableCell>
                <TableCell>{lead.docType}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Link to="/home">
        <Button variant="contained" sx={{ mt: 2 }}>
          Home Page
        </Button>
      </Link>
    </div>
  );
};

export default Leads;
