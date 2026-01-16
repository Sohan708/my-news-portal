'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, FolderTree, Tags, Image, Settings, BarChart3, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/admin' },
    { icon: FileText, label: 'Posts', href: '/admin/posts' },
    { icon: FolderTree, label: 'Categories', href: '/admin/categories' },
    { icon: Tags, label: 'Tags', href: '/admin/tags' },
    { icon: Image, label: 'Media', href: '/admin/media' },
    { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-primary-foreground rounded-lg"
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 h-full w-64 bg-secondary border-r border-border z-40
                    transition-transform duration-300 lg:translate-x-0
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-border">
                        <Link href="/admin" className="flex items-center space-x-2">
                            <div className="text-xl font-bold font-serif">
                                <span className="text-primary">Sohan</span>{' '}
                                <span className="text-foreground">CMS</span>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 overflow-y-auto">
                        <ul className="space-y-1">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;

                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`
                                                flex items-center space-x-3 px-4 py-3 rounded-lg
                                                transition-colors
                                                ${isActive
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                                                }
                                            `}
                                        >
                                            <Icon size={20} />
                                            <span className="font-medium">{item.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Bottom Actions */}
                    <div className="p-4 border-t border-border">
                        <Link
                            href="/"
                            target="_blank"
                            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors mb-2"
                        >
                            <Home size={20} />
                            <span className="font-medium">View Site</span>
                        </Link>
                        <button
                            onClick={() => {
                                // TODO: Implement logout
                                window.location.href = '/api/auth/signout';
                            }}
                            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                        >
                            <LogOut size={20} />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="lg:hidden fixed inset-0 bg-black/50 z-30"
                />
            )}
        </>
    );
}
