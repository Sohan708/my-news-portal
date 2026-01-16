import Link from 'next/link';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import connectDB from '@/lib/db';
import { Post } from '@/models';

async function getPosts() {
    try {
        await connectDB();

        const posts = await Post.find()
            .populate('author', 'name')
            .populate('category', 'name')
            .sort('-createdAt')
            .limit(50)
            .lean();

        return JSON.parse(JSON.stringify(posts));
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
}

export default async function AdminPostsPage() {
    const posts = await getPosts();

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Posts</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your articles and content
                    </p>
                </div>
                <Link
                    href="/admin/posts/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    New Post
                </Link>
            </div>

            {/* Posts Table */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50 border-b border-border">
                            <tr>
                                <th className="text-left px-4 py-3 font-semibold text-sm">Title</th>
                                <th className="text-left px-4 py-3 font-semibold text-sm">Author</th>
                                <th className="text-left px-4 py-3 font-semibold text-sm">Category</th>
                                <th className="text-left px-4 py-3 font-semibold text-sm">Status</th>
                                <th className="text-left px-4 py-3 font-semibold text-sm">Views</th>
                                <th className="text-left px-4 py-3 font-semibold text-sm">Date</th>
                                <th className="text-right px-4 py-3 font-semibold text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.length > 0 ? (
                                posts.map((post: any) => (
                                    <tr key={post._id} className="border-b border-border hover:bg-muted/30 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {post.isFeatured && (
                                                    <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 text-xs font-semibold rounded">
                                                        Featured
                                                    </span>
                                                )}
                                                <span className="font-medium line-clamp-1">{post.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">
                                            {post.author?.name || 'Unknown'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded">
                                                {post.category?.name || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${post.status === 'published'
                                                        ? 'bg-green-500/10 text-green-500'
                                                        : 'bg-gray-500/10 text-gray-500'
                                                    }`}
                                            >
                                                {post.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Eye className="w-3 h-3" />
                                                {post.views || 0}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">
                                            {format(new Date(post.createdAt), 'MMM dd, yyyy')}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/news/${post.slug}`}
                                                    target="_blank"
                                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                                    title="View"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/posts/${post._id}/edit`}
                                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center gap-2">
                                            <p className="text-lg font-semibold">No posts yet</p>
                                            <p className="text-sm">Create your first post to get started</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
