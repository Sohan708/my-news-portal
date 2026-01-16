import Link from 'next/link';
import { Plus, Edit, Trash2, FolderTree } from 'lucide-react';
import connectDB from '@/lib/db';
import { Category } from '@/models';

async function getCategories() {
    try {
        await connectDB();
        const categories = await Category.find()
            .populate('parent', 'name')
            .sort({ order: 1, name: 1 })
            .lean();

        return JSON.parse(JSON.stringify(categories));
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

export default async function CategoriesPage() {
    const categories = await getCategories();

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Categories</h1>
                    <p className="text-muted-foreground">Organize your content with categories</p>
                </div>
                <Link
                    href="/admin/categories/new"
                    className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                    <Plus size={20} />
                    <span>New Category</span>
                </Link>
            </div>

            {/* Categories Grid */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
                {categories.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="text-left px-6 py-3 text-sm font-medium">Name</th>
                                    <th className="text-left px-6 py-3 text-sm font-medium hidden md:table-cell">Slug</th>
                                    <th className="text-left px-6 py-3 text-sm font-medium hidden lg:table-cell">Parent</th>
                                    <th className="text-left px-6 py-3 text-sm font-medium hidden md:table-cell">Order</th>
                                    <th className="text-left px-6 py-3 text-sm font-medium">Status</th>
                                    <th className="text-right px-6 py-3 text-sm font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {categories.map((category: any) => (
                                    <tr key={category._id} className="hover:bg-muted/50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <FolderTree size={18} className="text-primary" />
                                                <div>
                                                    <p className="font-medium">{category.name}</p>
                                                    {category.description && (
                                                        <p className="text-sm text-muted-foreground truncate max-w-md">
                                                            {category.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <code className="text-sm bg-muted px-2 py-1 rounded">
                                                {category.slug}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4 hidden lg:table-cell">
                                            <span className="text-sm">
                                                {category.parent?.name || '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <span className="text-sm">{category.order || 0}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2 py-1 text-xs rounded-full ${category.isActive
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                                        : 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
                                                    }`}
                                            >
                                                {category.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link
                                                    href={`/category/${category.slug}`}
                                                    target="_blank"
                                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                                    title="View"
                                                >
                                                    <FolderTree size={16} />
                                                </Link>
                                                <Link
                                                    href={`/admin/categories/${category._id}/edit`}
                                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </Link>
                                                <button
                                                    className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                                                    title="Delete"
                                                    onClick={() => {
                                                        if (confirm('Are you sure you want to delete this category?')) {
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
                        <FolderTree size={48} className="mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-4">No categories yet</p>
                        <Link
                            href="/admin/categories/new"
                            className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                        >
                            <Plus size={20} />
                            <span>Create First Category</span>
                        </Link>
                    </div>
                )}
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                <h3 className="font-bold text-blue-900 dark:text-blue-400 mb-2">💡 Tips</h3>
                <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                    <li>• Categories help organize your content and improve navigation</li>
                    <li>• Use parent categories to create hierarchical structures</li>
                    <li>• Order determines the display sequence in menus</li>
                    <li>• Inactive categories won't appear on the public site</li>
                </ul>
            </div>
        </div>
    );
}
