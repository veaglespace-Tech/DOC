import RoleGuard from '@/components/auth/RoleGuard';
import { ROLES } from '@/store/slices/authSlice';

export default function AdminLayout({ children }) {
  return (
    <RoleGuard allowedRoles={[ROLES.SUPER_ADMIN]}>
      <div className="flex min-h-screen flex-col bg-background">
        <header className="flex h-16 items-center border-b px-6 bg-white shadow-sm">
          <h1 className="text-lg font-bold">Super Admin Dashboard</h1>
        </header>
        <div className="flex flex-1">
          <aside className="w-64 border-r bg-gray-50/40 p-4">
            <nav className="space-y-2">
              {/* Admin Sidebar Navigation */}
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
