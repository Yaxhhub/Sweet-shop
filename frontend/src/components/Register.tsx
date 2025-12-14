import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface RegisterProps {
  onBack: () => void;
  onSwitchToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onBack, onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!acceptTerms) {
      setError('Please accept the terms and conditions');
      setLoading(false);
      return;
    }

    try {
      await register(email, password, role);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^\w\s]/)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthColors = ['#dc3545', '#fd7e14', '#ffc107', '#28a745'];
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '450px', width: '100%' }}>
        {/* Back Button */}
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            marginBottom: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
        >
          ← Back to Home
        </button>

        <div className="card" style={{ 
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>🎆</div>
            <h2 style={{ 
              color: '#333',
              fontWeight: '600',
              marginBottom: '8px'
            }}>Join Sweet Shop!</h2>
            <p style={{ color: '#6c757d', fontSize: '14px' }}>Create your account to start exploring</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555' }}>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
                style={{ 
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="input-field"
                  style={{ 
                    width: '100%',
                    padding: '12px 50px 12px 16px',
                    fontSize: '16px'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: '#6c757d'
                  }}
                >
                  {showPassword ? '👁️' : '👁️🗨️'}
                </button>
              </div>
              {password && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ 
                    height: '4px', 
                    background: '#e9ecef', 
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${(passwordStrength / 4) * 100}%`,
                      background: strengthColors[passwordStrength - 1] || '#e9ecef',
                      transition: 'all 0.3s ease'
                    }}></div>
                  </div>
                  <p style={{ 
                    fontSize: '12px', 
                    color: strengthColors[passwordStrength - 1] || '#6c757d',
                    marginTop: '4px'
                  }}>
                    Password strength: {strengthLabels[passwordStrength - 1] || 'Too short'}
                  </p>
                </div>
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555' }}>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="input-field"
                style={{ 
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px',
                  borderColor: confirmPassword && password !== confirmPassword ? '#dc3545' : undefined
                }}
              />
              {confirmPassword && password !== confirmPassword && (
                <p style={{ fontSize: '12px', color: '#dc3545', marginTop: '4px' }}>
                  Passwords do not match
                </p>
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500', color: '#555' }}>Account Type</label>
              <div style={{
                display: 'flex',
                background: '#f8f9fa',
                borderRadius: '8px',
                padding: '4px',
                border: '1px solid #dee2e6'
              }}>
                <button
                  type="button"
                  onClick={() => setRole('USER')}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: role === 'USER' ? '#007bff' : 'transparent',
                    color: role === 'USER' ? 'white' : '#6c757d'
                  }}
                >
                  👤 Customer
                </button>
                <button
                  type="button"
                  onClick={() => setRole('ADMIN')}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: role === 'ADMIN' ? '#28a745' : 'transparent',
                    color: role === 'ADMIN' ? 'white' : '#6c757d'
                  }}
                >
                  🛡️ Admin
                </button>
              </div>
              <p style={{ fontSize: '12px', color: '#6c757d', marginTop: '8px' }}>
                {role === 'USER' ? 'Browse and purchase sweets' : 'Manage inventory and sales'}
              </p>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  style={{ cursor: 'pointer', marginTop: '2px' }}
                />
                <span style={{ fontSize: '14px', color: '#555', lineHeight: '1.4' }}>
                  I agree to the terms and conditions
                </span>
              </label>
            </div>

            {error && (
              <div className="alert-error" style={{ marginBottom: '20px' }}>
                <strong>Error:</strong> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !acceptTerms}
              className="btn-success"
              style={{ 
                width: '100%', 
                padding: '14px',
                fontSize: '16px',
                fontWeight: '600',
                background: loading || !acceptTerms ? '#6c757d' : '#28a745'
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <span style={{ 
                    width: '16px', 
                    height: '16px', 
                    border: '2px solid transparent',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></span>
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div style={{ 
            textAlign: 'center', 
            marginTop: '25px',
            paddingTop: '20px',
            borderTop: '1px solid #e9ecef'
          }}>
            <p style={{ color: '#6c757d', fontSize: '14px', marginBottom: '10px' }}>
              Already have an account?
            </p>
            <button
              onClick={onSwitchToLogin}
              className="btn-primary"
              style={{ padding: '10px 24px' }}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;