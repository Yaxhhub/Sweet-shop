import React from 'react';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="card" style={{ animation: 'pulse 1.5s ease-in-out infinite alternate' }}>
      {/* Image Skeleton */}
      <div style={{
        width: '100%',
        height: '200px',
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        borderRadius: '8px',
        marginBottom: '15px',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite'
      }}></div>
      
      {/* Title Skeleton */}
      <div style={{
        height: '20px',
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        borderRadius: '4px',
        marginBottom: '10px',
        width: '70%',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite'
      }}></div>
      
      {/* Category Skeleton */}
      <div style={{
        height: '16px',
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        borderRadius: '4px',
        marginBottom: '8px',
        width: '50%',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite'
      }}></div>
      
      {/* Price Skeleton */}
      <div style={{
        height: '18px',
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        borderRadius: '4px',
        marginBottom: '20px',
        width: '40%',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite'
      }}></div>
      
      {/* Button Skeleton */}
      <div style={{
        height: '40px',
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        borderRadius: '6px',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite'
      }}></div>
    </div>
  );
};

export default LoadingSkeleton;