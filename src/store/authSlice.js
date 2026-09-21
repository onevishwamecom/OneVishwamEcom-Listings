import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { resolvePartnerIdentity } from '@/config/partnerDirectory';
import { setCachedUser } from '@/services/userCache';
import { authApi } from '@/services/authApi';
import { listerApi } from '@/services/listerApi';
import { setAuthTokens, clearAuthTokens, getAccessToken } from '@/services/api';

export const clearError = createAction('auth/clearError');
export const clearSuccess = createAction('auth/clearSuccess');

// Backend auth responses carry the account under a type-specific key:
// user endpoints -> { user }, lister endpoints -> { lister }.
const extractAccount = (payload) => payload?.user || payload?.lister || null;

export const firebaseEmailLogin = createAsyncThunk(
  'auth/firebaseEmailLogin',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email.trim(), password);
      const idToken = await result.user.getIdToken();
      if (!idToken) {
        throw new Error('No ID token received from Firebase Auth');
      }

      localStorage.setItem('accessToken', idToken);
      localStorage.removeItem('refreshToken');

      const partnerInfo = resolvePartnerIdentity(result.user.email);
      const userSession = {
        id: result.user.uid,
        uid: result.user.uid,
        email: result.user.email,
        vendorEmail: result.user.email,
        fullName: result.user.displayName || partnerInfo.partnerName || 'User',
        name: result.user.displayName || partnerInfo.partnerName || 'User',
        role: partnerInfo.role || 'lister',
        partnerName: partnerInfo.partnerName || '',
        isVerified: partnerInfo.isVerified || Boolean(result.user.emailVerified),
        isLocked: partnerInfo.isLocked || false,
        origin: partnerInfo.origin || undefined,
      };

      setCachedUser(userSession);
      return userSession;
    } catch (err) {
      let message = 'Login failed';
      if (err.code === 'auth/user-not-found') {
        message = 'No account found with this email address.';
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        message = 'Invalid email or password. Please try again.';
      } else if (err.code === 'auth/too-many-requests') {
        message = 'Too many failed login attempts. Access temporarily disabled for security.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      } else if (err.message) {
        message = err.message;
      }
      return rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await authApi.login(credentials);
    setAuthTokens(data.data);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const phoneLogin = createAsyncThunk('auth/phoneLogin', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await authApi.phoneLogin(credentials);
    setAuthTokens(data.data);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Phone login failed');
  }
});

export const sendOtp = createAsyncThunk('auth/sendOtp', async (phone, { rejectWithValue }) => {
  try {
    const { data } = await authApi.sendOtp(phone);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to send OTP');
  }
});

export const verifyOtp = createAsyncThunk('auth/verifyOtp', async ({ phone, otp }, { rejectWithValue }) => {
  try {
    const { data } = await authApi.verifyOtp({ phone, otp });
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Invalid OTP');
  }
});

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await authApi.register(userData);
    setAuthTokens(data.data);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const emailRegister = createAsyncThunk('auth/emailRegister', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await authApi.emailRegister(userData);
    setAuthTokens(data.data);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const { data } = await authApi.fetchMe();
    return data.data.user || data.data.lister;
  } catch (err) {
    if (err.response?.status === 401) {
      const token = getAccessToken();
      if (token) {
        return rejectWithValue('TOKEN_EXPIRED');
      }
    }
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch account');
  }
});

export const fetchListerMe = createAsyncThunk('auth/fetchListerMe', async (_, { rejectWithValue }) => {
  try {
    const { data } = await authApi.fetchListerMe();
    return data.data.lister;
  } catch (err) {
    if (err.response?.status === 401) {
      const token = getAccessToken();
      if (token) {
        return rejectWithValue('TOKEN_EXPIRED');
      }
    }
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch lister');
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    await authApi.logout(refreshToken);
    clearAuthTokens();
  } catch (err) {
    clearAuthTokens();
    return rejectWithValue(err.response?.data?.message || 'Logout failed');
  }
});

export const refresh = createAsyncThunk('auth/refresh', async (_, { rejectWithValue }) => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    const { data } = await authApi.refresh(refreshToken);
    setAuthTokens(data.data);
    return data.data;
  } catch (err) {
    clearAuthTokens();
    return rejectWithValue(err.response?.data?.message || 'Session expired');
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (body, { rejectWithValue }) => {
  try {
    const { data } = await authApi.updateProfile(body);
    return data.data.user || data.data.lister;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Profile update failed');
  }
});

