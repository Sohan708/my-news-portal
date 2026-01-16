import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { Clock, User, Eye, ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import connectDB from '@/lib/db';
import { Post } from '@/models';

interface PageProps {
    params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
    try {
        await connectDB();
        const post = await Post.findOne({ slug, status: 'published' })
            .populate('author', 'name image')
            .populate('category', 'name slug')
            .populate('tags', 'name slug')
            .lean();

        if (!post) return null;

        // Increment view count
        await Post.updateOne({ slug }, { $inc: { views: 1 } });

        return JSON.parse(JSON.stringify(post));
    } catch (error) {
        console.error('Error fetching post:', error);
        return null;
    }
}

async function getRelatedPosts(categoryId: string, currentPostId: string) {
    try {
        const posts = await Post.find({
            category: categoryId,
            _id: { $ne: currentPostId },
            status: 'published',
        })
            .populate('category', 'name slug')
            .limit(3)
            .lean();

        return JSON.parse(JSON.stringify(posts));
    } catch (error) {
        console.error('Error fetching related posts:', error);
        return [];
    }
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    return {
        title: post.seo?.metaTitle || post.title,
        description: post.seo?.metaDescription || post.excerpt,
        openGraph: {
            title: post.seo?.metaTitle || post.title,
            description: post.seo?.metaDescription || post.excerpt,
            images: post.seo?.ogImage ? [post.seo.ogImage] : post.featuredImage ? [post.featuredImage] : [],
        },
    };
}

export default async function NewsArticlePage({ params }: PageProps) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    const relatedPosts = await getRelatedPosts((post.category as any)._id, post._id);

    return (
        <article className="min-h-screen">
            {/* Back Button */}
            <div className="container py-4">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>
            </div>

            {/* Featured Image */}
            {post.featuredImage && (
                <div className="relative h-[400px] md:h-[500px] bg-muted">
                    <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                </div>
            )}

            {/* Article Content */}
            <div className="container py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Category */}
                    {post.category && (
                        <Link
                            href={`/category/${(post.category as any).slug}`}
                            className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4 hover:bg-primary/20 transition-colors"
                        >
                            {(post.category as any).name}
                        </Link>
                    )}

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                        {post.title}
                    </h1>

                    {/* Excerpt */}
                    {post.excerpt && (
                        <p className="text-xl text-muted-foreground mb-6">
                            {post.excerpt}
                        </p>
                    )}

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 pb-6 mb-8 border-b border-border">
                        {post.author && (
                            <div className="flex items-center gap-2">
                                {(post.author as any).image && (
                                    <Image
                                        src={(post.author as any).image}
                                        alt={(post.author as any).name}
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                    />
                                )}
                                <div>
                                    <p className="text-sm font-medium">
                                        {(post.author as any).name}
                                    </p>
                                </div>
                            </div>
                        )}
                        {post.publishedAt && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                {format(new Date(post.publishedAt), 'MMMM dd, yyyy')}
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Eye className="w-4 h-4" />
                            {post.views} views
                        </div>
                    </div>

                    {/* Content */}
                    <div
                        className="prose prose-lg dark:prose-invert max-w-none mb-12"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pb-8 mb-8 border-b border-border">
                            {post.tags.map((tag: any) => (
                                <Link
                                    key={tag._id}
                                    href={`/tag/${tag.slug}`}
                                    className="px-3 py-1 bg-muted hover:bg-muted/70 text-sm rounded-full transition-colors"
                                >
                                    #{tag.name}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Related Posts */}
                    {relatedPosts.length > 0 && (
                        <div className="mt-12">
                            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {relatedPosts.map((relatedPost: any) => (
                                    <Link
                                        key={relatedPost._id}
                                        href={`/news/${relatedPost.slug}`}
                                        className="group"
                                    >
                                        {relatedPost.featuredImage && (
                                            <div className="relative h-48 mb-3 rounded-lg overflow-hidden">
                                                <Image
                                                    src={relatedPost.featuredImage}
                                                    alt={relatedPost.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                        )}
                                        <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                                            {relatedPost.title}
                                        </h3>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}
