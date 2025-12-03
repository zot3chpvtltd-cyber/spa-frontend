import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import './Login.css';

function ResetPassword() {
    const location = useLocation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: location.state?.email || '',
        resetToken: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate passwords match
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }

        // Validate password length
        if (formData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters long!');
            return;
        }

        setLoading(true);

        try {
            await api.post('/auth/reset-password', {
                email: formData.email,
                resetToken: formData.resetToken,
                newPassword: formData.newPassword
            });
            toast.success('Password reset successfully! You can now login.');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Reset Password</h2>
                <p>Enter the code sent to your email and your new password</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-group">
                        <label>Reset Code</label>
                        <input
                            type="text"
                            name="resetToken"
                            value={formData.resetToken}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter 6-digit code"
                            maxLength="6"
                            pattern="[0-9]{6}"
                        />
                    </div>

                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter new password"
                            minLength="6"
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                            placeholder="Confirm new password"
                            minLength="6"
                        />
                    </div>

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>
                        Didn't receive code?{' '}
                        <span
                            onClick={() => navigate('/forgot-password')}
                            style={{ color: '#6B4C93', cursor: 'pointer', fontWeight: '600' }}
                        >
                            Resend Code
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
