import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';

const PendingApproval = () => {
  const navigate = useNavigate();

  return (
    <AuthLayout title="Registration Pending">
      <div className="auth-form">
        <div className="pending-message">
          <p>
            Your registration request has been submitted and is pending approval.
            An administrator will review your request and approve your account.
          </p>
          <p>
            You will receive a notification when your account has been approved.
          </p>
        </div>
        
        <button
          onClick={() => navigate('/login')}
          className="secondary-button"
          style={{ marginTop: '2rem' }}
        >
          Return to Login
        </button>
      </div>

      <style>
        {`
          .pending-message {
            text-align: center;
            color: #4a5568;
            line-height: 1.6;
          }
          
          .pending-message p {
            margin-bottom: 1rem;
          }

          .secondary-button {
            background-color: #e2e8f0;
            color: #4a5568;
          }

          .secondary-button:hover {
            background-color: #cbd5e0;
          }
        `}
      </style>
    </AuthLayout>
  );
};

export default PendingApproval;