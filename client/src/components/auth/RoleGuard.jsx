'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectCurrentRole, selectIsAuthenticated, selectAuthLoading, ROLES } from '@/store/slices/authSlice';

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
      // Direct Super Admin routes to /admin/login instead of /login
      if (pathname.startsWith('/admin')) {
        router.push(`/admin/login`);
      } else if (pathname.startsWith('/doctor')) {
        router.push(`/login/doctor`);
      } else if (pathname.startsWith('/patient')) {
        router.push(`/login/patient`);
      } else {
        router.push(`/login`);
      }
      return;
    }

    if (allowedRoles && allowedRoles.length > 0) {
      if (!allowedRoles.includes(userRole)) {
        handleUnauthorizedRedirect(userRole, router);
        return;
      }
    }

    setIsAuthorized(true);
  }, [isAuthenticated, userRole, isLoading, router, pathname, allowedRoles]);

  if (isLoading || !isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"></div>
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
  }
}
