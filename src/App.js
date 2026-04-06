import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Login from './pages/Login';
import CustomerSignup from './pages/CustomerSignup';
import ProviderSignup from './pages/ProviderSignup';
import Categories from './pages/Categories';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Providers from './pages/Providers';
import ServiceDetail from './pages/ServiceDetail';
import ScrollToTop from './components/UI/ScrollToTop';
import ProtectedRoute from './components/UI/ProtectedRoute';

import HomeProvider from './pages/provider/pages/HomeProvider';
import MyServicesPage from './pages/provider/pages/MyServicesPage';
import { AddNewServicePage } from './pages/provider/pages/AddNewService';
import ServiceRequestsPage from './pages/provider/pages/ServiceRequestsPage';
import ServiceDetailsPage from './pages/provider/pages/ServiceDetailsPage';
import Dash from './pages/dash';

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          className: 'shadow-lg bg-[#FEFAF6] text-[#102C57] font-bold border border-[#EADBC8] text-[12px]',
        }}
      />

      <Router basename="/joker_website">
        <ScrollToTop />
        <Routes>
          {/* ── Public routes ── */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup-customer" element={<CustomerSignup />} />
          <Route path="/signup-provider" element={<ProviderSignup />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/providers" element={<Providers />} />
          <Route path="/service/:id" element={<ServiceDetail />} />

          {/* ── Protected routes — require login ── */}
          <Route
            path="/dash"
            element={
              <ProtectedRoute>
                <Dash />
              </ProtectedRoute>
            }
          />
          <Route
            path="/provider/home"
            element={
              <ProtectedRoute>
                <HomeProvider />
              </ProtectedRoute>
            }
          />
          <Route
            path="/provider/services"
            element={
              <ProtectedRoute>
                <MyServicesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/add-service"
            element={
              <ProtectedRoute>
                <AddNewServicePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/service-requests"
            element={
              <ProtectedRoute>
                <ServiceRequestsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/service-details"
            element={
              <ProtectedRoute>
                <ServiceDetailsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;