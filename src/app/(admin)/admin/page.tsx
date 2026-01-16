import Link from 'next/link';
import {
    FileText,
    FolderTree,
    Tags,
    TrendingUp,
    Eye,
    Plus,
    ChevronRight,
    Activity,
    Users,
    BarChart3,
    Clock,
    Search,
} from 'lucide-react';
import connectDB from '@/lib/db';
import { Post, Category, Tag } from '@/models';
import { format } from 'date-fns';

async function getStats() {
    try {
        await connectDB();

        const [totalPosts, publishedPosts, categories, tags, recentPosts, totalViews] = await Promise.all([
            Post.countDocuments(),
            Post.countDocuments({ status: 'published' }),
            Category.countDocuments(),
            Tag.countDocuments(),
            Post.find()
                .sort({ createdAt: -1 })
                .limit(6)
                .populate('author', 'name')
                .populate('category', 'name')
                .lean(),
            Post.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]),
        ]);

        return {
            totalPosts,
            publishedPosts,
            draftPosts: totalPosts - publishedPosts,
            categories,
            tags,
            totalViews: totalViews[0]?.total || 0,
            recentPosts: JSON.parse(JSON.stringify(recentPosts)),
        };
    } catch (error) {
        console.error('Error fetching stats:', error);
        return {
            totalPosts: 0,
            publishedPosts: 0,
            draftPosts: 0,
            categories: 0,
            tags: 0,
            totalViews: 0,
            recentPosts: [],
        };
    }
}

export default async function AdminDashboard() {
    const stats = await getStats();

    const statCards = [
        {
            title: 'Total Posts',
            value: stats.totalPosts,
            change: '+12%',
            trend: 'up',
            icon: FileText,
            gradient: 'from-blue-500 via-blue-600 to-cyan-600',
            iconColor: 'text-blue-500',
            bgPattern: 'bg-blue-50 dark:bg-blue-950/20',
        },
        {
            title: 'Published',
            value: stats.publishedPosts,
            change: '+8%',
            trend: 'up',
            icon: TrendingUp,
            gradient: 'from-green-500 via-green-600 to-emerald-600',
            iconColor: 'text-green-500',
            bgPattern: 'bg-green-50 dark:bg-green-950/20',
        },
        {
            title: 'Total Views',
            value: stats.totalViews.toLocaleString(),
            change: '+23%',
            trend: 'up',
            icon: Eye,
            gradient: 'from-purple-500 via-purple-600 to-pink-600',
            iconColor: 'text-purple-500',
            bgPattern: 'bg-purple-50 dark:bg-purple-950/20',
        },
        {
            title: 'Categories',
            value: stats.categories,
            change: '+2',
            trend: 'up',
            icon: FolderTree,
            gradient: 'from-orange-500 via-orange-600 to-red-600',
            iconColor: 'text-orange-500',
            bgPattern: 'bg-orange-50 dark:bg-orange-950/20',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Welcome Back!</h1>
                    <p className="text-slate-500 mt-1">Here's what's happening with your content today.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search content..."
                            className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 w-64 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-3 pl-4 md:border-l border-slate-200">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                            AD
                        </div>
                        <div className="hidden md:block">
                            <p className="text-sm font-semibold text-slate-700">Admin User</p>
                            <p className="text-xs text-slate-500">Editor in Chief</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.title}
                            className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl ${stat.bgPattern.replace('bg-', 'bg-').split(' ')[0]}`}> {/* Simplified bg access or custom mapping needed? Let's genericize. */}
                                    <Icon className={stat.iconColor} size={24} />
                                </div>
                                <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                    {stat.trend === 'up' ? <TrendingUp size={12} /> : null}
                                    {stat.change}
                                </div>
                            </div>
                            <h3 className="text-slate-500 text-sm font-medium mb-1">{stat.title}</h3>
                            <p className="text-3xl font-bold text-slate-800 tracking-tight">{stat.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Middle Section: Quick Actions & Main Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Recent Activity (2/3) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Quick Actions Strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { title: 'New Post', icon: Plus, href: '/admin/posts/new', color: 'text-blue-600', bg: 'bg-blue-50' },
                            { title: 'Manage Tags', icon: Tags, href: '/admin/tags', color: 'text-purple-600', bg: 'bg-purple-50' },
                            { title: 'Media', icon: Eye, href: '/admin/media', color: 'text-pink-600', bg: 'bg-pink-50' },
                            { title: 'Categories', icon: FolderTree, href: '/admin/categories', color: 'text-orange-600', bg: 'bg-orange-50' },
                        ].map((action) => {
                            const Icon = action.icon;
                            return (
                                <Link
                                    key={action.title}
                                    href={action.href}
                                    className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-center justify-center gap-3 text-center group"
                                >
                                    <div className={`p-3 rounded-full ${action.bg} ${action.color} group-hover:scale-110 transition-transform`}>
                                        <Icon size={20} />
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700">{action.title}</span>
                                </Link>
                            )
                        })}
                    </div>

                    {/* Recent Activity Table */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <Activity size={20} className="text-slate-400" />
                                Recent Activity
                            </h2>
                            <Link href="/admin/posts" className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
                                View all <ChevronRight size={14} />
                            </Link>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {stats.recentPosts.length > 0 ? (
                                stats.recentPosts.map((post: any) => (
                                    <div key={post._id} className="p-4 hover:bg-slate-50 transition-colors flex items-center gap-4 group">
                                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm">
                                            {post.category?.name?.[0] || 'U'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-slate-800 text-sm truncate group-hover:text-blue-600 transition-colors">
                                                {post.title}
                                            </h3>
                                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {format(new Date(post.createdAt), 'MMM d, yyyy')}
                                                </span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <Users size={12} />
                                                    {post.author?.name || 'Unknown'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {post.status}
                                        </div>
                                        <Link href={`/admin/posts/${post._id}/edit`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                            <FileText size={16} />
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-slate-500">
                                    No recent activity found.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Widgets (1/3) */}
                <div className="space-y-6">
                    {/* Drafts Summary */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <FileText size={18} className="text-slate-400" />
                            Content Status
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                                <span className="text-sm font-medium text-slate-600">Published Posts</span>
                                <span className="text-lg font-bold text-green-600">{stats.publishedPosts}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50">
                                <span className="text-sm font-medium text-slate-600">Drafts</span>
                                <span className="text-lg font-bold text-amber-600">{stats.draftPosts}</span>
                            </div>
                        </div>
                        <Link href="/admin/posts?status=draft" className="mt-4 block w-full py-2 text-center text-sm font-medium text-white bg-slate-800 rounded-xl hover:bg-slate-900 transition-colors">
                            Manage Drafts
                        </Link>
                    </div>

                    {/* System Status / Categories */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <BarChart3 size={18} className="text-slate-400" />
                            System Overview
                        </h3>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex-1 text-center p-3 rounded-xl border border-slate-100">
                                <p className="text-2xl font-bold text-slate-800">{stats.categories}</p>
                                <p className="text-xs text-slate-500 uppercase tracking-wide">Categories</p>
                            </div>
                            <div className="flex-1 text-center p-3 rounded-xl border border-slate-100">
                                <p className="text-2xl font-bold text-slate-800">{stats.tags}</p>
                                <p className="text-xs text-slate-500 uppercase tracking-wide">Tags</p>
                            </div>
                        </div>
                        <div className="text-xs text-slate-400 text-center">
                            Last updated: {format(new Date(), 'h:mm a')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
