'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import { useEffect } from 'react';
import { setCredentials, setAuthLoading } from './slices/authSlice';

function AuthHydrator({ children }) {
  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem('careconnect_auth');
      if (storedAuth) {
        const { user, token, role } = JSON.parse(storedAuth);
        if (token) {
          const assignedRole = role || user?.roles?.[0] || user?.role || null;
          store.dispatch(setCredentials({ user, token, role: assignedRole }));
          return;
        }
      }

      const fallbackToken = localStorage.getItem('careconnect_token') || sessionStorage.getItem('careconnect_token');
      if (fallbackToken) {
        store.dispatch(setCredentials({ user: null, token: fallbackToken, role: null }));
        return;
      }
    } catch (e) {
      localStorage.removeItem('careconnect_auth');
    }

    store.dispatch(setAuthLoading(false));
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
