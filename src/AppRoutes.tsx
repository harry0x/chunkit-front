import { Routes, Route } from 'react-router-dom';
// import { useAuth } from './context/AuthContext';
// import { Loader2 } from 'lucide-react';

// Pages to be created
import Landing from './pages/Landing';
/*
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Profile from './pages/Profile';
import Pricing from './pages/Pricing';
import AdminLayout from './pages/admin/AdminLayout';
import UsersList from './pages/admin/UsersList';
import ManagePlans from './pages/admin/ManagePlans';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" state={{ from: location }} replace />;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/" replace />;

  return <>{children}</>;
};
*/

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      {/* Auth and Membership routes commented out
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/pricing" element={<Pricing />} />
      
      <Route path="/profile" element={
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      } />
      
      <Route path="/admin" element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }>
        <Route index element={<Navigate to="/admin/users" replace />} />
        <Route path="users" element={<UsersList />} />
        <Route path="plans" element={<ManagePlans />} />
      </Route>
      */}
    </Routes>
  );
}
