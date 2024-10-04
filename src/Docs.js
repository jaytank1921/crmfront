import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import {
  Box,
  Button,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Docs = () => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [doc, setDoc] = useState(null);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [error, setError] = useState('');
  const [agreements, setAgreements] = useState([]);

  // Fetch agreements from Supabase
  const fetchAgreements = async () => {
    try {
      const { data, error } = await supabase.from('agreements').select('*');
      if (error) throw error;
      setAgreements(data || []); // Ensure it defaults to an empty array
    } catch (error) {
      console.error('Error fetching agreements:', error);
      setError('Could not load agreements: ' + error.message);
    }
  };

  useEffect(() => {
    fetchAgreements();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!doc) {
      setError('Please select a document to upload.');
      setErrorSnackbarOpen(true);
      return;
    }

    try {
      const uniqueFileName = `${Date.now()}_${doc.name}`;

      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(`agreements/${uniqueFileName}`, doc);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw uploadError; // Handle upload error
      }

      // Insert agreement data into the table
      const { error: agreementError } = await supabase.from('agreements').insert([
        {
          name: name,
          property_type: propertyType,
          doc: uniqueFileName, // Store the unique filename in the doc column
        },
      ]);

      if (agreementError) throw agreementError;

      console.log('Agreement added successfully');
      setSuccessSnackbarOpen(true); // Show success Snackbar
      setName('');
      setPropertyType('');
      setDoc(null);
      fetchAgreements(); // Refetch agreements
    } catch (error) {
      console.error('Error submitting form:', error.message);
      setError('There was a problem submitting your data: ' + error.message);
      setErrorSnackbarOpen(true);
    }
  };

  return (
    <div>
      <Navbar />
      <Typography variant="h4" gutterBottom>
        Docs Page
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Property Type</TableCell>
              <TableCell>Doc</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {agreements.length > 0 ? (
              agreements.map((agreement, index) => (
                <TableRow key={index}>
                  <TableCell>{agreement.name}</TableCell>
                  <TableCell>{agreement.property_type}</TableCell>
                  <TableCell>
                    <a
                      href={`https://ylnqukqxsrhbudqhpayu.supabase.co/storage/v1/object/public/documents/agreements/${agreement.doc}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Document
                    </a>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3}>No agreements found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2 }}>
        <Button variant="contained" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Agreement'}
        </Button>
        <Link to="/home" style={{ marginLeft: '10px' }}>
          <Button variant="outlined" style={{marginTop:'10px'}}>Home Page</Button>
        </Link>
      </Box>

      {showForm && (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Typography variant="h6">Add Agreement</Typography>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            sx={{ mt: 2 }}
          />
          <TextField
            label="Property Type"
            variant="outlined"
            fullWidth
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            required
            sx={{ mt: 2 }}
          />
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file && file.type === 'application/pdf') {
                setDoc(file);
                setError(''); // Clear any previous error
              } else {
                setDoc(null); // Reset the file input
                setError('Please upload a valid PDF file.');
              }
            }}
            required
            style={{ marginTop: '16px' }}
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Submit
          </Button>
        </Box>
      )}

      <Snackbar
        open={successSnackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSuccessSnackbarOpen(false)}
      >
        <Alert onClose={() => setSuccessSnackbarOpen(false)} severity="success">
          Agreement added successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={errorSnackbarOpen}
        autoHideDuration={6000}
        onClose={() => setErrorSnackbarOpen(false)}
      >
        <Alert onClose={() => setErrorSnackbarOpen(false)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Docs;