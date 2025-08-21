// src/components/ProductList.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProductList = ({ isSellerView = false }) => {
  const { userRole, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [isLoggedIn, isSellerView]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = 'http://localhost:3001/api/products';
      let headers = {};

      if (isSellerView && isLoggedIn && userRole === 'seller') {
        url = 'http://localhost:3001/api/products/seller';
        const token = localStorage.getItem('token');
        headers = { 'Authorization': `Bearer ${token}` };
      }

      const response = await fetch(url, { headers });
      const data = await response.json();
      
      if (response.ok) {
        setProducts(data);
      } else {
        setError(data.message || 'Failed to fetch products.');
      }
    } catch (err) {
      setError('Server error. Failed to fetch products.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3001/api/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          alert('Produk berhasil dihapus!');
          fetchProducts();
        } else {
          let message = 'Gagal menghapus produk.';
          try {
            const data = await response.json();
            message += ' ' + data.message;
          } catch (e) { }
          alert(message);
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert('Server error saat menghapus produk.');
      }
    }
  };

  const handleAddToCart = async (productId) => {
    if (!isLoggedIn) {
      alert('Anda harus login untuk menambahkan produk ke keranjang.');
      navigate('/login');
      return;
    }
    alert(`Produk dengan ID ${productId} berhasil ditambahkan ke keranjang (fitur keranjang akan kita bangun).`);
  };

  if (loading) return <div className="text-center mt-10 text-gray-700">Memuat...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">Kesalahan: {error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      {products.length > 0 ? (
        products.map(product => (
          <div key={product.id} className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-transform duration-300 hover:scale-105">
            <img 
              src={product.image_url || 'https://via.placeholder.com/400x300.png?text=No+Image'} 
              alt={product.name} 
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h2>
              <p className="text-gray-600 text-sm mb-4">{product.description}</p>
              <p className="text-2xl font-extrabold text-blue-600 mb-4">Rp {product.price}</p>
              <div className="flex justify-between items-center">
                {isSellerView ? (
                  <div className="flex space-x-2 w-full">
                    <button 
                      // Fungsionalitas Edit akan diimplementasikan di SellerDashboard
                      className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-full font-semibold hover:bg-yellow-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)} 
                      className="flex-1 bg-red-500 text-white py-2 px-4 rounded-full font-semibold hover:bg-red-600 transition-colors"
                    >
                      Hapus
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleAddToCart(product.id)} 
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-full font-semibold hover:bg-purple-700 transition-colors"
                  >
                    Tambah ke Keranjang
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 col-span-full">Tidak ada produk ditemukan.</p>
      )}
    </div>
  );
};

export default ProductList;
