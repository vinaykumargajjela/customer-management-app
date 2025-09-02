import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import apiClient from '../api';

function CustomerDetailPage() {
    const [customer, setCustomer] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState({ address_details: '', city: '', state: '', pin_code: '' });
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [notification, setNotification] = useState('');

    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => {
            setNotification('');
        }, 3000);
    };

    const fetchCustomerData = useCallback(async () => {
        try {
            const customerRes = await apiClient.get(`/customers/${id}`);
            setCustomer(customerRes.data.data);
            const addressesRes = await apiClient.get(`/customers/${id}/addresses`);
            setAddresses(addressesRes.data.data);
        } catch (error) {
            console.error("Failed to fetch data:", error);
            navigate('/');
        }
    }, [id, navigate]);

    useEffect(() => {
        fetchCustomerData();
    }, [fetchCustomerData]);

    const handleCustomerDelete = async () => {
        if (window.confirm('Are you sure you want to delete this customer and all their addresses?')) {
            try {
                await apiClient.delete(`/customers/${id}`);
                navigate('/', { state: { message: 'Customer deleted successfully!' } });
            } catch (error) {
                showNotification('Error: Could not delete customer.');
            }
        }
    };
    
    const handleAddressDelete = async (addressId) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            try {
                await apiClient.delete(`/addresses/${addressId}`);
                fetchCustomerData(); 
                showNotification('Address deleted successfully!'); 
            } catch (error) {
                 showNotification('Error: Could not delete address.');
            }
        }
    };
    
    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        if (!newAddress.address_details || !newAddress.city || !newAddress.state || !newAddress.pin_code) {
            alert('Please fill all address fields.'); 
            return;
        }
        try {
            await apiClient.post(`/customers/${id}/addresses`, newAddress);
            setNewAddress({ address_details: '', city: '', state: '', pin_code: '' });
            fetchCustomerData();
            showNotification('New address added successfully!');
        } catch (error) {
            showNotification('Error: Could not add new address.');
        }
    };

    if (!customer) return <div>Loading...</div>;

    return (
        <div>
            {notification && <div className="notification show">{notification}</div>}

            <div className="page-header">
                 <h1>Customer Details</h1>
                 <Link to="/" className="btn btn-secondary">&larr; Back to List</Link>
            </div>

            <div className="detail-card">
                <h2>{customer.first_name} {customer.last_name}</h2>
                <p><strong>Phone:</strong> {customer.phone_number}</p>
                <p>
                    <strong>Address Status: </strong> 
                    {addresses.length === 1 ? 'Only One Address Registered' : `${addresses.length} Addresses Registered`}
                </p>
                {/* THIS IS THE FIX: Added display: 'flex' and gap: '10px' to the style */}
                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    <Link to={`/customers/${id}/edit`} className="btn btn-primary">Edit Customer</Link>
                    <button onClick={handleCustomerDelete} className="btn btn-secondary">Delete Customer</button>
                </div>
            </div>

            <div className="detail-card">
                <h3>Addresses ({addresses.length})</h3>
                {addresses.length > 0 ? (
                    <ul className="address-list">
                        {addresses.map(addr => (
                            <li key={addr.id}>
                                <span>{addr.address_details}, {addr.city}, {addr.state} - {addr.pin_code}</span>
                                <button onClick={() => handleAddressDelete(addr.id)} className="btn btn-secondary">Delete</button>
                            </li>
                        ))}
                    </ul>
                ) : <p>This customer has no addresses.</p>}
            </div>

            <div className="form-container">
                <h3>Add New Address</h3>
                <form onSubmit={handleAddressSubmit}>
                     <div className="form-group">
                        <label>Address Details</label>
                        <input type="text" value={newAddress.address_details} onChange={e => setNewAddress({...newAddress, address_details: e.target.value})} placeholder="e.g., 123 Main St, Apt 4B" />
                    </div>
                    <div className="form-group">
                        <label>City</label>
                        <input type="text" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label>State</label>
                        <input type="text" value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} />
                    </div>
                     <div className="form-group">
                        <label>Pincode</label>
                        <input type="text" value={newAddress.pin_code} onChange={e => setNewAddress({...newAddress, pin_code: e.target.value})} />
                    </div>
                    <button type="submit" className="btn btn-primary">Save Address</button>
                </form>
            </div>
        </div>
    );
}

export default CustomerDetailPage;