import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SellerDashboard = () => {
  const { userName } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchSellerProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/products/seller', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch seller products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3001/api/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          alert('Product deleted successfully!');
          fetchSellerProducts(); // Muat ulang daftar produk
        } else {
          const data = await response.json();
          alert('Failed to delete product: ' + data.message);
        }
      } catch (err) {
        alert('Server error during deletion.');
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingProduct),
      });

      if (response.ok) {
        alert('Product updated successfully!');
        setEditingProduct(null); // Tutup formulir edit
        fetchSellerProducts(); // Muat ulang daftar produk
      } else {
        const data = await response.json();
        alert('Failed to update product: ' + data.message);
      }
    } catch (err) {
      alert('Server error during update.');
    }
  };

  if (loading) return <p className="text-center mt-20">Loading your products...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-green-600 text-center">Welcome, {userName}!</h1>
      <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">Your Products</h2>
      
      <button onClick={() => navigate('/add-product')} className="my-4 py-2 px-4 bg-indigo-600 text-white rounded-md">
        Add New Product
      </button>

      {editingProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
            <h3 className="text-2xl font-bold mb-4">Edit Product</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="mt-1 block w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="mt-1 block w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                  className="mt-1 block w-full p-2 border rounded-md"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button type="button" onClick={() => setEditingProduct(null)} className="py-2 px-4 rounded-md text-sm font-medium text-gray-700 bg-gray-200">
                  Cancel
                </button>
                <button type="submit" className="py-2 px-4 rounded-md text-sm font-medium text-white bg-blue-600">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {products.length === 0 ? (
        <p className="text-center text-gray-500">You have not added any products yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
              <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800 truncate">{product.name}</h3>
                <p className="mt-2 text-gray-600 line-clamp-2">{product.description}</p>
                <p className="mt-4 text-2xl font-semibold text-green-600">${product.price}</p>
                <div className="mt-4 flex space-x-2">
                  <button onClick={() => handleEdit(product)} className="flex-1 py-2 px-4 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="flex-1 py-2 px-4 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;