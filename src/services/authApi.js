import api from './api';

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  phoneLogin: (credentials) => api.post('/auth/lister/login', credentials),
  sendOtp: (phone) => api.post('/auth/lister/send-otp', { phone }),
  verifyOtp: ({ phone, otp }) => api.post('/auth/lister/verify-otp', { phone, otp }),
  register: (userData) => api.post('/auth/lister/register', userData),
  emailRegister: (userData) => api.post('/auth/register', userData),
  fetchMe: async () => {
    try {
      return await api.get('/auth/me');
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 404) {
        const stored = localStorage.getItem('user');
        if (stored) {
          try {
            const user = JSON.parse(stored);
            return { data: { success: true, data: { user } } };
          } catch {
            // ignore
          }
        }
      }
      throw err;
    }
  },
  fetchListerMe: async () => {
    try {
      return await api.get('/auth/lister/me');
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 404) {
        const stored = localStorage.getItem('user');
        if (stored) {
          try {
            const lister = JSON.parse(stored);
            return { data: { success: true, data: { lister } } };
          } catch {
            // ignore
          }
        }
      }
      throw err;
    }
  },
  logout: (refreshToken) => api.post('/auth/logout', { refreshToken }),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  updateProfile: (body) => api.put('/auth/profile', body),
  updateNotifications: (body) => api.put('/auth/profile', { notifications: body }),
  changePassword: (payload) => api.put('/auth/password', payload),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resendOtp: (email) => api.post('/auth/resend-otp', { email }),
  resetPassword: (payload) => api.post('/auth/reset-password', payload),
};
