import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import connectDB from '@/lib/db';
import { Post } from '@/models';
import type { IPost } from '@/models';
import ArticleCard from '@/components/ArticleCard';
import { Metadata } from 'next';

interface PageProps {
    params: { slug: string };
}

async function getPost(slug: string): Promise<IPost | null> {
    try {
        await connectDB();
        const post = await Post.findOne({ slug, status: 'published' })
            .populate('author', 'name email image')
            .populate('category', 'name slug')
            .populate('tags', 'name slug')
            .lean();

        if (post) {
            // Increment view count
            await Post.updateOne({ _id: post._id }, { $inc: { views: 1 } });
        }

        return post ? JSON.parse(JSON.stringify(post)) : null;
    } catch (error) {
        console.error('Error fetching post:', error);
        return null;
    }
}

async function getRelatedPosts(categoryId: any, currentPostId: any): Promise<IPost[]> {
    try {
        await connectDB();
        const posts = await Post.find({
            category: categoryId,
            _id: { $ne: currentPostId },
            status: 'published',
        })
            .populate('author', 'name email image')
            .populate('category', 'name slug')
            .limit(3)
            .lean();

        return JSON.parse(JSON.stringify(posts));
    } catch (error) {
        console.error('Error fetching related posts:', error);
        return [];
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const post = await getPost(params.slug);

    if (!post) {
        return {
            title: 'Article Not Found',
        };
    }

    return {
        title: post.seo?.metaTitle || post.title,
        description: post.seo?.metaDescription || post.excerpt,
        openGraph: {
            title: post.seo?.metaTitle || post.title,
            description: post.seo?.metaDescription || post.excerpt,
            images: post.featuredImage ? [post.featuredImage] : [],
            type: 'article',
            publishedTime: post.publishedAt?.toString(),
            authors: [(post.author as any)?.name],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.seo?.metaTitle || post.title,
            description: post.seo?.metaDescription || post.excerpt,
            images: post.featuredImage ? [post.featuredImage] : [],
        },
    };
}

export default async function ArticlePage({ params }: PageProps) {
    const post = await getPost(params.slug);

    if (!post) {
        notFound();
    }

    const relatedPosts = await getRelatedPosts(post.category, post._id);
    const author = post.author as any;
    const category = post.category as any;
    const tags = post.tags as any[];

    return (
        <article className="py-8">
            <div className="container max-w-4xl">
                {/* Breadcrumbs */}
                <nav className="mb-6 text-sm">
                    <ol className="flex items-center space-x-2 text-muted-foreground">
                        <li>
                            <Link href="/" className="hover:text-foreground">
                                Home
                            </Link>
                        </li>
                        <li>/</li>
                        {category && (
                            <>
                                <li>
                                    <Link href={`/category/${category.slug}`} className="hover:text-foreground">
                                        {category.name}
                                    </Link>
                                </li>
                                <li>/</li>
                            </>
                        )}
                        <li className="text-foreground font-medium truncate">{post.title}</li>
                    </ol>
                </nav>

                {/* Article Header */}
                <header className="mb-8">
                    {category && (
                        <Link
                            href={`/category/${category.slug}`}
                            className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full mb-4 hover:bg-primary/90"
                        >
                            {category.name}
                        </Link>
                    )}

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif mb-4 leading-tight">
                        {post.title}
                    </h1>

                    {post.excerpt && (
                        <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>
                    )}

                    {/* Article Meta */}
                    <div className="flex items-center space-x-6 text-sm text-muted-foreground border-t border-b py-4">
                        {author && (
                            <div className="flex items-center space-x-2">
                                {author.image && (
                                    <Image
                                        src={author.image}
                                        alt={author.name}
                                        width={32}
                                        height={32}
                                        className="rounded-full"
                                    />
                                )}
                                <span className="font-medium text-foreground">{author.name}</span>
                            </div>
                        )}
                        {post.publishedAt && (
                            <time dateTime={post.publishedAt.toString()}>
                                {format(new Date(post.publishedAt), 'MMMM dd, yyyy')}
                            </time>
                        )}
                        <span>{post.views || 0} views</span>
                    </div>
                </header>

                {/* Featured Image */}
                {post.featuredImage && (
                    <div className="mb-8 rounded-lg overflow-hidden">
                        <Image
                            src={post.featuredImage}
                            alt={post.title}
                            width={1200}
                            height={600}
                            className="w-full h-auto"
                            priority
                        />
                    </div>
                )}

                {/* Article Content */}
                <div
                    className="prose prose-lg dark:prose-invert max-w-none mb-12"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Tags */}
                {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                        {tags.map((tag) => (
                            <Link
                                key={tag._id.toString()}
                                href={`/search?tag=${tag.slug}`}
                                className="px-3 py-1 bg-muted hover:bg-muted/80 text-sm rounded-full"
                            >
                                #{tag.name}
                            </Link>
                        ))}
                    </div>
                )}

                {/* Author Card */}
                {author && (
                    <div className="bg-muted rounded-lg p-6 mb-12">
                        <div className="flex items-start space-x-4">
                            {author.image && (
                                <Image
                                    src={author.image}
                                    alt={author.name}
                                    width={64}
                                    height={64}
                                    className="rounded-full"
                                />
                            )}
                            <div>
                                <h3 className="font-bold text-lg mb-1">About {author.name}</h3>
                                <p className="text-muted-foreground text-sm">
                                    Professional journalist and content creator.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Related Articles */}
                {relatedPosts.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold font-serif mb-6">Related Articles</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedPosts.map((relatedPost) => (
                                <ArticleCard key={relatedPost._id.toString()} post={relatedPost} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </article>
    );
}
