'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function AdminLayoutShell({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();

    // Close sidebar on route change
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    return (
        <div className="min-h-screen bg-slate-50/50 flex relative overflow-hidden text-slate-900">
            {/* Desktop Sidebar */}
            <AdminSidebar className="hidden lg:flex fixed left-0 top-0 bottom-0 z-50 border-r border-slate-200 bg-white" />

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/20 z-40 lg:hidden backdrop-blur-sm animate-fade-in"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-white border-r border-slate-200 shadow-2xl transform transition-transform duration-300 lg:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <AdminSidebar
                    onClose={() => setIsSidebarOpen(false)}
                    showCloseButton={true}
                    className="w-full h-full border-none"
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-300 lg:pl-[280px] relative z-10">
                {/* Mobile Header */}
                <header className="lg:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 flex items-center justify-between">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="font-bold text-lg text-slate-800">
                        NewsPortal
                    </span>
                    <div className="w-8" />
                </header>

                <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
