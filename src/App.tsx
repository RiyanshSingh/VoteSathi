import { lazy, Suspense, type ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { useAuth } from './context/AuthContext';
import { PageSkeleton } from './components/SkeletonLoader';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Learn = lazy(() => import('./pages/Learn').then(m => ({ default: m.Learn })));
const Assistant = lazy(() => import('./pages/Assistant').then(m => ({ default: m.Assistant })));
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })));
const Welcome = lazy(() => import('./pages/Welcome').then(m => ({ default: m.Welcome })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <PageSkeleton />;
  }
  
  if (!user) {
    return <Navigate to="/welcome" replace />;
  }
  
  return children;
};

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <PageSkeleton />;
  }
  
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/welcome" element={<PublicRoute><Welcome /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route index element={<Home />} />
            <Route path="learn" element={<Learn />} />
            <Route path="assistant" element={<Assistant />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
