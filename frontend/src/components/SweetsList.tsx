import React, { useState, useEffect } from 'react';
import { Sweet, sweetsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import LoadingSkeleton from './LoadingSkeleton';
import EmptyState from './EmptyState';

// Random placeholder images based on category
const getPlaceholderImage = (category: string, name: string) => {
  const categoryImages: { [key: string]: string[] } = {
    'Chocolate': ['🍫', '🍩', '🧁'],
    'Candy': ['🍬', '🍭', '🍯'],
    'Gummy': ['🐻', '🍇', '🍓'],
    'Lollipop': ['🍭', '🌈', '💫'],
    'Cake': ['🍰', '🎂', '🧁'],
    'Cookie': ['🍪', '🥠', '🍘'],
    'Ice Cream': ['🍦', '🍨', '🍧'],
    'Donut': ['🍩', '🍪', '🧁'],
    'Pastry': ['🥐', '🥧', '🍰'],
    'Toffee': ['🍯', '🍬', '🧈']
  };
  
  const images = categoryImages[category] || ['🍭', '🍬', '🍫'];
  const hash = name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  return images[hash % images.length];
};

const SweetsList: React.FC = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [allSweets, setAllSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'quantity' | 'category'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [purchaseQuantities, setPurchaseQuantities] = useState<{[key: string]: number}>({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{min: number, max: number}>({min: 0, max: 100});
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'in-stock' | 'out-of-stock'>('all');
  const { user } = useAuth();

  const fetchSweets = async () => {
    try {
      setLoading(true);
      const response = await sweetsAPI.getAll();
      setAllSweets(response.data);
      setSweets(response.data);
    } catch (err: any) {
      setError('Failed to fetch sweets');
    } finally {
      setLoading(false);
    }
  };

  // Live search and sort function
  const filterAndSortSweets = () => {
    let filtered = allSweets.filter(sweet => {
      const matchesName = !searchName || sweet.name.toLowerCase().includes(searchName.toLowerCase());
      const matchesCategory = !searchCategory || sweet.category.toLowerCase().includes(searchCategory.toLowerCase());
      const matchesPrice = sweet.price >= priceRange.min && sweet.price <= priceRange.max;
      const matchesAvailability = availabilityFilter === 'all' || 
        (availabilityFilter === 'in-stock' && sweet.quantity > 0) ||
        (availabilityFilter === 'out-of-stock' && sweet.quantity === 0);
      return matchesName && matchesCategory && matchesPrice && matchesAvailability;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setSweets(filtered);
  };

  const handlePurchase = async (sweetId: string) => {
    const quantity = purchaseQuantities[sweetId] || 1;
    try {
      await sweetsAPI.purchase(sweetId, quantity);
      setPurchaseQuantities(prev => ({ ...prev, [sweetId]: 1 }));
      fetchSweets();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Purchase failed');
    }
  };

  const updateQuantity = (sweetId: string, change: number) => {
    setPurchaseQuantities(prev => {
      const current = prev[sweetId] || 1;
      const newQuantity = Math.max(1, Math.min(current + change, 10));
      return { ...prev, [sweetId]: newQuantity };
    });
  };

  const handleDelete = async (sweetId: string) => {
    if (window.confirm('Are you sure you want to delete this sweet?')) {
      try {
        await sweetsAPI.delete(sweetId);
        fetchSweets();
      } catch (err: any) {
        setError('Delete failed');
      }
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  // Live search and sort effect
  useEffect(() => {
    filterAndSortSweets();
  }, [searchName, searchCategory, sortBy, sortOrder, allSweets, priceRange, availabilityFilter]);

  // Set initial price range based on available sweets
  useEffect(() => {
    if (allSweets.length > 0) {
      const prices = allSweets.map(sweet => sweet.price);
      const min = Math.floor(Math.min(...prices));
      const max = Math.ceil(Math.max(...prices));
      setPriceRange({min, max});
    }
  }, [allSweets]);

  // Generate search suggestions
  useEffect(() => {
    if (searchName.length > 0) {
      const filtered = allSweets
        .filter(sweet => sweet.name.toLowerCase().includes(searchName.toLowerCase()))
        .map(sweet => sweet.name)
        .slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [searchName, allSweets]);

  if (loading) return (
    <div>
      <div className="card">
        <h2 style={{ 
          marginBottom: '25px',
          color: '#333',
          fontWeight: '600'
        }}>Sweet Collection</h2>
        <div style={{ 
          height: '60px',
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          borderRadius: '10px',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          marginBottom: '20px'
        }}></div>
      </div>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '20px',
        marginTop: '20px'
      }}>
        {Array.from({ length: 6 }).map((_, index) => (
          <LoadingSkeleton key={index} />
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <div className="card">
        <h2 style={{ 
          marginBottom: '25px',
          color: '#333',
          fontWeight: '600'
        }}>Sweet Collection</h2>
        
        {/* Search */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px',
          marginBottom: '20px'
        }}>
          <div style={{ position: 'relative' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.2))',
              backdropFilter: 'blur(10px)',
              borderRadius: '10px',
              padding: '2px',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
            }}>
              <input
                type="text"
                placeholder="Search sweets..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                onFocus={() => setShowSuggestions(suggestions.length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                style={{
                  width: '100%',
                  padding: '10px 15px 10px 35px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  background: 'rgba(255,255,255,0.9)',
                  color: '#333',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
              />
              <div style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '14px',
                pointerEvents: 'none',
                background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                🔍
              </div>
            </div>
            
            {/* Search Suggestions */}
            {showSuggestions && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                border: '1px solid #e9ecef',
                zIndex: 1000,
                marginTop: '4px'
              }}>
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSearchName(suggestion);
                      setShowSuggestions(false);
                    }}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      borderBottom: index < suggestions.length - 1 ? '1px solid #f8f9fa' : 'none',
                      fontSize: '14px',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    🔍 {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
          <select
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            className="input-field"
          >
            <option value="">All Categories</option>
            <option value="Chocolate">Chocolate</option>
            <option value="Candy">Candy</option>
            <option value="Gummy">Gummy</option>
            <option value="Lollipop">Lollipop</option>
            <option value="Cake">Cake</option>
            <option value="Cookie">Cookie</option>
            <option value="Ice Cream">Ice Cream</option>
            <option value="Donut">Donut</option>
            <option value="Pastry">Pastry</option>
            <option value="Toffee">Toffee</option>
          </select>
          <button 
            onClick={() => {
              setSearchName('');
              setSearchCategory('');
            }} 
            className="btn-primary" 
            style={{ background: '#6c757d' }}
          >
            Clear
          </button>
        </div>

        {/* Advanced Filters */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          marginBottom: '15px'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#666' }}>Price Range</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="range"
                min="0"
                max="100"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({...prev, max: parseInt(e.target.value)}))}
                style={{ flex: 1 }}
              />
              <span style={{ fontSize: '12px', color: '#666', minWidth: '60px' }}>
                $0 - ${priceRange.max}
              </span>
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#666' }}>Availability</label>
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value as any)}
              className="input-field"
              style={{ fontSize: '14px', padding: '8px 12px' }}
            >
              <option value="all">All Items</option>
              <option value="in-stock">In Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Sort Controls */}
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          alignItems: 'center',
          flexWrap: 'wrap',
          marginBottom: '20px'
        }}>
          <span style={{ fontWeight: '500', color: '#555' }}>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="input-field"
            style={{ minWidth: '120px' }}
          >
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="quantity">Stock</option>
            <option value="category">Category</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="btn-primary"
            style={{ 
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            {sortOrder === 'asc' ? '↑' : '↓'} {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
          </button>
          <span style={{ fontSize: '14px', color: '#6c757d' }}>
            {sweets.length} of {allSweets.length} sweets
          </span>
        </div>

        {error && <div className="alert-error">{error}</div>}
      </div>

      {/* Sweets Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '15px',
        marginTop: '20px'
      }}>
        {sweets.map((sweet) => (
          <div 
            key={sweet._id} 
            className="card"
            style={{
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            }}
          >
            {/* Sweet Image */}
            <div style={{ marginBottom: '15px' }}>
              <div style={{
                width: '100%',
                height: '200px',
                borderRadius: '8px',
                border: '1px solid #e9ecef',
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{ fontSize: '72px' }}>
                  {getPlaceholderImage(sweet.category, sweet.name)}
                </div>
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              marginBottom: '15px'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600',
                color: '#333',
                margin: 0
              }}>
                {sweet.name}
              </h3>
              <span className={`badge ${sweet.quantity > 0 ? 'badge-success' : 'badge-danger'}`}>
                {sweet.quantity > 0 ? `${sweet.quantity} in stock` : 'Out of Stock'}
              </span>
            </div>
            
            <div style={{ marginBottom: '20px', color: '#6c757d' }}>
              <p style={{ marginBottom: '8px', fontSize: '14px' }}>
                <strong>Category:</strong> {sweet.category}
              </p>
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#28a745' }}>
                ${sweet.price.toFixed(2)}
              </p>
              {user?.role === 'ADMIN' && (
                <p style={{ fontSize: '12px', color: '#6c757d', marginTop: '8px' }}>
                  <strong>ID:</strong> 
                  <code style={{ 
                    background: '#f8f9fa', 
                    padding: '2px 6px', 
                    borderRadius: '4px',
                    marginLeft: '5px',
                    fontSize: '11px'
                  }}>
                    {sweet._id}
                  </code>
                </p>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {sweet.quantity > 0 && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  padding: '4px'
                }}>
                  <button
                    onClick={() => updateQuantity(sweet._id, -1)}
                    style={{
                      width: '36px',
                      height: '36px',
                      border: 'none',
                      background: '#e9ecef',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    -
                  </button>
                  <span style={{ 
                    padding: '0 12px', 
                    fontSize: '14px', 
                    fontWeight: '600',
                    minWidth: '20px',
                    textAlign: 'center'
                  }}>
                    {purchaseQuantities[sweet._id] || 1}
                  </span>
                  <button
                    onClick={() => updateQuantity(sweet._id, 1)}
                    style={{
                      width: '36px',
                      height: '36px',
                      border: 'none',
                      background: '#e9ecef',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    +
                  </button>
                </div>
              )}
              
              <button
                onClick={() => handlePurchase(sweet._id)}
                disabled={sweet.quantity === 0}
                className="btn-success"
                style={{ flex: 1 }}
              >
                {sweet.quantity === 0 ? 'Out of Stock' : `Buy ${purchaseQuantities[sweet._id] || 1}`}
              </button>
              
              {user?.role === 'ADMIN' && (
                <button
                  onClick={() => handleDelete(sweet._id)}
                  className="btn-danger"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {sweets.length === 0 && !loading && allSweets.length > 0 && (
        <EmptyState 
          type="no-results" 
          onClear={() => {
            setSearchName('');
            setSearchCategory('');
          }} 
        />
      )}
      
      {allSweets.length === 0 && !loading && (
        <EmptyState type="no-sweets" />
      )}
    </div>
  );
};

export default SweetsList;