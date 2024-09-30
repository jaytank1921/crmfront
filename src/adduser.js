import React, { useState } from 'react';
import axios from 'axios';


const AddUser = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [contact, setContact] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const isPasswordStrong = (password) => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        
        if (!email || !password || !name || !address || !contact) {
            setError('Please fill in all fields.');
            return;
        }

        if (!isPasswordStrong(password)) {
            setError('Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, and one number.');
            return;
        }

        const userData = {
            email,
            password,
            name,
            address,
            contact,
        };

        try {
            setLoading(true); // Start loading
            const response = await axios.post('http://192.168.2.202:5000/api/add-user', userData);
            setSuccess('User added successfully!');
            setError('');

            // Reset form fields
            setEmail('');
            setPassword('');
            setName('');
            setAddress('');
            setContact('');
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
            setSuccess('');
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div>
            <h2>Add User</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <form onSubmit={handleAddUser}>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div>
                    <label>Name:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                    <label>Address:</label>
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
                </div>
                <div>
                    <label>Contact:</label>
                    <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} required />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Adding...' : 'Add User'}
                </button>
            </form>
        </div>
    );
};

export default AddUser;
