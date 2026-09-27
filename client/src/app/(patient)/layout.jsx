import RoleGuard from '@/components/auth/RoleGuard';
import { ROLES } from '@/store/slices/authSlice';

export default function PatientLayout({ children }) {
  return (
    <RoleGuard allowedRoles={[ROLES.PATIENT]}>
      <div className="flex min-h-screen flex-col bg-background">
        <header className="flex h-16 items-center border-b px-6 bg-white shadow-sm">
          <h1 className="text-lg font-bold">Patient Portal</h1>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Patient content is usually full width without sidebar */}
          {children}
        </main>
      </div>
    </RoleGuard>
  );
}
