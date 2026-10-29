'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentRole, selectIsAuthenticated, selectAuthLoading, ROLES, setCredentials } from '@/store/slices/authSlice';

export default function RoleGuard({ children, allowedRoles }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectCurrentRole);
  const isLoading = useSelector(selectAuthLoading);
  
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // 1. Synchronously read from localStorage if on client
    let localToken = null;
    let localRole = null;
    let localUser = null;

    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('careconnect_auth');
        if (stored) {
          const parsed = JSON.parse(stored);
          localToken = parsed?.token;
          localRole = parsed?.role || parsed?.user?.roles?.[0] || parsed?.user?.role;
          localUser = parsed?.user;
        }
        if (!localToken) {
          localToken = localStorage.getItem('careconnect_token') || sessionStorage.getItem('careconnect_token');
        }
      } catch (e) {
        // ignore JSON parse errors
      }
    }

    // 2. If Redux has not populated yet but localStorage contains credentials, hydrate immediately!
    if (!isAuthenticated && localToken) {
      dispatch(setCredentials({ user: localUser, token: localToken, role: localRole }));
      return; // Will re-evaluate on next render with isAuthenticated=true
    }

    // 3. If Redux is still loading and there's potentially credentials to hydrate, keep waiting
    if (isLoading) {
      return;
    }

    // 4. If confirmed NOT authenticated (no credentials in localStorage AND not in Redux)
    if (!isAuthenticated && !localToken) {
      if (pathname.startsWith('/admin')) {
        router.replace('/admin/login');
      } else if (pathname.startsWith('/doctor')) {
        router.replace('/login/doctor');
      } else if (pathname.startsWith('/patient')) {
        router.replace('/login/patient');
      } else {
        router.replace('/login');
      }
      return;
    }

    // 5. Verify Allowed Roles
    const currentRole = userRole || localRole;
    if (allowedRoles && allowedRoles.length > 0 && currentRole) {
      const normalizedUserRole = 
        currentRole === 'SUPERADMIN' ? ROLES.SUPER_ADMIN :
        currentRole === 'ADMIN' ? ROLES.CLINIC_ADMIN : currentRole;

      const normalizedAllowed = allowedRoles.map(r => 
        r === 'SUPERADMIN' ? ROLES.SUPER_ADMIN :
        r === 'ADMIN' ? ROLES.CLINIC_ADMIN : r
      );

      if (!normalizedAllowed.includes(normalizedUserRole) && !allowedRoles.includes(currentRole)) {
        handleUnauthorizedRedirect(normalizedUserRole, router);
        return;
      }
    }

    setIsAuthorized(true);
    setIsChecking(false);
  }, [isAuthenticated, userRole, isLoading, router, pathname, allowedRoles, dispatch]);

  if (isLoading || isChecking || !isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"></div>
          <span className="text-xs font-bold text-slate-400">Verifying session...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function handleUnauthorizedRedirect(role, router) {
  switch (role) {
    case 'SUPERADMIN':
    case ROLES.SUPER_ADMIN:
      router.push('/admin');
      break;
    case 'ADMIN':
    case ROLES.CLINIC_ADMIN:
      router.push('/clinic');
      break;
    case ROLES.DOCTOR:
      router.push('/doctor');
      break;
    case ROLES.PATIENT:
      router.push('/patient');
      break;
    default:
      router.push('/');
  }
}
