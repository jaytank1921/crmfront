import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // You can style it accordingly

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        setLoading(true); // Set loading before making the request

        try {
            // Make registration request to backend
            const response = await axios.post('http://192.168.2.202:5000/api/add-user', { name, email, password });
            console.log(response.data); // Handle successful registration

            // Redirect to login page or home
            navigate('/login'); // Redirect after successful registration
        } catch (err) {
            // Display appropriate error message
            setError(err.response?.data?.message || 'An error occurred during registration. Please try again.');
        } finally {
            setLoading(false); // Stop loading after request is completed
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            
            {/* Error message */}
            {error && <p className="error-message">{error}</p>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={loading} // Disable input when loading
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading} // Disable input when loading
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading} // Disable input when loading
                    />
                </div>

                {/* Display loading text when submitting */}
                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default Register;
