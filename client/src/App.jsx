import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import AnnouncementBar from './components/AnnouncementBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import GlobalWidgets from './components/GlobalWidgets';
import ScrollToTop from './components/ScrollToTop';

import Shop from './pages/Shop';
import Categories from './pages/Categories';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Topup from './pages/Deposit';
import GameDetail from './pages/GameDetail';
import Transactions from './pages/Transactions';
import Affiliate from './pages/Affiliate';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminDeposits from './pages/AdminDeposits';
import AdminUsers from './pages/AdminUsers';
import AdminPrizes from './pages/AdminPrizes';
import AdminCategories from './pages/AdminCategories';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Warranty from './pages/Warranty';
import AdminRoute from './components/AdminRoute';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import DebugData from './pages/DebugData';
import FixImageUrls from './pages/FixImageUrls';


function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <SocketProvider>
          <Router>
            <ScrollToTop />
            <Toaster position="top-right" reverseOrder={false} />
            <div className="flex flex-col min-h-screen bg-primary font-sans relative">
              {/* Premium Noise Overlay */}
              <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[9999] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

              <Navbar />
              <AnnouncementBar />
              <main className="flex-grow relative">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/game/:id" element={<GameDetail />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/topup" element={<Topup />} />
                  <Route path="/transactions" element={<Transactions />} />
                  <Route path="/affiliate" element={<Affiliate />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/warranty" element={<Warranty />} />
                  <Route path="/debug" element={<DebugData />} />

                  {/* Admin Routes */}

                  <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                  <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
                  <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
                  <Route path="/admin/deposits" element={<AdminRoute><AdminDeposits /></AdminRoute>} />
                  <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
                  <Route path="/admin/prizes" element={<AdminRoute><AdminPrizes /></AdminRoute>} />
                  <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
                  <Route path="/admin/fix-images" element={<AdminRoute><FixImageUrls /></AdminRoute>} />
                </Routes>
              </main>
              <GlobalWidgets />
              <Footer />
            </div>
          </Router>
        </SocketProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
