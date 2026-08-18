import Swal from 'sweetalert2';

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
    logout();
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