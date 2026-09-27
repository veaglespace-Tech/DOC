import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from './slices/authSlice';
import searchReducer from './slices/searchSlice';
import { doctorApi } from './api/doctorApi';

// Redux Store Setup
export const store = configureStore({
  reducer: {
    auth: authReducer,
    search: searchReducer,
    [doctorApi.reducerPath]: doctorApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(doctorApi.middleware),
});

setupListeners(store.dispatch);

