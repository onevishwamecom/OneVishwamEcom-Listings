import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile as updateFirebaseProfile, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { resolvePartnerIdentity } from '@/config/partnerDirectory';
import { isAllowedEmail, COMMON_DEFAULT_PASSWORD, getAllowedAccountDetails } from '@/config/allowedCredentials';
import { setCachedUser } from '@/services/userCache';
import { authApi } from '@/services/authApi';
import api from '@/services/api';
import { listerApi } from '@/services/listerApi';
import { setAuthTokens, clearAuthTokens, getAccessToken } from '@/services/api';

export const clearError = createAction('auth/clearError');
export const clearSuccess = createAction('auth/clearSuccess');

// Helper to strip 91 / +91 country code prefix from user phone/mobile
export const cleanUserAccount = (account) => {
  if (!account || typeof account !== 'object') return account;
  const cleaned = { ...account };
  ['mobile', 'phoneNumber', 'phone', 'contact'].forEach((key) => {
    if (cleaned[key]) {
      const str = String(cleaned[key]).trim();
      if (str.length === 12 && str.startsWith('91')) {
        cleaned[key] = str.slice(2);
      } else if (str.length === 13 && str.startsWith('+91')) {
        cleaned[key] = str.slice(3);
      }
    }
  });
  return cleaned;
};

// Backend auth responses carry the account under a type-specific key:
// user endpoints -> { user }, lister endpoints -> { lister }.
const extractAccount = (payload) => {
  const account = payload?.user || payload?.lister || null;
  return cleanUserAccount(account);
};

