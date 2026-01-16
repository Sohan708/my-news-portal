'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import TiptapEditor from '@/components/admin/TiptapEditor';
import ImageUpload from '@/components/admin/ImageUpload';

interface EditPostPageProps {
    params: { id: string };
}

export default function EditPostPage({ params }: EditPostPageProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
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

    useEffect(() => {
        fetchPost();
    }, [params.id]);

    const fetchPost = async () => {
        try {
            const response = await fetch(`/api/v1/admin/posts/${params.id}`);
            if (response.ok) {
                const data = await response.json();
                const post = data.data;

                setFormData({
                    title: post.title || '',
                    slug: post.slug || '',
                    excerpt: post.excerpt || '',
                    content: post.content || '',
                    featuredImage: post.featuredImage || '',
                    category: post.category?.slug || '',
                    tags: post.tags || [],
                    status: post.status || 'draft',
                    isFeatured: post.isFeatured || false,
                    isBreaking: post.isBreaking || false,
                    metaTitle: post.seo?.metaTitle || '',
                    metaDescription: post.seo?.metaDescription || '',
                });
            }
        } catch (error) {
            console.error('Error fetching post:', error);
            alert('Failed to load post');
        } finally {
            setIsLoading(false);
        }
    };

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
        });
    };

    const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'published') => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const response = await fetch(`/api/v1/admin/posts/${params.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, status }),
            });

            if (response.ok) {
                router.push('/admin/posts');
                router.refresh();
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to update post');
            }
        } catch (error) {
            console.error('Error updating post:', error);
            alert('An error occurred');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`/api/v1/admin/posts/${params.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                router.push('/admin/posts');
                router.refresh();
            } else {
                alert('Failed to delete post');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('An error occurred');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading post...</p>
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
                        href="/admin/posts"
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Edit Post</h1>
                        <p className="text-muted-foreground">Update your article or blog post</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleDelete}
                        className="flex items-center space-x-2 px-4 py-2 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-lg transition-colors"
                    >
                        <Trash2 size={18} />
                        <span>Delete</span>
                    </button>
                    <button
                        onClick={(e) => handleSubmit(e, 'draft')}
                        disabled={isSaving}
                        className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors disabled:opacity-50"
                    >
                        Save Draft
                    </button>
                    <button
                        onClick={(e) => handleSubmit(e, 'published')}
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
                                <span>Update</span>
                            </>
                        )}
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
                            <label className="block text-sm font-medium mb-2">
                                Content *
                            </label>
                            <TiptapEditor
                                content={formData.content}
                                onChange={(html) => setFormData({ ...formData, content: html })}
                                placeholder="Write your article content..."
                            />
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
                        {/* Status */}
                        <div className="bg-card border border-border rounded-lg p-4">
                            <h3 className="font-bold mb-3">Status</h3>
                            <div className="text-sm">
                                <span
                                    className={`inline-block px-3 py-1 rounded-full ${formData.status === 'published'
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                                        }`}
                                >
                                    {formData.status}
                                </span>
                            </div>
                        </div>

                        {/* Featured Image */}
                        <div className="bg-card border border-border rounded-lg p-4">
                            <ImageUpload
                                value={formData.featuredImage}
                                onChange={(url) => setFormData({ ...formData, featuredImage: url })}
                                label="Featured Image"
                                aspectRatio="16/9"
                            />
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
                                <option value="politics">Politics</option>
                                <option value="technology">Technology</option>
                                <option value="sports">Sports</option>
                                <option value="business">Business</option>
                                <option value="entertainment">Entertainment</option>
                                <option value="health">Health</option>
                                <option value="science">Science</option>
                                <option value="world">World</option>
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
