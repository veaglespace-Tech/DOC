import { createSlice } from '@reduxjs/toolkit';

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  SUPERADMIN: 'SUPERADMIN',
  CLINIC_ADMIN: 'CLINIC_ADMIN',
  ADMIN: 'ADMIN',
  DOCTOR: 'DOCTOR',
  PATIENT: 'PATIENT',
};

const initialState = {
  user: null,
  role: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, role } = action.payload;
      state.user = user;
      state.token = token;
      state.role = role || user?.roles?.[0] || user?.role || null;
      state.isAuthenticated = true;
      state.isLoading = false;
      if (typeof window !== 'undefined') {
        localStorage.setItem('careconnect_auth', JSON.stringify({ user: state.user, token: state.token, role: state.role }));
        if (token) localStorage.setItem('careconnect_token', token);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('careconnect_auth');
        localStorage.removeItem('careconnect_token');
        sessionStorage.removeItem('careconnect_token');
      }
    },
    setAuthLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { setCredentials, logout, setAuthLoading, updateUser } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentRole = (state) => state.auth.role;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.isLoading;

export default authSlice.reducer;
