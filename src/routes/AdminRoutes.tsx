import { Route, Routes } from 'react-router-dom';
import AdminDashboard from '../pages/AdminDashboard';
import AdminOffers from '../pages/AdminOffers';
import { useAuth } from '../hooks/useAuth';

const AdminRoutes = () => {
  const { user } = useAuth();

  if (!user || !user.isAdmin) {
    return <div>You are not authorized to view this page.</div>;
  }

  return (
    <Routes>
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/offers" element={<AdminOffers />} />
    </Routes>
  );
};

export default AdminRoutes;
