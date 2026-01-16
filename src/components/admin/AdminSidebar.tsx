'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    FileText,
    FolderTree,
    Tags,
    Settings,
    LogOut,
    Newspaper,
    ChevronRight,
    Search,
    User,
    Image as ImageIcon
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

type AdminSidebarProps = {
    className?: string;
    onClose?: () => void;
    showCloseButton?: boolean;
};

// Menu groups for better organization
const menuGroups = [
    {
        label: 'Overview',
        items: [
            {
                title: 'Dashboard',
                href: '/admin',
                icon: LayoutDashboard,
            },
        ],
    },
    {
        label: 'Content Management',
        items: [
            {
                title: 'All Posts',
                href: '/admin/posts',
                icon: FileText,
            },
            {
                title: 'Categories',
                href: '/admin/categories',
                icon: FolderTree,
            },
            {
                title: 'Tags',
                href: '/admin/tags',
                icon: Tags,
            },
            {
                title: 'Media Library',
                href: '/admin/media',
                icon: ImageIcon,
            },
        ],
    },
    {
        label: 'System',
        items: [
            {
                title: 'Profile',
                href: '/admin/profile',
                icon: User,
            },
            {
                title: 'Settings',
                href: '/admin/settings',
                icon: Settings,
            },
        ],
    },
];

export default function AdminSidebar({
    className = '',
    onClose,
    showCloseButton = false,
}: AdminSidebarProps) {
    const pathname = usePathname();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await signOut({ callbackUrl: '/admin/signin' });
    };

    return (
        <aside
            className={`w-[280px] bg-white border-r border-slate-200 h-screen sticky top-0 flex flex-col z-50 overflow-y-auto ${className}`}
        >
            {/* 1. Header Section */}
            <div className="h-20 flex items-center px-8 mb-2">
                <Link
                    href="/admin"
                    className="flex items-center gap-2 group w-full"
                    onClick={onClose}
                >
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                        <Newspaper size={18} />
                    </div>
                    <span className="font-bold text-xl text-slate-800 tracking-tight">
                        NewsPortal
                    </span>
                </Link>
                {showCloseButton && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="ml-auto p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <ChevronRight className="w-5 h-5 rotate-180" />
                    </button>
                )}
            </div>

            {/* 2. Navigation Section */}
            <div className="flex-1 px-4 space-y-8">
                {menuGroups.map((group) => (
                    <div key={group.label}>
                        <h3 className="px-4 mb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            {group.label}
                        </h3>
                        <div className="space-y-1">
                            {group.items.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href || (pathname !== '/admin' && pathname.startsWith(item.href));

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={onClose}
                                        className={`
                                            flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                                            ${isActive
                                                ? 'bg-blue-50 text-blue-700'
                                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                            }
                                        `}
                                    >
                                        <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                        <span>{item.title}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. Footer / User Section */}
            <div className="p-4 border-t border-slate-100 mt-auto">
                <div className="space-y-1">
                    <Link
                        href="/"
                        target="_blank"
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-50 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        <Newspaper className="w-4 h-4 text-slate-400" />
                        View Live Site
                    </Link>

                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors text-sm font-medium w-full text-left"
                    >
                        <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-500" />
                        {isLoggingOut ? 'Signing out...' : 'Sign Out'}
                    </button>
                </div>
            </div>
        </aside>
    );
}
