import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/navbar";
import Home from "./pages/home";
import About from "./pages/about";
import Events from "./pages/Events";
import Login from "./pages/login";
import Register from "./pages/register";
import UserLayout from "./layouts/userlayout";
import AdminLayout from "./layouts/adminlayout";
import UserHome from "./pages/userdash/UserHome";
import AdminHome from "./pages/admindash/AdminHome";
import ProtectedRoute from "./components/Protectedroute";
import ManageEvents from "./pages/admindash/ManageEvents";
import ManageUsers from "./pages/admindash/ManageUsers";
import AllBookings from "./pages/admindash/AllBookings";
import BrowseEvents from "./pages/userdash/BrowseEvents";
import BookEvent from "./pages/userdash/bookevents";
import MyBookings from "./pages/userdash/Mybookings";
import Profile from "./pages/userdash/Profile";

const PublicPage = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

const App = () => {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>

        {/* Public routes */}
        <Route path="/" element={<PublicPage><Home /></PublicPage>} />
        <Route path="/about" element={<PublicPage><About /></PublicPage>} />
        <Route path="/events" element={<PublicPage><Events /></PublicPage>} />
        <Route path="/login" element={<PublicPage><Login /></PublicPage>} />
        <Route path="/register" element={<PublicPage><Register /></PublicPage>} />

        {/* User Dashboard */}
        <Route
          path="/userdash"
          element={
            <ProtectedRoute allowedRole="user">
              <UserLayout><UserHome /></UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/userdash/events"
          element={
            <ProtectedRoute allowedRole="user">
              <UserLayout><BrowseEvents /></UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/userdash/events/:id"
          element={
            <ProtectedRoute allowedRole="user">
              <UserLayout><BookEvent /></UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/userdash/mybookings"
          element={
            <ProtectedRoute allowedRole="user">
              <UserLayout><MyBookings /></UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/userdash/profile"
          element={
            <ProtectedRoute allowedRole="user">
              <UserLayout><Profile /></UserLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admindash"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout><AdminHome /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admindash/events"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout><ManageEvents /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admindash/users"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout><ManageUsers /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admindash/bookings"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout><AllBookings /></AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <PublicPage>
              <h1 className="text-3xl text-center mt-20 text-white">
                404 - Page Not Found
              </h1>
            </PublicPage>
          }
        />

      </Routes>
    </BrowserRouter>
  );
};

export default App;