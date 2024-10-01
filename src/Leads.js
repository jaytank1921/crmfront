import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';
import './Leads.css';

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
      <h1>Leads</h1>
      <Navbar />

      <button onClick={() => setFormVisible(true)}>Create Lead</button>

      {formVisible && (
        <form onSubmit={handleSubmit} className="lead-form">
          <input
            type="text"
            placeholder="Contact"
            value={contactValue}
            onChange={(e) => setContactValue(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Field"
            value={fieldValue}
            onChange={(e) => setFieldValue(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Name"
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Address"
            value={addressValue}
            onChange={(e) => setAddressValue(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Doc Type"
            value={docTypeValue}
            onChange={(e) => setDocTypeValue(e.target.value)}
            required
          />
          <button type="submit">Add Lead</button>
          <button type="button" onClick={() => setFormVisible(false)}>Cancel</button>
        </form>
      )}

      <table className="leads-table">
        <thead>
          <tr>
            <th>Contact</th>
            <th>Field</th>
            <th>Name</th>
            <th>Address</th>
            <th>Doc Type</th>
          </tr>
        </thead>
        <tbody>
          {leadsData.map((lead, index) => (
            <tr key={index}>
              <td>{lead.contact}</td>
              <td>{lead.field}</td>
              <td>{lead.name}</td>
              <td>{lead.address}</td>
              <td>{lead.docType}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/home">
        <button className="home-button">Home page</button>
      </Link>
    </div>
  );
};

export default Leads;
