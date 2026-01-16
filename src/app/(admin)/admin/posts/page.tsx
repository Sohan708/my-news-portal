import Link from 'next/link';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import connectDB from '@/lib/db';
import { Post } from '@/models';
import { format } from 'date-fns';

async function getPosts() {
    try {
        await connectDB();
        const posts = await Post.find()
            .populate('author', 'name')
            .populate('category', 'name')
            .select('title slug status views publishedAt createdAt')
            .sort({ createdAt: -1 })
            .lean();

        return JSON.parse(JSON.stringify(posts));
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
}

export default async function PostsListPage() {
    const posts = await getPosts();

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Posts</h1>
                    <p className="text-muted-foreground">Manage all your articles and blog posts</p>
                </div>
                <Link
                    href="/admin/posts/new"
                    className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                    <Plus size={20} />
                    <span>New Post</span>
                </Link>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                    <input
                        type="search"
                        placeholder="Search posts..."
                        className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <select className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                </select>
                <select className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">All Categories</option>
                    {/* TODO: Populate from categories */}
                </select>
            </div>

            {/* Posts Table */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
                {posts.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="text-left px-6 py-3 text-sm font-medium">Title</th>
                                    <th className="text-left px-6 py-3 text-sm font-medium hidden md:table-cell">Category</th>
                                    <th className="text-left px-6 py-3 text-sm font-medium hidden lg:table-cell">Author</th>
                                    <th className="text-left px-6 py-3 text-sm font-medium">Status</th>
                                    <th className="text-left px-6 py-3 text-sm font-medium hidden md:table-cell">Views</th>
                                    <th className="text-left px-6 py-3 text-sm font-medium hidden lg:table-cell">Date</th>
                                    <th className="text-right px-6 py-3 text-sm font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {posts.map((post: any) => (
                                    <tr key={post._id} className="hover:bg-muted/50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium">{post.title}</p>
                                                <p className="text-sm text-muted-foreground truncate max-w-md">{post.slug}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <span className="text-sm">{post.category?.name || 'Uncategorized'}</span>
                                        </td>
                                        <td className="px-6 py-4 hidden lg:table-cell">
                                            <span className="text-sm">{post.author?.name || 'Unknown'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2 py-1 text-xs rounded-full ${post.status === 'published'
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                                                    }`}
                                            >
                                                {post.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <span className="text-sm">{post.views || 0}</span>
                                        </td>
                                        <td className="px-6 py-4 hidden lg:table-cell">
                                            <span className="text-sm text-muted-foreground">
                                                {format(new Date(post.createdAt), 'MMM dd, yyyy')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link
                                                    href={`/news/${post.slug}`}
                                                    target="_blank"
                                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                                    title="View"
                                                >
                                                    <Eye size={16} />
                                                </Link>
                                                <Link
                                                    href={`/admin/posts/${post._id}/edit`}
                                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </Link>
                                                <button
                                                    className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                                                    title="Delete"
                                                    onClick={() => {
                                                        if (confirm('Are you sure you want to delete this post?')) {
                                                            // TODO: Implement delete
                                                        }
                                                    }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">No posts yet</p>
                        <Link
                            href="/admin/posts/new"
                            className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                        >
                            <Plus size={20} />
                            <span>Create First Post</span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
