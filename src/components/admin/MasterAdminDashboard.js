import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import './MasterAdminDashboard.css';

function MasterAdminDashboard() {
    const [activeTab, setActiveTab] = useState('spas');
    const [spas, setSpas] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [sales, setSales] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedSpa, setSelectedSpa] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const [formData, setFormData] = useState({
        spaName: '',
        spaSlug: '',
        contactEmail: '',
        contactPhone: '',
        address: '',
        city: '',
        state: '',
        password: ''
    });

    useEffect(() => {
        loadSpas();
        loadBookings();
        loadSales();
    }, []);

    const loadSpas = async () => {
        try {
            const response = await api.get('/master-admin/spas');
            setSpas(response.data);
        } catch (error) {
            console.error('Error loading spas:', error);
            toast.error('Failed to load spas');
        }
    };

    const loadBookings = async () => {
        try {
            const response = await api.get('/master-admin/bookings');
            setBookings(response.data);
        } catch (error) {
            console.error('Error loading bookings:', error);
            // toast.error('Failed to load bookings');
        }
    };

    const loadSales = async () => {
        try {
            const response = await api.get('/master-admin/sales');
            setSales(response.data);
        } catch (error) {
            console.error('Error loading sales:', error);
            // toast.error('Failed to load sales');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreateSpa = async (e) => {
        e.preventDefault();
        try {
            await api.post('/master-admin/spas', formData);
            toast.success('Spa created successfully!');
            setShowCreateForm(false);
            setFormData({
                spaName: '',
                spaSlug: '',
                contactEmail: '',
                contactPhone: '',
                address: '',
                city: '',
                state: '',
                password: ''
            });
            loadSpas();
        } catch (error) {
            console.error('Error creating spa:', error);
            toast.error(error.response?.data?.error || 'Failed to create spa');
        }
    };

    const downloadExcel = () => {
        const workSheet = XLSX.utils.json_to_sheet(bookings);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, "Bookings");
        XLSX.writeFile(workBook, "MasterAdmin_Bookings.xlsx");
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentBookings = bookings.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(bookings.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="master-admin-dashboard">
            <div className="dashboard-header">
                <h1>Zotech Master Admin Dashboard</h1>
                <div className="header-actions">
                    <div className="tab-buttons">
                        <button
                            className={`tab-btn ${activeTab === 'spas' ? 'active' : ''}`}
                            onClick={() => setActiveTab('spas')}
                        >
                            Spas
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
                            onClick={() => setActiveTab('bookings')}
                        >
                            All Bookings
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'sales' ? 'active' : ''}`}
                            onClick={() => setActiveTab('sales')}
                        >
                            All Sales
                        </button>
                    </div>
                    {activeTab === 'spas' && (
                        <button
                            className="create-spa-btn"
                            onClick={() => setShowCreateForm(!showCreateForm)}
                        >
                            {showCreateForm ? '− Close Form' : '+ Create New Spa'}
                        </button>
                    )}
                </div>
            </div>

            {showCreateForm && activeTab === 'spas' && (
                <div className="create-spa-form-container" style={{ display: 'block', marginTop: '20px' }}>
                    <h2>Register New Spa</h2>
                    <form onSubmit={handleCreateSpa} className="create-spa-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Spa Name</label>
                                <input
                                    type="text"
                                    name="spaName"
                                    value={formData.spaName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Spa Slug (URL)</label>
                                <input
                                    type="text"
                                    name="spaSlug"
                                    value={formData.spaSlug}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g., my-spa"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Contact Email</label>
                                <input
                                    type="email"
                                    name="contactEmail"
                                    value={formData.contactEmail}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Contact Phone</label>
                                <input
                                    type="text"
                                    name="contactPhone"
                                    value={formData.contactPhone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Admin Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Initial admin password"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="submit-btn">Create Spa</button>
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => setShowCreateForm(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="dashboard-content">
                {activeTab === 'spas' && (
                    <div className="spas-list">
                        <h2>Registered Spas</h2>
                        <div className="spas-grid">
                            {spas.map(spa => (
                                <div key={spa.spaId} className="spa-card">
                                    <div className="spa-card-header">
                                        <h3>{spa.spaName}</h3>
                                        <span className={`status-badge ${spa.isActive ? 'active' : 'inactive'}`}>
                                            {spa.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div className="spa-card-body">
                                        <p><strong>Slug:</strong> {spa.spaSlug}</p>
                                        <p><strong>Email:</strong> {spa.contactEmail}</p>
                                        <p><strong>Phone:</strong> {spa.contactPhone}</p>
                                        <p><strong>Status:</strong> {spa.subscriptionStatus}</p>
                                    </div>
                                    <div className="spa-card-footer">
                                        <button
                                            className="view-btn"
                                            onClick={() => setSelectedSpa(spa)}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'bookings' && (
                    <div className="data-table-container">
                        <div className="table-header">
                            <h2>All Bookings</h2>
                            <button className="download-btn" onClick={downloadExcel}>
                                Download Excel
                            </button>
                        </div>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Spa Name</th>
                                    <th>Customer</th>
                                    <th>Phone</th>
                                    <th>Email</th>
                                    <th>Service</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentBookings.map(booking => (
                                    <tr key={booking.bookingId}>
                                        <td>#{booking.bookingId}</td>
                                        <td>{booking.spaName}</td>
                                        <td>{booking.customerName}</td>
                                        <td>{booking.customerPhone || 'N/A'}</td>
                                        <td>{booking.customerEmail || 'N/A'}</td>
                                        <td>{booking.serviceName}</td>
                                        <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                                        <td>₹{booking.amount}</td>
                                        <td>
                                            <span className={`status-badge ${booking.status.toLowerCase()}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {bookings.length === 0 && (
                                    <tr>
                                        <td colSpan="9" className="text-center">No bookings found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Pagination Controls */}
                        {bookings.length > itemsPerPage && (
                            <div className="pagination">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="page-btn"
                                >
                                    Previous
                                </button>
                                <span className="page-info">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="page-btn"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'sales' && (
                    <div className="data-table-container">
                        <h2>All Sales</h2>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Spa Name</th>
                                    <th>Customer</th>
                                    <th>Service</th>
                                    <th>Date</th>
                                    <th>Method</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sales.map(sale => (
                                    <tr key={sale.saleId}>
                                        <td>#{sale.saleId}</td>
                                        <td>{sale.spaName}</td>
                                        <td>{sale.customerName}</td>
                                        <td>{sale.serviceName}</td>
                                        <td>{new Date(sale.saleDate).toLocaleDateString()}</td>
                                        <td>{sale.paymentMethod}</td>
                                        <td>₹{sale.amount}</td>
                                    </tr>
                                ))}
                                {sales.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="text-center">No sales found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* View Details Modal */}
            {selectedSpa && (
                <div className="modal-overlay" onClick={() => setSelectedSpa(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{selectedSpa.spaName} Details</h2>
                            <button className="close-modal-btn" onClick={() => setSelectedSpa(null)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-row">
                                <strong>Spa ID:</strong> <span>{selectedSpa.spaId}</span>
                            </div>
                            <div className="detail-row">
                                <strong>Slug:</strong> <span>{selectedSpa.spaSlug}</span>
                            </div>
                            <div className="detail-row">
                                <strong>Email:</strong> <span>{selectedSpa.contactEmail}</span>
                            </div>
                            <div className="detail-row">
                                <strong>Phone:</strong> <span>{selectedSpa.contactPhone}</span>
                            </div>
                            <div className="detail-row">
                                <strong>Status:</strong>
                                <span className={`status-badge ${selectedSpa.isActive ? 'active' : 'inactive'}`}>
                                    {selectedSpa.subscriptionStatus}
                                </span>
                            </div>
                            <div className="detail-row">
                                <strong>Created At:</strong> <span>{new Date(selectedSpa.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="detail-row">
                                <strong>Total Users:</strong> <span>{selectedSpa.totalUsers}</span>
                            </div>
                            <div className="detail-row">
                                <strong>Total Bookings:</strong> <span>{selectedSpa.totalBookings}</span>
                            </div>
                            <div className="detail-row">
                                <strong>Total Revenue:</strong> <span>₹{selectedSpa.totalRevenue}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MasterAdminDashboard;
