import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import './Login.css';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent multiple submissions
        if (loading) return;

        setLoading(true);

        try {
            const response = await api.post('/auth/forgot-password', { email });

            // Check if token is in response (development mode)
            if (response.data.resetToken) {
                console.log('🔑 Reset Token:', response.data.resetToken);
                toast.info(`Reset code: ${response.data.resetToken}`, { autoClose: 10000 });
            }

            toast.success('Password reset code sent! Check console for token.');
            // Navigate to reset password page with email pre-filled
            navigate('/reset-password', { state: { email } });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send reset code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Forgot Password</h2>
                <p>Enter your email to receive a password reset code</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Reset Code'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>
                        Remember your password?{' '}
                        <span
                            onClick={() => navigate('/login')}
                            style={{ color: '#6B4C93', cursor: 'pointer', fontWeight: '600' }}
                        >
                            Back to Login
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
