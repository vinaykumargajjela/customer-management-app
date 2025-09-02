import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../api';

function CustomerFormPage() {
    const [formData, setFormData] = useState({ first_name: '', last_name: '', phone_number: '' });
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    useEffect(() => {
        if (isEditing) {
            apiClient.get(`/customers/${id}`)
                .then(response => setFormData(response.data.data))
                .catch(error => {
                    console.error('Failed to fetch customer data', error);
                    navigate('/');
                });
        }
    }, [id, isEditing, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.first_name || !formData.last_name || !formData.phone_number) {
            alert('All customer fields are required.');
            return;
        }

        try {
            if (isEditing) {
                await apiClient.put(`/customers/${id}`, formData);
                alert('Confirmation: Customer information was successfully updated.'); // Improved confirmation
            } else {
                await apiClient.post('/customers', formData);
                alert('Confirmation: New customer was successfully created.'); // Improved confirmation
            }
            navigate('/');
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'An unexpected error occurred.';
            alert(`Error: ${errorMessage}`);
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1>{isEditing ? 'Edit Customer' : 'Create New Customer'}</h1>
                <Link to="/" className="btn btn-secondary">&larr; Back to List</Link>
            </div>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>First Name</label>
                        <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary">{isEditing ? 'Update Customer' : 'Create Customer'}</button>
                </form>
            </div>
        </div>
    );
}

export default CustomerFormPage;