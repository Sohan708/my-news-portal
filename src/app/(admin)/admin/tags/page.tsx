import Link from 'next/link';
import { Plus, Edit, Trash2, Tag as TagIcon } from 'lucide-react';
import connectDB from '@/lib/db';
import { Tag } from '@/models';

async function getTags() {
    try {
        await connectDB();
        const tags = await Tag.find()
            .sort({ name: 1 })
            .lean();

        return JSON.parse(JSON.stringify(tags));
    } catch (error) {
        console.error('Error fetching tags:', error);
        return [];
    }
}

export default async function TagsPage() {
    const tags = await getTags();

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Tags</h1>
                    <p className="text-muted-foreground">Label and categorize your content with tags</p>
                </div>
                <Link
                    href="/admin/tags/new"
                    className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                    <Plus size={20} />
                    <span>New Tag</span>
                </Link>
            </div>

            {/* Tags Grid */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
                {tags.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="text-left px-6 py-3 text-sm font-medium">Name</th>
                                    <th className="text-left px-6 py-3 text-sm font-medium hidden md:table-cell">Slug</th>
                                    <th className="text-left px-6 py-3 text-sm font-medium hidden lg:table-cell">Description</th>
                                    <th className="text-right px-6 py-3 text-sm font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {tags.map((tag: any) => (
                                    <tr key={tag._id} className="hover:bg-muted/50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <TagIcon size={18} className="text-primary" />
                                                <span className="font-medium">{tag.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <code className="text-sm bg-muted px-2 py-1 rounded">
                                                {tag.slug}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4 hidden lg:table-cell">
                                            <span className="text-sm text-muted-foreground truncate max-w-md block">
                                                {tag.description || '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link
                                                    href={`/search?tag=${tag.slug}`}
                                                    target="_blank"
                                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                                    title="View posts with this tag"
                                                >
                                                    <TagIcon size={16} />
                                                </Link>
                                                <Link
                                                    href={`/admin/tags/${tag._id}/edit`}
                                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </Link>
                                                <button
                                                    className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                                                    title="Delete"
                                                    onClick={() => {
                                                        if (confirm('Are you sure you want to delete this tag?')) {
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
                        <TagIcon size={48} className="mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-4">No tags yet</p>
                        <Link
                            href="/admin/tags/new"
                            className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                        >
                            <Plus size={20} />
                            <span>Create First Tag</span>
                        </Link>
                    </div>
                )}
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-900 rounded-lg p-4">
                <h3 className="font-bold text-purple-900 dark:text-purple-400 mb-2">💡 Tips</h3>
                <ul className="text-sm text-purple-800 dark:text-purple-300 space-y-1">
                    <li>• Tags help users find related content across categories</li>
                    <li>• Use specific tags like "AI", "Machine Learning" instead of generic ones</li>
                    <li>• Keep tag names short and descriptive</li>
                    <li>• You can assign multiple tags to each post</li>
                </ul>
            </div>
        </div>
    );
}
