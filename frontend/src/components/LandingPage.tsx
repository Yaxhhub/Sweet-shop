import React from 'react';

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onRegister }) => {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Header */}
      <header style={{ padding: '20px 0', background: 'rgba(255, 255, 255, 0.1)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ color: 'white', fontSize: '24px', fontWeight: '600' }}>🍭 Sweet Shop</h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onLogin} className="btn-primary" style={{ background: 'rgba(255, 255, 255, 0.25)', border: '1px solid rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(10px)' }}>
              Login
            </button>
            <button onClick={onRegister} className="btn-success" style={{ background: '#8b5cf6', color: 'white', border: 'none' }}>
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: '80px 0', textAlign: 'center', color: 'white' }}>
        <div className="container">
          <h1 style={{ fontSize: '48px', fontWeight: '700', marginBottom: '20px', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
            Welcome to Sweet Shop
          </h1>
          <p style={{ fontSize: '20px', marginBottom: '40px', opacity: '0.9', maxWidth: '600px', margin: '0 auto 40px' }}>
            Discover the finest collection of sweets, candies, and treats. From classic chocolates to modern delights, we have something for every sweet tooth.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={onRegister} 
              style={{
                background: 'linear-gradient(45deg, #8b5cf6, #a78bfa)',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
                transition: 'transform 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Get Started
            </button>
            <button 
              onClick={onLogin}
              style={{
                background: 'transparent',
                color: 'white',
                border: '2px solid white',
                padding: '15px 30px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = '#8b5cf6';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'white';
              }}
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '60px 0', background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(10px)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', color: 'white', fontSize: '32px', marginBottom: '50px', fontWeight: '600' }}>
            Why Choose Sweet Shop?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
            <div style={{ textAlign: 'center', color: 'white' }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>🍫</div>
              <h3 style={{ fontSize: '20px', marginBottom: '10px', fontWeight: '600' }}>Premium Quality</h3>
              <p style={{ opacity: '0.9', lineHeight: '1.6' }}>
                Hand-selected sweets from the finest confectioneries around the world.
              </p>
            </div>
            <div style={{ textAlign: 'center', color: 'white' }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>🚚</div>
              <h3 style={{ fontSize: '20px', marginBottom: '10px', fontWeight: '600' }}>Fast Delivery</h3>
              <p style={{ opacity: '0.9', lineHeight: '1.6' }}>
                Quick and secure delivery to satisfy your sweet cravings instantly.
              </p>
            </div>
            <div style={{ textAlign: 'center', color: 'white' }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>🎁</div>
              <h3 style={{ fontSize: '20px', marginBottom: '10px', fontWeight: '600' }}>Special Offers</h3>
              <p style={{ opacity: '0.9', lineHeight: '1.6' }}>
                Exclusive deals and seasonal discounts for our valued customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '60px 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ color: 'white', fontSize: '28px', marginBottom: '20px', fontWeight: '600' }}>
            Ready to Explore Our Sweet Collection?
          </h2>
          <p style={{ color: 'white', opacity: '0.9', marginBottom: '30px', fontSize: '16px' }}>
            Join thousands of satisfied customers and discover your new favorite treats.
          </p>
          <button 
            onClick={onRegister}
            style={{
              background: 'linear-gradient(45deg, #8b5cf6, #a78bfa)',
              color: 'white',
              border: 'none',
              padding: '15px 40px',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
              transition: 'transform 0.3s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Start Shopping Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '30px 0', background: 'rgba(139, 92, 246, 0.2)', backdropFilter: 'blur(10px)', color: 'white', textAlign: 'center' }}>
        <div className="container">
          <p style={{ opacity: '0.8' }}>© 2024 Sweet Shop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;