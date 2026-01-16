import Link from 'next/link';
import { FileText, FolderTree, Tags, TrendingUp } from 'lucide-react';
import connectDB from '@/lib/db';
import { Post, Category, Tag } from '@/models';

async function getStats() {
    try {
        await connectDB();

        const [totalPosts, publishedPosts, totalCategories, totalTags] = await Promise.all([
            Post.countDocuments(),
            Post.countDocuments({ status: 'published' }),
            Category.countDocuments(),
            Tag.countDocuments(),
        ]);

        return {
            totalPosts,
            publishedPosts,
            draftPosts: totalPosts - publishedPosts,
            totalCategories,
            totalTags,
        };
    } catch (error) {
        console.error('Error fetching stats:', error);
        return {
            totalPosts: 0,
            publishedPosts: 0,
            draftPosts: 0,
            totalCategories: 0,
            totalTags: 0,
        };
    }
}

async function getRecentPosts() {
    try {
        await connectDB();
        const posts = await Post.find()
            .populate('author', 'name')
            .select('title slug status publishedAt createdAt')
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        return JSON.parse(JSON.stringify(posts));
    } catch (error) {
        console.error('Error fetching recent posts:', error);
        return [];
    }
}

export default async function AdminDashboard() {
    const stats = await getStats();
    const recentPosts = await getRecentPosts();

    const statCards = [
        {
            title: 'Total Posts',
            value: stats.totalPosts,
            icon: FileText,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100 dark:bg-blue-900/20',
        },
        {
            title: 'Published',
            value: stats.publishedPosts,
            icon: TrendingUp,
            color: 'text-green-600',
            bgColor: 'bg-green-100 dark:bg-green-900/20',
        },
        {
            title: 'Categories',
            value: stats.totalCategories,
            icon: FolderTree,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100 dark:bg-purple-900/20',
        },
        {
            title: 'Tags',
            value: stats.totalTags,
            icon: Tags,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100 dark:bg-orange-900/20',
        },
    ];

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back! Here's an overview of your content.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.title} className="bg-card border border-border rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
                                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                    <Icon className={stat.color} size={20} />
                                </div>
                            </div>
                            <p className="text-3xl font-bold">{stat.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-card border border-border rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link
                            href="/admin/posts/new"
                            className="block px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 text-center font-medium transition-colors"
                        >
                            + Create New Post
                        </Link>
                        <Link
                            href="/admin/posts"
                            className="block px-4 py-3 bg-muted hover:bg-muted/80 rounded-lg text-center font-medium transition-colors"
                        >
                            Manage Posts
                        </Link>
                        <Link
                            href="/admin/categories"
                            className="block px-4 py-3 bg-muted hover:bg-muted/80 rounded-lg text-center font-medium transition-colors"
                        >
                            Manage Categories
                        </Link>
                    </div>
                </div>

                {/* Recent Posts */}
                <div className="bg-card border border-border rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Recent Posts</h2>
                    {recentPosts.length > 0 ? (
                        <div className="space-y-3">
                            {recentPosts.map((post: any) => (
                                <Link
                                    key={post._id}
                                    href={`/admin/posts/${post._id}/edit`}
                                    className="block p-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                                >
                                    <h3 className="font-medium truncate">{post.title}</h3>
                                    <div className="flex items-center justify-between mt-1">
                                        <span
                                            className={`text-xs px-2 py-1 rounded ${post.status === 'published'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                                                }`}
                                        >
                                            {post.status}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-sm">No posts yet. Create your first post!</p>
                    )}
                </div>
            </div>
        </div>
    );
}
