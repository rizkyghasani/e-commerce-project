import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { isLoggedIn, userName, userRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-blue-600 text-white shadow-md py-4 px-8 flex justify-between items-center">
      <span className="text-2xl font-bold">
        E-Commerce App
      </span>
      <nav className="flex space-x-4 items-center">
        {isLoggedIn ? (
          <>
            <span className="text-white text-lg font-medium">Halo, {userName}</span>
            {userRole === 'seller' && (
              <>
                <Link to="/dashboard/seller" className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full font-semibold transition-colors duration-300">
                  Dashboard Penjual
                </Link>
              </>
            )}
            {userRole === 'buyer' && (
                <Link to="/dashboard/buyer" className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-full font-semibold transition-colors duration-300">
                  Dashboard Pembeli
                </Link>
            )}
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full font-semibold transition-colors duration-300">
              Keluar
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-full font-semibold transition-colors duration-300">
              Masuk
            </Link>
            <Link to="/register" className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full font-semibold transition-colors duration-300">
              Daftar
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
