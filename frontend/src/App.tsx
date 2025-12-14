import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import SweetsList from './components/SweetsList';
import AdminPanel from './components/AdminPanel';
import './styles/global.css';

const AppContent: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'register' | 'dashboard'>('landing');
  const [refreshKey, setRefreshKey] = useState(0);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh'
      }}>
        <div className="card">
          <h3>Loading...</h3>
        </div>
      </div>
    );
  }

  if (!user) {
    if (currentView === 'landing') {
      return (
        <LandingPage 
          onLogin={() => setCurrentView('login')}
          onRegister={() => setCurrentView('register')}
        />
      );
    }
    
    if (currentView === 'register') {
      return (
        <Register 
          onBack={() => setCurrentView('landing')}
          onSwitchToLogin={() => setCurrentView('login')}
        />
      );
    }
    
    return (
      <Login 
        onBack={() => setCurrentView('landing')}
        onSwitchToRegister={() => setCurrentView('register')}
      />
    );
  }

  return (
    <div>
      {/* Header */}
      <header style={{
        background: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '15px 0',
        marginBottom: '30px'
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: '600',
            color: '#007bff'
          }}>🍭 Sweet Shop</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '14px', color: '#6c757d' }}>
              Welcome, {user.email}
              <span className={`badge ${user.role === 'ADMIN' ? 'badge-primary' : 'badge-success'}`} style={{ marginLeft: '8px' }}>
                {user.role}
              </span>
            </span>
            <button onClick={logout} className="btn-danger">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container">
        <SweetsList key={refreshKey} />
        
        {user.role === 'ADMIN' && (
          <AdminPanel onSweetAdded={() => setRefreshKey(prev => prev + 1)} />
        )}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;