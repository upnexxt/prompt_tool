import { useState } from 'react';
import { supabase } from '../../config/supabase';
import { SignUpData, AuthError } from '../../types/auth';
import AuthLayout from './AuthLayout';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState<SignUpData>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess('');

    try {
      // Check if email already exists in pending_users
      const { data: existingRequest } = await supabase
        .from('pending_users')
        .select('*')
        .eq('email', formData.email)
        .single();

      if (existingRequest) {
        setError({
          message: 'A registration request for this email is already pending approval.',
        });
        return;
      }

      // Create auth user with disabled status
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      // Insert into pending_users
      const { error: insertError } = await supabase
        .from('pending_users')
        .insert([
          {
            email: formData.email,
            user_id: authData.user?.id,
          }
        ]);

      if (insertError) throw insertError;

      // Send email to admin (this would be handled by a Supabase Edge Function in production)
      const adminEmail = 'vanleeuwen.daniel@upnexxt.nl';
      console.log(`New registration request sent to ${adminEmail} for user ${formData.email}`);

      setSuccess('Registration request submitted. Please wait for admin approval.');
      
      // Redirect to pending approval page after 3 seconds
      setTimeout(() => {
        navigate('/pending-approval');
      }, 3000);

    } catch (err: any) {
      setError({
        message: err.message || 'An error occurred during registration.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Account">
      <form onSubmit={handleSignUp} className="auth-form">
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
            minLength={6}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Sign Up'}
        </button>
        
        {error && <p className="error">{error.message}</p>}
        {success && <p className="success">{success}</p>}
        
        <div className="auth-switch">
          Already have an account?{' '}
          <a href="/login" onClick={(e) => {
            e.preventDefault();
            navigate('/login');
          }}>
            Log in
          </a>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignUp;