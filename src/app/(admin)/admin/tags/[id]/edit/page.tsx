'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

interface EditTagPageProps {
    params: { id: string };
}

export default function EditTagPage({ params }: EditTagPageProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
    });

    useEffect(() => {
        fetchTag();
    }, [params.id]);

    const fetchTag = async () => {
        try {
            const response = await fetch(`/api/v1/admin/tags/${params.id}`);
            if (response.ok) {
                const data = await response.json();
                const tag = data.data;

                setFormData({
                    name: tag.name || '',
                    slug: tag.slug || '',
                    description: tag.description || '',
                });
            }
        } catch (error) {
            console.error('Error fetching tag:', error);
            alert('Failed to load tag');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const response = await fetch(`/api/v1/admin/tags/${params.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                router.push('/admin/tags');
                router.refresh();
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to update tag');
            }
        } catch (error) {
            console.error('Error updating tag:', error);
            alert('An error occurred');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this tag? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`/api/v1/admin/tags/${params.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                router.push('/admin/tags');
                router.refresh();
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to delete tag');
            }
        } catch (error) {
            console.error('Error deleting tag:', error);
            alert('An error occurred');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading tag...</p>
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
                        href="/admin/tags"
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Edit Tag</h1>
                        <p className="text-muted-foreground">Update tag details</p>
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
                            Tag Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="e.g., Breaking News, AI, Climate Change"
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
                            placeholder="tag-url-slug"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            URL: /search?tag={formData.slug || 'tag-slug'}
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
                            placeholder="Brief description of this tag..."
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                        <Link
                            href="/admin/tags"
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
                                    <span>Update Tag</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
