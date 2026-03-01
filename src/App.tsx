import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { TrackWorkout } from './pages/TrackWorkout';
import { History } from './pages/History';
import { Statistics } from './pages/Statistics';
import { Profile } from './pages/Profile';
import { Navigation } from './components/layout/Navigation';
import { InstallPrompt } from './components/common/InstallPrompt';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { useLocation } from 'react-router-dom';
import { initAnalytics, pageView } from './services/analytics';
import { UserProfile } from './pages/UserProfile';
import { UserSearch } from './components/social/UserSearch';
import { Search } from './pages/Search';
import { NotificationBell } from './components/notifications/NotificationBell';

// Component για redirect μετά το login
const AuthRedirect = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      console.log('User detected, redirecting to dashboard...');
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">💪</div>
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthStore();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">💪</div>
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

function App() {
  useEffect(() => {
    initAnalytics();
  }, []);

  // Component για tracking page views
  const PageTracker = () => {
    const location = useLocation();
    
    useEffect(() => {
      pageView(location.pathname);
    }, [location]);
    
    return null;
  };
  return (
    <>
      <ErrorBoundary>
        <Toaster position="top-center" />
        <BrowserRouter>
          <PageTracker />
          <div className="fixed top-[5px] right-[100px] z-[1000]"> {/* ΠΡΟΣΘΕΣΕ ΑΥΤΟ */}
            <NotificationBell />
          </div>
          <Navigation />
          <InstallPrompt />
          <Routes>
            <Route 
              path="/login" 
              element={
                <AuthRedirect>
                  <Login />
                </AuthRedirect>
              } 
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/track"
              element={
                <ProtectedRoute>
                  <TrackWorkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route
              path="/statistics"
              element={
                <ProtectedRoute>
                  <Statistics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:userId"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <Search />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </>
  );
}

export default App;