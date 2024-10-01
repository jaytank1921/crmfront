import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import './Docs.css';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Docs = () => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [doc, setDoc] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [agreements, setAgreements] = useState([]);

  // Fetch agreements from Supabase
  const fetchAgreements = async () => {
    try {
      const { data, error } = await supabase.from('agreements').select('*');
      if (error) throw error;
      setAgreements(data);
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
      return;
    }
  
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const binaryData = reader.result; // This is the binary data of the PDF
  
        // Create a unique file name by adding a timestamp
        const uniqueFileName = `${Date.now()}_${doc.name}`;
  
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
        setSubmitted(true);
        setName('');
        setPropertyType('');
        setDoc(null);
        fetchAgreements(); // Refetch agreements
      };
  
      reader.readAsArrayBuffer(doc); // Read the file as binary data
    } catch (error) {
      console.error('Error submitting form:', error.message);
      setError('There was a problem submitting your data: ' + error.message);
    }
  };
  

  return (
    <div>
      <h1>Docs Page</h1>
      <Navbar />

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Property Type</th>
            <th>Doc</th>
          </tr>
        </thead>
        <tbody>
          {agreements.length > 0 ? (
            agreements.map((agreement, index) => (
              <tr key={index}>
                <td>{agreement.name}</td>
                <td>{agreement.property_type}</td>
                <td>
                <a 
    href={`https://your-project-ref.supabase.co/storage/v1/object/documents/agreements/${agreement.doc}`} // Ensure this URL is correct
    target="_blank" 
    rel="noopener noreferrer"
  >
                    View Document
                  </a>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No agreements found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div style={{ marginTop: '20px' }}>
        <button className="add-agreement-button" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Agreement'}
        </button>
        <Link to="/home" style={{ marginLeft: '10px' }}>
          <button className="home-button">Home page</button>
        </Link>
      </div>

      {showForm && (
        <div style={{ marginTop: '20px' }}>
          <h2>Add Agreement</h2>
          {submitted && <p>Agreement added successfully!</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Name" 
              required 
            />
            <input 
              type="text" 
              value={propertyType} 
              onChange={(e) => setPropertyType(e.target.value)} 
              placeholder="Property Type" 
              required 
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
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Docs;
