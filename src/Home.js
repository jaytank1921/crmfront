import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './Home.css'; // Import the CSS file

const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken');

      if (!token) {
        setError('No token found, please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://192.168.2.202:5000/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (err) {
        setError('Failed to fetch user details');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  //if (loading) return <p>Loading...</p>;
//  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      <Navbar />
      <h1>Welcome to the Home Page!</h1>

      {user && (
        <div className="profile-section">
          <h2>User Profile</h2>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Address:</strong> {user.address}</p>
          <p><strong>Contact:</strong> {user.contact}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      )}
    </div>
  );
};

export default Home;
