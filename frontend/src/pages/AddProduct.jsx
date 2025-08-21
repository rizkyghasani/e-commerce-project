import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Mengambil token dari localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You need to be logged in to add a product.');
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:3001/api/products/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Mengirim token di header
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Product added successfully!');
        navigate('/dashboard/seller'); // Redirect ke dashboard penjual
      } else {
        alert('Failed to add product: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Server error while adding product.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-8">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Add a New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input type="text" name="image_url" value={formData.image_url} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;