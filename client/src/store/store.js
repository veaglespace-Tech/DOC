import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

// Redux Store Setup
export const store = configureStore({
  reducer: {
    // Add reducers here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(/* Add API middlewares here */),
});

setupListeners(store.dispatch);
