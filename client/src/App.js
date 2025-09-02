import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import CustomerListPage from './pages/CustomerListPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import CustomerFormPage from './pages/CustomerFormPage';
import './App.css'; // Main application styles

function App() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<CustomerListPage />} />
          <Route path="/customers/new" element={<CustomerFormPage />} />
          <Route path="/customers/:id" element={<CustomerDetailPage />} />
          <Route path="/customers/:id/edit" element={<CustomerFormPage />} />
          {/* A placeholder for the settings page */}
          <Route path="/settings" element={<div><h1>Settings</h1><p>This page is not yet implemented.</p></div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;