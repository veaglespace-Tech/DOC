import RoleGuard from '@/components/auth/RoleGuard';
import { ROLES } from '@/store/slices/authSlice';

export default function DoctorLayout({ children }) {
  return (
    <RoleGuard allowedRoles={[ROLES.DOCTOR]}>
      <div className="flex min-h-screen flex-col bg-background">
        <header className="flex h-16 items-center border-b px-6 bg-white shadow-sm">
          <h1 className="text-lg font-bold">Doctor Dashboard</h1>
        </header>
        <div className="flex flex-1">
          <aside className="w-64 border-r bg-gray-50/40 p-4">
            <nav className="space-y-2">
              {/* Doctor Sidebar Navigation */}
            </nav>
          </aside>
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
