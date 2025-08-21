import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import Register from './pages/Register';
import Login from './pages/Login';
import AddProduct from './pages/AddProduct';
import BuyerDashboard from './pages/BuyerDashboard';
import SellerDashboard from './pages/SellerDashboard';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ProductList from './components/ProductList';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={
              <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6 text-center">Produk Terbaru</h1>
                <ProductList />
              </div>
            } />
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            
            <Route 
              path="dashboard/seller" 
              element={
                <ProtectedRoute requiredRole="seller">
                  <SellerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="dashboard/buyer" 
              element={
                <ProtectedRoute requiredRole="buyer">
                  <BuyerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="add-product" 
              element={
                <ProtectedRoute requiredRole="seller">
                  <AddProduct />
                </ProtectedRoute>
              } 
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
