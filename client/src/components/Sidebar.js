import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiUsers, FiPlusCircle, FiSearch, FiSettings } from 'react-icons/fi';
import './Sidebar.css'; // We will create this CSS file next

function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <span className="logo">Nexus CRM</span>
            </div>
            <nav className="sidebar-nav">
                <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <FiUsers />
                    <span>Customers</span>
                </NavLink>
                <NavLink to="/customers/new" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <FiPlusCircle />
                    <span>Add Customer</span>
                </NavLink>
                <a href="#search" className="nav-link" onClick={() => document.querySelector('.search-card input')?.focus()}>
                    <FiSearch />
                    <span>Search</span>
                </a>
                <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <FiSettings />
                    <span>Settings</span>
                </NavLink>
            </nav>
        </aside>
    );
}

export default Sidebar;