import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background">
            <AdminSidebar />

            {/* Main Content */}
            <div className="lg:pl-64">
                <main className="p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
