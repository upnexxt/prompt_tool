import { useState } from 'react';
import { supabase } from '../../config/supabase';
import { LoginData, AuthError } from '../../types/auth';
import AuthLayout from './AuthLayout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Check if user is pending approval
      const { data: pendingUser } = await supabase
        .from('pending_users')
        .select('*')
        .eq('email', formData.email)
        .single();

      if (pendingUser) {
        setError({
          message: 'Your account is still pending approval. Please wait for admin confirmation.',
        });
        return;
      }

      // Attempt to sign in
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) throw signInError;

      if (!data.user) {
        throw new Error('No user data returned');
      }

      // Check if user is approved
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('approved')
        .eq('id', data.user.id)
        .single();

      if (userError) throw userError;

      if (!userData?.approved) {
        // Sign out if not approved
        await supabase.auth.signOut();
        setError({
          message: 'Your account has not been approved yet. Please wait for admin confirmation.',
        });
        return;
      }

      // Successfully logged in and approved
      navigate('/dashboard'); // Redirect to dashboard or home page

    } catch (err: any) {
      setError({
        message: err.message || 'Invalid email or password.',
      });
    } finally {
      setLoading(false);
    }
  };

  // If user is already logged in, redirect to dashboard
  if (user) {
    navigate('/dashboard');
    return null;
  }

  return (
    <AuthLayout title="Login">
      <form onSubmit={handleLogin} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        
        {error && <p className="error">{error.message}</p>}
        
        <div className="auth-switch">
          Don't have an account?{' '}
          <a href="/signup" onClick={(e) => {
            e.preventDefault();
            navigate('/signup');
          }}>
            Sign up
          </a>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;