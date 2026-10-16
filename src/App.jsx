import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';
import { useAuth, setUser, clearAuth } from './store/authSlice';
import api, { getAccessToken } from './services/api';
import { setCachedUser, clearCachedUser } from './services/userCache';
import cache from './services/cacheService';
import { invalidateListings } from './services/listings';
import store from './store';
import BrandLoader from './components/ui/BrandLoader';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import NotificationGate from './components/NotificationGate';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken(true);
          localStorage.setItem('accessToken', idToken);

          // Sync with MongoDB (same pattern as Vishwam-Frontend)
          let profileData = null;
          try {
            const res = await api.post(
              '/auth/sync',
              {
                firebaseUid: firebaseUser.uid,
                email: firebaseUser.email,
                name: firebaseUser.displayName || undefined,
                role: 'lister',
              },
              {
                headers: {
                  Authorization: `Bearer ${idToken}`,
                },
              }
            );
            if (res.data?.data) {
              profileData = res.data.data;
            }
          } catch (syncErr) {
            console.warn('[App] MongoDB sync on auth state change failed:', syncErr?.message);
          }

          if (profileData) {
            // Scope cache to this user and clear previous user's data
            const userId = profileData._id || profileData.id || profileData.firebaseUid || firebaseUser.uid;
            if (cache.getScope() !== userId) {
              cache.clear();
              cache.setScope(userId);
            }
            invalidateListings();

            localStorage.setItem('user', JSON.stringify(profileData));
            setCachedUser(profileData);
            store.dispatch(setUser(profileData));
          } else {
            // Fallback to localStorage if sync fails
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
              try {
                const parsed = JSON.parse(storedUser);
                store.dispatch(setUser(parsed));
              } catch {
                localStorage.removeItem('user');
              }
            }
          }
        } catch (err) {
          console.warn('Auth state sync warning:', err);
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            try {
              store.dispatch(setUser(JSON.parse(storedUser)));
            } catch {
              localStorage.removeItem('user');
            }
          }
        }
      } else {
        const storedUser = localStorage.getItem('user');
        if (storedUser && getAccessToken()) {
          try {
            const parsed = JSON.parse(storedUser);
            store.dispatch(setUser(parsed));
          } catch {
            store.dispatch(clearAuth());
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleForceLogout = () => {
      cache.clear();
      cache.setScope(null);
      clearCachedUser();
      store.dispatch(clearAuth());
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
            <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
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
              <Route path="/add-listing/:categoryType" element={<AddListing />} />
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