export const changePassword = createAsyncThunk('auth/changePassword', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await authApi.changePassword(payload);
    setAuthTokens(data.data);
    return { ok: true };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Password change failed');
  }
});

export const updateNotifications = createAsyncThunk('auth/updateNotifications', async (body, { rejectWithValue }) => {
  try {
    const { data } = await authApi.updateNotifications(body);
    return data.data.user || data.data.lister;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update notifications');
  }
});

export const uploadProfileImage = createAsyncThunk('auth/uploadProfileImage', async (file, { rejectWithValue }) => {
  try {
    const { data } = await listerApi.uploadProfileImage(file);
    return data.data.profileImage;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Profile photo upload failed');
  }
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (email, { rejectWithValue }) => {
  try {
    await authApi.forgotPassword(email);
    return { email };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to send reset email');
  }
});

export const verifyUserOtp = createAsyncThunk('auth/verifyUserOtp', async ({ phone, otp }, { rejectWithValue }) => {
  try {
    const { data } = await authApi.verifyOtp({ phone, otp });
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Invalid OTP');
  }
});

export const resendUserOtp = createAsyncThunk('auth/resendUserOtp', async (email, { rejectWithValue }) => {
  try {
    await authApi.resendOtp(email);
    return { email };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to resend OTP');
  }
});

export const resetPasswordWithOtp = createAsyncThunk('auth/resetPasswordWithOtp', async (payload, { rejectWithValue }) => {
  try {
    await authApi.resetPassword(payload);
    return { ok: true };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Password reset failed');
  }
});

export const forceLogout = createAction('auth/forceLogout');

const storedUser = localStorage.getItem('user');
let parsedUser = null;
if (storedUser) {
  try {
    parsedUser = JSON.parse(storedUser);
  } catch {
    localStorage.removeItem('user');
  }
}
const initialState = {
  user: parsedUser,
  isLoggedIn: Boolean(parsedUser && getAccessToken()),
  loading: false,
  error: null,
  successMessage: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.isLoggedIn = Boolean(action.payload && getAccessToken());
      if (action.payload) localStorage.setItem('user', JSON.stringify(action.payload));
    },
    clearAuth(state) {
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
      state.successMessage = null;
      clearAuthTokens();
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
    };
    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };

