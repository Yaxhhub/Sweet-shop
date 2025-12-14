import React, { useState } from 'react';
import { sweetsAPI } from '../services/api';

interface AdminPanelProps {
  onSweetAdded: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onSweetAdded }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showRestockForm, setShowRestockForm] = useState(false);
  const [restockId, setRestockId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: ''
  });
  const [restockQuantity, setRestockQuantity] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddSweet = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await sweetsAPI.create({
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity)
      });
      
      setFormData({ name: '', category: '', price: '', quantity: '' });
      setShowAddForm(false);
      onSweetAdded();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add sweet');
    } finally {
      setLoading(false);
    }
  };

  const handleRestock = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await sweetsAPI.restock(restockId, parseInt(restockQuantity));
      setRestockId('');
      setRestockQuantity('');
      setShowRestockForm(false);
      onSweetAdded();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to restock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ marginTop: '30px' }}>
      <h3 style={{ 
        marginBottom: '25px',
        color: '#333',
        fontWeight: '600'
      }}>
        Admin Control Panel
      </h3>
      
      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        marginBottom: '25px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={showAddForm ? 'btn-danger' : 'btn-success'}
        >
          {showAddForm ? 'Cancel' : 'Add Sweet'}
        </button>
        
        <button
          onClick={() => setShowRestockForm(!showRestockForm)}
          className={showRestockForm ? 'btn-danger' : 'btn-warning'}
        >
          {showRestockForm ? 'Cancel' : 'Restock Sweet'}
        </button>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {/* Add Sweet Form */}
      {showAddForm && (
        <div style={{ 
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '25px',
          backgroundColor: '#f8f9fa'
        }}>
          <h4 style={{ marginBottom: '20px', color: '#333' }}>Add New Sweet</h4>
          <form onSubmit={handleAddSweet}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '15px',
              marginBottom: '20px'
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#555' }}>Sweet Name</label>
                <input
                  type="text"
                  placeholder="Enter sweet name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#555' }}>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="input-field"
                >
                  <option value="">Select Category</option>
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
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#555' }}>Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#555' }}>Quantity</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                  className="input-field"
                />
              </div>

            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-success"
              style={{ width: '100%' }}
            >
              {loading ? 'Adding Sweet...' : 'Add Sweet'}
            </button>
          </form>
        </div>
      )}

      {/* Restock Form */}
      {showRestockForm && (
        <div style={{ 
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          padding: '20px',
          backgroundColor: '#f8f9fa'
        }}>
          <h4 style={{ marginBottom: '20px', color: '#333' }}>Restock Inventory</h4>
          <form onSubmit={handleRestock}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '2fr 1fr auto', 
              gap: '15px', 
              alignItems: 'end' 
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#555' }}>Sweet ID</label>
                <input
                  type="text"
                  placeholder="Enter sweet ID"
                  value={restockId}
                  onChange={(e) => setRestockId(e.target.value)}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#555' }}>Quantity</label>
                <input
                  type="number"
                  min="1"
                  placeholder="0"
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(e.target.value)}
                  required
                  className="input-field"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-warning"
              >
                {loading ? 'Restocking...' : 'Restock'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;