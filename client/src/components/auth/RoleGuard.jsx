'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectCurrentRole, selectIsAuthenticated, selectAuthLoading, ROLES } from '@/store/slices/authSlice';

/**
 * RoleGuard is a Higher Order Component for Route Protection.
 * It checks if the user is authenticated and if they have the required role to access the wrapped content.
 */
export default function RoleGuard({ children, allowedRoles }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectCurrentRole);
  const isLoading = useSelector(selectAuthLoading);
  
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      // Not authenticated, redirect to login
      // optionally save the returnUrl in query params
      router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    if (allowedRoles && allowedRoles.length > 0) {
      if (!allowedRoles.includes(userRole)) {
        // Authenticated but unauthorized, redirect based on role or to an unauthorized page
        handleUnauthorizedRedirect(userRole, router);
        return;
      }
    }

    setIsAuthorized(true);
  }, [isAuthenticated, userRole, isLoading, router, pathname, allowedRoles]);

  if (isLoading || !isAuthorized) {
    // Return a loading spinner or skeleton screen while checking
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return <>{children}</>;
}

function handleUnauthorizedRedirect(role, router) {
  switch (role) {
    case ROLES.SUPER_ADMIN:
      router.push('/admin');
      break;
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
      break;
  }
}
