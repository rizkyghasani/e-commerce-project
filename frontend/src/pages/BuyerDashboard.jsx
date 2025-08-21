import React from 'react';
import { useAuth } from '../context/AuthContext';
import ProductList from '../components/ProductList';

const BuyerDashboard = () => {
  const { userName } = useAuth();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Katalog Produk</h1>
      <p className="text-lg text-gray-600 mb-6 text-center">Selamat datang, {userName}! Jelajahi produk kami.</p>
      <ProductList />
    </div>
  );
};

export default BuyerDashboard;