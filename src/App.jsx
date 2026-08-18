import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth, forceLogout, fetchMe as fetchMeThunk } from './store/authSlice';
import store from './store';
import BrandLoader from './components/ui/BrandLoader';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import NotificationGate from './components/NotificationGate';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AddListing = lazy(() => import('./pages/AddListing'));
const ListedItems = lazy(() => import('./pages/ListedItems'));
const ListingDetails = lazy(() => import('./pages/ListingDetails'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Profile = lazy(() => import('./pages/Profile'));

function RequireAuth({ children }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Navigate to="/" replace /> : children;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        JSON.parse(storedUser);
        // Single account-aware bootstrap: /auth/me resolves the correct
        // collection (users vs listers) from the token's accountType.
        store.dispatch(fetchMeThunk());
      } catch {
        localStorage.removeItem('user');
      }
    }
  }, []);

  useEffect(() => {
    const handleForceLogout = () => {
      store.dispatch(forceLogout());
    };
    window.addEventListener('auth:logout', handleForceLogout);
    return () => window.removeEventListener('auth:logout', handleForceLogout);
  }, []);

  return (
    <>
      <ScrollToTop />
      <NotificationGate />
      <ErrorBoundary>
        <Suspense fallback={<BrandLoader />}>
          <Routes>
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route element={<RequireAuth><Layout /></RequireAuth>}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/listings" element={<ListedItems />} />
              <Route path="/listed-items" element={<Navigate to="/listings" replace />} />
              <Route path="/listings/pending" element={<Navigate to="/listings?status=pending" replace />} />
              <Route path="/listings/approved" element={<Navigate to="/listings?status=approved" replace />} />
              <Route path="/listings/changes-required" element={<Navigate to="/listings?status=changes-required" replace />} />
              <Route path="/listings/new" element={<Navigate to="/add-listing" replace />} />
              <Route path="/listings/:listingId" element={<ListingDetails />} />
              <Route path="/add-listing" element={<AddListing />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

export default App;
