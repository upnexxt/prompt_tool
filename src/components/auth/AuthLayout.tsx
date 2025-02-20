import React from 'react';
import './Auth.css';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AuthLayout = ({ children, title }: AuthLayoutProps) => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">{title}</h1>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;