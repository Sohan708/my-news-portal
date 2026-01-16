'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

interface EditCategoryPageProps {
    params: { id: string };
}

export default function EditCategoryPage({ params }: EditCategoryPageProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        parent: '',
        order: 0,
        isActive: true,
    });

    useEffect(() => {
        fetchCategory();
    }, [params.id]);

    const fetchCategory = async () => {
        try {
            const response = await fetch(`/api/v1/admin/categories/${params.id}`);
            if (response.ok) {
                const data = await response.json();
                const category = data.data;

                setFormData({
                    name: category.name || '',
                    slug: category.slug || '',
                    description: category.description || '',
                    parent: category.parent?._id || '',
                    order: category.order || 0,
                    isActive: category.isActive ?? true,
                });
            }
        } catch (error) {
            console.error('Error fetching category:', error);
            alert('Failed to load category');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const response = await fetch(`/api/v1/admin/categories/${params.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                router.push('/admin/categories');
                router.refresh();
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to update category');
            }
        } catch (error) {
            console.error('Error updating category:', error);
            alert('An error occurred');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`/api/v1/admin/categories/${params.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                router.push('/admin/categories');
                router.refresh();
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to delete category');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('An error occurred');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading category...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/admin/categories"
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Edit Category</h1>
                        <p className="text-muted-foreground">Update category details</p>
                    </div>
                </div>
                <button
                    onClick={handleDelete}
                    className="flex items-center space-x-2 px-4 py-2 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-lg transition-colors"
                >
                    <Trash2 size={18} />
                    <span>Delete</span>
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-2xl">
                <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                            Category Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="e.g., Technology, Sports, Business"
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label htmlFor="slug" className="block text-sm font-medium mb-2">
                            Slug
                        </label>
                        <input
                            type="text"
                            id="slug"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="category-url-slug"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            URL: /category/{formData.slug || 'category-slug'}
                        </p>
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Brief description of this category..."
                        />
                    </div>

                    {/* Parent Category */}
                    <div>
                        <label htmlFor="parent" className="block text-sm font-medium mb-2">
                            Parent Category
                        </label>
                        <select
                            id="parent"
                            value={formData.parent}
                            onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">None (Top Level)</option>
                            {/* TODO: Populate from categories API */}
                        </select>
                    </div>

                    {/* Order */}
                    <div>
                        <label htmlFor="order" className="block text-sm font-medium mb-2">
                            Display Order
                        </label>
                        <input
                            type="number"
                            id="order"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    {/* Active Status */}
                    <div>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="rounded"
                            />
                            <span className="text-sm font-medium">Active (visible on website)</span>
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                        <Link
                            href="/admin/categories"
                            className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
                        >
                            {isSaving ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    <span>Update Category</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
