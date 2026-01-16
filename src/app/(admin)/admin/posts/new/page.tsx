'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import TiptapEditor from '@/components/TiptapEditor';
import ImageUploader from '@/components/ImageUploader';

export default function NewPostPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        featuredImage: '',
        category: '',
        tags: [] as string[],
        status: 'draft',
        isFeatured: false,
    });

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleTitleChange = (title: string) => {
        setFormData({
            ...formData,
            title,
            slug: generateSlug(title),
        });
    };

    const handleSubmit = async (e: React.FormEvent, status: string) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/admin/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, status }),
            });

            if (response.ok) {
                router.push('/admin/posts');
            } else {
                alert('Failed to create post');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Error creating post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/posts"
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Create New Post</h1>
                        <p className="text-muted-foreground mt-1">
                            Write and publish your article
                        </p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <form className="space-y-6">
                {/* Title */}
                <div>
                    <label className="block text-sm font-semibold mb-2">
                        Title *
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="Enter post title"
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                </div>

                {/* Slug */}
                <div>
                    <label className="block text-sm font-semibold mb-2">
                        Slug *
                    </label>
                    <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="post-slug"
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                        Auto-generated from title. Edit if needed.
                    </p>
                </div>

                {/* Excerpt */}
                <div>
                    <label className="block text-sm font-semibold mb-2">
                        Excerpt
                    </label>
                    <textarea
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        placeholder="Brief summary of the post"
                        rows={3}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                </div>

                {/* Content */}
                <div>
                    <label className="block text-sm font-semibold mb-2">
                        Content *
                    </label>
                    <TiptapEditor
                        content={formData.content}
                        onChange={(content) => setFormData({ ...formData, content })}
                    />
                </div>

                {/* Featured Image */}
                <ImageUploader
                    value={formData.featuredImage}
                    onChange={(url) => setFormData({ ...formData, featuredImage: url })}
                />

                {/* Category & Featured */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Category ID
                        </label>
                        <input
                            type="text"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            placeholder="Category ObjectId"
                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div className="flex items-center">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isFeatured}
                                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-2 focus:ring-primary"
                            />
                            <span className="text-sm font-semibold">Featured Post</span>
                        </label>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
                    <Link
                        href="/admin/posts"
                        className="px-6 py-2.5 border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="button"
                        onClick={(e) => handleSubmit(e, 'draft')}
                        disabled={loading}
                        className="px-6 py-2.5 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
                    >
                        Save as Draft
                    </button>
                    <button
                        type="button"
                        onClick={(e) => handleSubmit(e, 'published')}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {loading ? 'Publishing...' : 'Publish'}
                    </button>
                </div>
            </form>
        </div>
    );
}
