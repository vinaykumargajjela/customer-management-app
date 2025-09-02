import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import apiClient from '../api';
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiPhone, FiMapPin } from 'react-icons/fi';

function CustomerListPage() {
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState({ query: '', city: '', state: '', pincode: '' });
    const [notification, setNotification] = useState('');
    const location = useLocation();

    // Function to show a notification and hide it after 3 seconds
    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => {
            setNotification('');
        }, 3000);
    };

    // Check for a message from a redirect (e.g., after deleting on the detail page)
    useEffect(() => {
        if (location.state?.message) {
            showNotification(location.state.message);
            // Clear the state to prevent the message from showing again on refresh
            window.history.replaceState({}, document.title)
        }
    }, [location.state]);


    const fetchCustomers = useCallback(async () => {
        const searchQuery = [
            searchTerm.query,
            searchTerm.city,
            searchTerm.state,
            searchTerm.pincode,
        ].filter(Boolean).join(' ');

        try {
            const response = await apiClient.get('/customers', {
                params: { search: searchQuery, page: 1, limit: 50 }
            });
            setCustomers(response.data.data);
        } catch (error) {
            console.error("Failed to fetch customers:", error);
            showNotification('Error: Could not fetch customers.');
        }
    }, [searchTerm]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchTerm(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchCustomers();
    };

    const clearFilters = () => {
        setSearchTerm({ query: '', city: '', state: '', pincode: '' });
    };

    const handleDelete = async (customerId, e) => {
        e.stopPropagation(); 
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                await apiClient.delete(`/customers/${customerId}`);
                showNotification('Customer deleted successfully!'); // Success notification
                fetchCustomers(); // Refresh the list
            } catch (error) {
                showNotification('Error: Failed to delete customer.');
            }
        }
    };

    return (
        <div>
            {/* Notification component */}
            {notification && <div className="notification show">{notification}</div>}

            <div className="page-header">
                <div>
                    <h1>Customers</h1>
                    <p>Manage your customer database</p>
                </div>
                <Link to="/customers/new" className="btn btn-primary">
                    <FiPlus /> Add Customer
                </Link>
            </div>

            <div id="search" className="search-card">
                <h3><FiSearch /> Search & Filter</h3>
                <form onSubmit={handleSearch} className="search-form">
                    <input type="text" name="query" placeholder="Search customer..." value={searchTerm.query} onChange={handleInputChange} />
                    <input type="text" name="city" placeholder="City" value={searchTerm.city} onChange={handleInputChange} />
                    <input type="text" name="state" placeholder="State" value={searchTerm.state} onChange={handleInputChange} />
                    <input type="text" name="pincode" placeholder="Pincode" value={searchTerm.pincode} onChange={handleInputChange} />
                    <button type="submit" className="btn btn-primary">Search</button>
                    <button type="button" onClick={clearFilters} className="btn btn-secondary">Clear</button>
                </form>
            </div>

            <div className="customer-grid">
                {customers.map(customer => (
                    <div key={customer.id} className="customer-card">
                        <div className="card-header">
                            <div>
                                <h2>{customer.first_name} {customer.last_name}</h2>
                                <p>ID: {customer.id}</p>
                            </div>
                            <div className="card-actions">
                                <Link to={`/customers/${customer.id}/edit`} className="icon-btn" onClick={(e) => e.stopPropagation()}><FiEdit /></Link>
                                <button onClick={(e) => handleDelete(customer.id, e)} className="icon-btn"><FiTrash2 /></button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="contact-info">
                                <div className="contact-item">
                                    <FiPhone /> <span>{customer.phone_number}</span>
                                </div>
                                <div className="contact-item">
                                    <FiMapPin /> <span>Address info available in details</span>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer">
                            {/* UPDATED: Badge now shows the count */}
                            <span className={customer.address_count === 1 ? "address-badge-single" : "address-badge"}>
                                Addresses ({customer.address_count})
                            </span>
                            <Link to={`/customers/${customer.id}`} className="view-details-btn">View Details &rarr;</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CustomerListPage;