import Swal from 'sweetalert2';
import cache from '../services/cacheService';
import { clearCachedUser } from '../services/userCache';
import { clearAuthTokens } from '../services/api';

export async function confirmLogout({ logout, navigate }) {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'You will be logged out of your account.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#2563eb',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, logout',
    cancelButtonText: 'Cancel',
  });
  if (result.isConfirmed) {
    // 1. Immediately clear tokens and client cache to abort any in-flight/background queries
    clearAuthTokens();
    cache.clear();
    cache.setScope(null);
    clearCachedUser();

    // 2. Await the logout async thunk so auth state transitions to logged-out
    try {
      await logout();
    } catch {
      // ignore
    }

    // 3. Clear again to guarantee no lingering state
    clearAuthTokens();
    cache.clear();
    cache.setScope(null);
    clearCachedUser();

    Swal.fire({
      icon: 'success',
      title: 'Logged out',
      timer: 1200,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
    });
    navigate('/login', { replace: true });
  }
}