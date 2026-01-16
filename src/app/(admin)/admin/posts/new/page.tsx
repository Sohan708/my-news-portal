'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Eye } from 'lucide-react';

export default function NewPostPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        featuredImage: '',
        category: '',
        tags: [],
        status: 'draft',
        isFeatured: false,
        isBreaking: false,
        metaTitle: '',
        metaDescription: '',
    });

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setFormData({
            ...formData,
            title,
            slug: generateSlug(title),
        });
    };

    const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'published') => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/v1/admin/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, status }),
            });

            if (response.ok) {
                router.push('/admin/posts');
                router.refresh();
            } else {
                alert('Failed to create post');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            alert('An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/admin/posts"
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">New Post</h1>
                        <p className="text-muted-foreground">Create a new article or blog post</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={(e) => handleSubmit(e, 'draft')}
                        disabled={isLoading}
                        className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors disabled:opacity-50"
                    >
                        Save Draft
                    </button>
                    <button
                        onClick={(e) => handleSubmit(e, 'published')}
                        disabled={isLoading}
                        className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
                    >
                        <Eye size={18} />
                        <span>Publish</span>
                    </button>
                </div>
            </div>

            {/* Form */}
            <form className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium mb-2">
                                Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={formData.title}
                                onChange={handleTitleChange}
                                required
                                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-lg"
                                placeholder="Enter post title..."
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
                                placeholder="post-url-slug"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                URL: /news/{formData.slug || 'post-slug'}
                            </p>
                        </div>

                        {/* Excerpt */}
                        <div>
                            <label htmlFor="excerpt" className="block text-sm font-medium mb-2">
                                Excerpt
                            </label>
                            <textarea
                                id="excerpt"
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Brief description of the post..."
                            />
                        </div>

                        {/* Content Editor */}
                        <div>
                            <label htmlFor="content" className="block text-sm font-medium mb-2">
                                Content *
                            </label>
                            <textarea
                                id="content"
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                required
                                rows={15}
                                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                                placeholder="Write your content here (HTML supported)..."
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Tip: You can use HTML tags for formatting
                            </p>
                        </div>

                        {/* SEO Section */}
                        <div className="bg-muted p-4 rounded-lg space-y-4">
                            <h3 className="font-bold">SEO Settings</h3>
                            <div>
                                <label htmlFor="metaTitle" className="block text-sm font-medium mb-2">
                                    Meta Title
                                </label>
                                <input
                                    type="text"
                                    id="metaTitle"
                                    value={formData.metaTitle}
                                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Leave empty to use post title"
                                />
                            </div>
                            <div>
                                <label htmlFor="metaDescription" className="block text-sm font-medium mb-2">
                                    Meta Description
                                </label>
                                <textarea
                                    id="metaDescription"
                                    value={formData.metaDescription}
                                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Leave empty to use excerpt"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Featured Image */}
                        <div className="bg-card border border-border rounded-lg p-4">
                            <h3 className="font-bold mb-3">Featured Image</h3>
                            <input
                                type="url"
                                value={formData.featuredImage}
                                onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Image URL"
                            />
                            {formData.featuredImage && (
                                <img
                                    src={formData.featuredImage}
                                    alt="Preview"
                                    className="mt-3 w-full rounded-lg"
                                />
                            )}
                        </div>

                        {/* Category */}
                        <div className="bg-card border border-border rounded-lg p-4">
                            <h3 className="font-bold mb-3">Category</h3>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="">Select Category</option>
                                {/* TODO: Populate from API */}
                                <option value="politics">Politics</option>
                                <option value="technology">Technology</option>
                                <option value="sports">Sports</option>
                                <option value="business">Business</option>
                            </select>
                        </div>

                        {/* Settings */}
                        <div className="bg-card border border-border rounded-lg p-4 space-y-3">
                            <h3 className="font-bold">Settings</h3>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isFeatured}
                                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                    className="rounded"
                                />
                                <span>Featured Post</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isBreaking}
                                    onChange={(e) => setFormData({ ...formData, isBreaking: e.target.checked })}
                                    className="rounded"
                                />
                                <span>Breaking News</span>
                            </label>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
