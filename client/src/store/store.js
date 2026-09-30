import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from './slices/authSlice';
import searchReducer from './slices/searchSlice';
import { doctorApi } from './api/doctorApi';
import { authApi } from './api/authApi';
import { appointmentApi } from './api/appointmentApi';
import { paymentApi } from './api/paymentApi';

// Redux Store Setup
export const store = configureStore({
  reducer: {
    auth: authReducer,
    search: searchReducer,
    [doctorApi.reducerPath]: doctorApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [appointmentApi.reducerPath]: appointmentApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      doctorApi.middleware, 
      authApi.middleware, 
      appointmentApi.middleware,
      paymentApi.middleware
    ),
});

setupListeners(store.dispatch);
