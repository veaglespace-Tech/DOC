'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import { useEffect } from 'react';
import { setCredentials, setAuthLoading } from './slices/authSlice';

function AuthHydrator({ children }) {
  useEffect(() => {
    const storedAuth = localStorage.getItem('careconnect_auth');
    if (storedAuth) {
      try {
        const { user, token, role } = JSON.parse(storedAuth);
        store.dispatch(setCredentials({ user, token, role }));
      } catch (e) {
        localStorage.removeItem('careconnect_auth');
        store.dispatch(setAuthLoading(false));
      }
    } else {
      store.dispatch(setAuthLoading(false));
    }
  }, []);

  return <>{children}</>;
}

export default function StoreProvider({ children }) {
  return (
    <Provider store={store}>
      <AuthHydrator>
        {children}
      </AuthHydrator>
    </Provider>
  );
}