builder
        .addCase(clearError, (state) => {
          state.error = null;
        })
        .addCase(clearSuccess, (state) => {
          state.successMessage = null;
        })
        .addCase(firebaseEmailLogin.pending, handlePending)
        .addCase(firebaseEmailLogin.fulfilled, (state, action) => {
          state.loading = false;
          state.user = action.payload;
          state.isLoggedIn = true;
          localStorage.setItem('user', JSON.stringify(state.user));
        })
        .addCase(firebaseEmailLogin.rejected, handleRejected)
        .addCase(login.pending, handlePending)
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = extractAccount(action.payload);
        state.isLoggedIn = true;
        localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(login.rejected, handleRejected)
      .addCase(phoneLogin.pending, handlePending)
      .addCase(phoneLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = extractAccount(action.payload);
        state.isLoggedIn = true;
        localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(phoneLogin.rejected, handleRejected)
      .addCase(sendOtp.pending, handlePending)
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || 'OTP sent';
      })
      .addCase(sendOtp.rejected, handleRejected)
      .addCase(verifyOtp.pending, handlePending)
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = 'OTP verified';
      })
      .addCase(verifyOtp.rejected, handleRejected)
      .addCase(register.pending, handlePending)
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = extractAccount(action.payload);
        state.isLoggedIn = true;
        localStorage.setItem('user', JSON.stringify(state.user));
        state.successMessage = 'Registration successful';
      })
      .addCase(register.rejected, handleRejected)
      .addCase(emailRegister.pending, handlePending)
      .addCase(emailRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.user = extractAccount(action.payload);
        state.isLoggedIn = true;
        localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(emailRegister.rejected, handleRejected)
      .addCase(fetchMe.pending, (state) => { state.loading = true; })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isLoggedIn = true;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.loading = false;
        if (action.payload === 'TOKEN_EXPIRED') {
          state.error = null;
        } else {
          state.error = action.payload;
        }
        if (!getAccessToken()) {
          state.user = null;
          state.isLoggedIn = false;
          localStorage.removeItem('user');
        }
      })
      .addCase(fetchListerMe.pending, (state) => { state.loading = true; })
      .addCase(fetchListerMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isLoggedIn = true;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(fetchListerMe.rejected, (state, action) => {
        state.loading = false;
        if (action.payload === 'TOKEN_EXPIRED') {
          state.error = null;
        } else {
          state.error = action.payload;
        }
        if (!getAccessToken()) {
          state.user = null;
          state.isLoggedIn = false;
          localStorage.removeItem('user');
        }
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isLoggedIn = false;
        state.error = null;
        state.successMessage = null;
        localStorage.removeItem('user');
      })
      .addCase(logout.rejected, (state) => {
        state.user = null;
        state.isLoggedIn = false;
        state.error = null;
        state.successMessage = null;
        localStorage.removeItem('user');
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
        state.successMessage = 'Profile updated successfully';
        localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(updateProfile.rejected, handleRejected)
      .addCase(changePassword.fulfilled, (state) => {
        state.successMessage = 'Password changed successfully';
      })
      .addCase(changePassword.rejected, handleRejected)
      .addCase(updateNotifications.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
        state.successMessage = 'Notification preferences updated';
        localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(updateNotifications.rejected, handleRejected)
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.user = { ...state.user, profileImage: action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(uploadProfileImage.rejected, handleRejected)
      .addCase(forgotPassword.fulfilled, (state) => {
        state.successMessage = 'If an account exists, a reset email was sent';
      })
      .addCase(forgotPassword.rejected, handleRejected)
      .addCase(verifyUserOtp.fulfilled, (state) => {
        state.successMessage = 'OTP verified';
      })
      .addCase(verifyUserOtp.rejected, handleRejected)
      .addCase(resendUserOtp.fulfilled, (state) => {
        state.successMessage = 'OTP resent';
      })
      .addCase(resendUserOtp.rejected, handleRejected)
      .addCase(resetPasswordWithOtp.fulfilled, (state) => {
        state.successMessage = 'Password reset successful';
      })
      .addCase(resetPasswordWithOtp.rejected, handleRejected)
      .addCase(forceLogout, (state) => {
        state.user = null;
        state.isLoggedIn = false;
        state.error = null;
        state.successMessage = null;
        localStorage.removeItem('user');
        clearAuthTokens();
      });
  },
});

export const { setUser, clearAuth } = authSlice.actions;

export function useAuth() {
  const dispatch = useDispatch();
  const { user, isLoggedIn, loading, error, successMessage } = useSelector((state) => state.auth);
  return {
    user,
    isLoggedIn,
    loading,
    error,
    successMessage,
    firebaseEmailLogin: (creds) => dispatch(firebaseEmailLogin(creds)),
    login: (creds) => dispatch(login(creds)),
    phoneLogin: (creds) => dispatch(phoneLogin(creds)),
    sendOtp: (phone) => dispatch(sendOtp(phone)),
    register: (data) => dispatch(register(data)),
    emailRegister: (data) => dispatch(emailRegister(data)),
    logout: () => dispatch(logout()),
    fetchMe: () => dispatch(fetchMe()),
    updateProfile: (body) => dispatch(updateProfile(body)),
    uploadProfileImage: (file) => dispatch(uploadProfileImage(file)),
    changePassword: (payload) => dispatch(changePassword(payload)),
    updateNotifications: (body) => dispatch(updateNotifications(body)),
    forgotPassword: (email) => dispatch(forgotPassword(email)),
    verifyOtp: (payload) => dispatch(verifyUserOtp(payload)),
    resendOtp: (payload) => dispatch(resendUserOtp(payload)),
    resetPassword: (payload) => dispatch(resetPasswordWithOtp(payload)),
    fetchListerMe: () => dispatch(fetchListerMe()),
    clearError: () => dispatch(clearError()),
    clearSuccess: () => dispatch(clearSuccess()),
  };
}

export default authSlice.reducer;