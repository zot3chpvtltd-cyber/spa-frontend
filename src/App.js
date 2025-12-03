import { Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './services/AuthContext';
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import About from "./components/About";
import Reviews from "./components/Reviews";
import Membership from "./components/Membership";
import BookNow from "./components/BookNow";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import BookingsManagement from "./components/admin/BookingsManagement";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import StaffManagement from "./components/admin/StaffManagement";
import ServicesManagement from "./components/admin/ServicesManagement";
import InventoryManagement from "./components/admin/InventoryManagement";
import SalesManagement from "./components/admin/SalesManagement";
import ExpensesManagement from "./components/admin/ExpensesManagement";
import ReviewsManagement from "./components/admin/ReviewsManagement";
import MasterAdminDashboard from "./components/admin/MasterAdminDashboard";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import "./App.css";
import "./components/ScrollbarUtilities.css";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <Services />
              <About />
              <Reviews />
            </>
          } />
          <Route path="/book" element={<BookNow />} />
          <Route path="/book/:serviceId" element={<BookNow />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Admin Routes with Sidebar */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="bookings" element={<BookingsManagement />} />
            <Route path="staff" element={<StaffManagement />} />
            <Route path="services" element={<ServicesManagement />} />
            <Route path="inventory" element={<InventoryManagement />} />
            <Route path="sales" element={<SalesManagement />} />
            <Route path="expenses" element={<ExpensesManagement />} />
            <Route path="reviews" element={<ReviewsManagement />} />
          </Route>

          <Route path="/master-admin" element={<MasterAdminDashboard />} />
        </Routes>
        <Footer />
        <WhatsAppButton />
        <ToastContainer position="bottom-right" />
      </div>
    </AuthProvider>
  );
}

export default App;
