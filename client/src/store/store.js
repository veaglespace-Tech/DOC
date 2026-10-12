import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from './slices/authSlice';
import searchReducer from './slices/searchSlice';
import { doctorApi } from './api/doctorApi';
import { authApi } from './api/authApi';
import { appointmentApi } from './api/appointmentApi';
import { paymentApi } from './api/paymentApi';
import { billingApi } from './api/billingApi';
import { patientApi } from './api/patientApi';
import { emergencyApi } from './api/emergencyApi';
import { adminApi } from './api/adminApi';

// Redux Store Setup
export const store = configureStore({
  reducer: {
    auth: authReducer,
    search: searchReducer,
    [doctorApi.reducerPath]: doctorApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [appointmentApi.reducerPath]: appointmentApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [billingApi.reducerPath]: billingApi.reducer,
    [patientApi.reducerPath]: patientApi.reducer,
    [emergencyApi.reducerPath]: emergencyApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      doctorApi.middleware, 
      authApi.middleware, 
      appointmentApi.middleware,
      paymentApi.middleware,
      billingApi.middleware,
      patientApi.middleware,
      emergencyApi.middleware,
      adminApi.middleware
    ),
});

setupListeners(store.dispatch);
