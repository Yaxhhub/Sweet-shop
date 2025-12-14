import React from 'react';

interface EmptyStateProps {
  type: 'no-results' | 'no-sweets';
  onClear?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ type, onClear }) => {
  if (type === 'no-results') {
    return (
      <div className="card" style={{ 
        textAlign: 'center', 
        padding: '60px 40px',
        marginTop: '20px',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔍</div>
        <h3 style={{ color: '#495057', marginBottom: '12px' }}>No sweets match your search</h3>
        <p style={{ color: '#6c757d', marginBottom: '24px', lineHeight: '1.5' }}>
          We couldn't find any sweets matching your criteria.<br />
          Try different keywords or clear your filters.
        </p>
        {onClear && (
          <button 
            onClick={onClear}
            className="btn-primary"
            style={{ padding: '12px 24px' }}
          >
            Clear Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="card" style={{ 
      textAlign: 'center', 
      padding: '60px 40px',
      marginTop: '20px',
      background: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)'
    }}>
      <div style={{ fontSize: '64px', marginBottom: '20px' }}>🍭</div>
      <h3 style={{ color: '#856404', marginBottom: '12px' }}>Sweet Shop is Empty</h3>
      <p style={{ color: '#6c757d', lineHeight: '1.5' }}>
        No sweets are available right now.<br />
        Check back later for delicious new arrivals!
      </p>
    </div>
  );
};

export default EmptyState;