export const firebaseEmailLogin = createAsyncThunk(
  'auth/firebaseEmailLogin',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const cleanEmail = (email || '').trim().toLowerCase();

      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);

      const firebaseUser = userCredential.user;
      const idToken = await firebaseUser.getIdToken(true);
      if (!idToken) {
        throw new Error('No ID token received from Firebase Auth');
      }

      localStorage.setItem('accessToken', idToken);
      localStorage.removeItem('refreshToken');

      // Sync to MongoDB (same pattern as Vishwam-Frontend)
      let profileData = {
        firebaseUid: firebaseUser.uid,
        email: cleanEmail,
        fullName: firebaseUser.displayName || 'User',
        role: 'lister',
      };

      try {
        const res = await api.post(
          '/auth/sync',
          {
            firebaseUid: firebaseUser.uid,
            email: cleanEmail,
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
        console.warn('[Auth Sync] Backend profile sync deferred:', syncErr.response?.data || syncErr.message);
      }

      localStorage.setItem('user', JSON.stringify(profileData));
      setCachedUser(profileData);

      return profileData;
    } catch (err) {
      let message = 'Login failed';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        message = 'USER_NOT_FOUND';
      } else if (err.code === 'auth/wrong-password') {
        message = 'Incorrect password. Please try again.';
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

export const firebaseEmailRegister = createAsyncThunk(
  'auth/firebaseEmailRegister',
  async ({ name, email, phone, password }, { rejectWithValue }) => {
    try {
      const cleanEmail = (email || '').trim().toLowerCase();

      let userCredential = null;
      try {
        userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      } catch (createErr) {
        if (createErr.code === 'auth/email-already-in-use') {
          userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
        } else {
          throw createErr;
        }
      }

      const firebaseUser = userCredential.user;
      if (name && name.trim()) {
        await updateFirebaseProfile(firebaseUser, { displayName: name.trim() }).catch(() => null);
      }
      const idToken = await firebaseUser.getIdToken(true);
      if (!idToken) {
        throw new Error('No ID token received from Firebase Auth');
      }

      localStorage.setItem('accessToken', idToken);
      localStorage.removeItem('refreshToken');

      // Save to MongoDB (same pattern as Vishwam-Frontend)
      const rawDigits = phone ? String(phone).replace(/\D/g, '') : '';
      const cleanPhone = rawDigits.length === 12 && rawDigits.startsWith('91') ? rawDigits.slice(2) : rawDigits;

      let profileData = {
        firebaseUid: firebaseUser.uid,
        email: cleanEmail,
        fullName: name || firebaseUser.displayName || 'User',
        name: name || firebaseUser.displayName || 'User',
        phoneNumber: cleanPhone,
        mobile: cleanPhone,
        role: 'lister',
      };

      try {
        const res = await api.post(
          '/auth/sync',
          {
            firebaseUid: firebaseUser.uid,
            email: cleanEmail,
            fullName: name,
            phoneNumber: cleanPhone,
            mobile: cleanPhone,
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
        console.warn('[Auth Sync] Backend profile sync deferred:', syncErr.response?.data || syncErr.message);
      }

      localStorage.setItem('user', JSON.stringify(profileData));
      setCachedUser(profileData);
      return profileData;
    } catch (err) {
      let message = 'Registration failed';
      if (err.code === 'auth/email-already-in-use') {
        message = 'An account with this email address already exists. Please sign in.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      } else if (err.code === 'auth/weak-password') {
        message = 'Password should be at least 6 characters.';
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
  } finally {
    // Sign out of Firebase and clear all cached data
    try { await auth.signOut(); } catch { /* ignore */ }
    localStorage.removeItem('user');
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
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail) {
      return rejectWithValue('Please enter your email address');
    }
    await sendPasswordResetEmail(auth, cleanEmail);
    // Also notify backend in the background if available
    authApi.forgotPassword(cleanEmail).catch(() => {});
    return { email: cleanEmail };
  } catch (err) {
    let message = 'Failed to send password reset email';
    if (err.code === 'auth/user-not-found') {
      message = 'No account found with this email address. Please check or register.';
    } else if (err.code === 'auth/invalid-email') {
      message = 'Please enter a valid email address.';
    } else if (err.code === 'auth/too-many-requests') {
      message = 'Too many requests. Please wait a moment before trying again.';
    } else if (err.message) {
      message = err.message;
    }
    return rejectWithValue(message);
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
    parsedUser = cleanUserAccount(JSON.parse(storedUser));
    if (parsedUser) {
      localStorage.setItem('user', JSON.stringify(parsedUser));
    }
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
      const cleaned = cleanUserAccount(action.payload);
      state.user = cleaned;
      state.isLoggedIn = Boolean(cleaned && getAccessToken());
      if (cleaned) localStorage.setItem('user', JSON.stringify(cleaned));
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
          state.user = cleanUserAccount(action.payload);
          state.isLoggedIn = true;
          if (state.user) localStorage.setItem('user', JSON.stringify(state.user));
        })
        .addCase(firebaseEmailLogin.rejected, handleRejected)
        .addCase(login.pending, handlePending)
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = extractAccount(action.payload);
        state.isLoggedIn = true;
        if (state.user) localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(login.rejected, handleRejected)
      .addCase(phoneLogin.pending, handlePending)
      .addCase(phoneLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = extractAccount(action.payload);
        state.isLoggedIn = true;
        if (state.user) localStorage.setItem('user', JSON.stringify(state.user));
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
        if (state.user) localStorage.setItem('user', JSON.stringify(state.user));
        state.successMessage = 'Registration successful';
      })
      .addCase(register.rejected, handleRejected)
      .addCase(emailRegister.pending, handlePending)
      .addCase(emailRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.user = extractAccount(action.payload);
        state.isLoggedIn = true;
        if (state.user) localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(emailRegister.rejected, handleRejected)
      .addCase(firebaseEmailRegister.pending, handlePending)
      .addCase(firebaseEmailRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.user = cleanUserAccount(action.payload);
        state.isLoggedIn = true;
        state.error = null;
        state.successMessage = 'Registration successful';
        if (state.user) localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(firebaseEmailRegister.rejected, handleRejected)
      .addCase(fetchMe.pending, (state) => { state.loading = true; })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = cleanUserAccount(action.payload);
        state.isLoggedIn = true;
        if (state.user) localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.loading = false;
        if (state.user && getAccessToken()) {
          state.isLoggedIn = true;
          state.error = null;
        } else {
          state.user = null;
          state.isLoggedIn = false;
          state.error = action.payload;
          localStorage.removeItem('user');
        }
      })
      .addCase(fetchListerMe.pending, (state) => { state.loading = true; })
      .addCase(fetchListerMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = cleanUserAccount(action.payload);
        state.isLoggedIn = true;
        if (state.user) localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(fetchListerMe.rejected, (state, action) => {
        state.loading = false;
        if (state.user && getAccessToken()) {
          state.isLoggedIn = true;
          state.error = null;
        } else {
          state.user = null;
          state.isLoggedIn = false;
          state.error = action.payload;
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
        state.user = cleanUserAccount({ ...state.user, ...action.payload });
        state.successMessage = 'Profile updated successfully';
        if (state.user) localStorage.setItem('user', JSON.stringify(state.user));
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
    firebaseEmailRegister: (creds) => dispatch(firebaseEmailRegister(creds)),
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