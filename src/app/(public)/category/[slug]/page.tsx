import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { Clock, ArrowLeft, Folder } from 'lucide-react';
import { notFound } from 'next/navigation';
import connectDB from '@/lib/db';
import { Category, Post } from '@/models';

interface PageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ page?: string }>;
}

async function getCategoryData(slug: string, page: number, limit: number) {
    try {
        await connectDB();

        const category = await Category.findOne({ slug }).lean();
        if (!category) return null;

        const skip = (page - 1) * limit;

        const [posts, total] = await Promise.all([
            Post.find({ category: category._id, status: 'published' })
                .populate('author', 'name image')
                .populate('category', 'name slug')
                .sort('-publishedAt')
                .skip(skip)
                .limit(limit)
                .lean(),
            Post.countDocuments({ category: category._id, status: 'published' }),
        ]);

        return {
            category: JSON.parse(JSON.stringify(category)),
            posts: JSON.parse(JSON.stringify(posts)),
            total,
            totalPages: Math.ceil(total / limit),
        };
    } catch (error) {
        console.error('Error fetching category data:', error);
        return null;
    }
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const data = await getCategoryData(slug, 1, 10);

    if (!data) {
        return { title: 'Category Not Found' };
    }

    return {
        title: `${data.category.name} - NewsPortal`,
        description: data.category.description || `Browse articles in ${data.category.name}`,
    };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
    const { slug } = await params;
    const { page: pageParam } = await searchParams;

    const page = parseInt(pageParam || '1');
    const limit = 12;

    const data = await getCategoryData(slug, page, limit);

    if (!data) {
        notFound();
    }

    return (
        <div className="min-h-screen">
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

            {/* Category Header */}
            <div className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-transparent border-y border-border py-12">
                <div className="container">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-primary rounded-xl">
                                <Folder className="w-6 h-6 text-primary-foreground" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold">
                                {data.category.name}
                            </h1>
                        </div>
                        {data.category.description && (
                            <p className="text-lg text-muted-foreground max-w-2xl">
                                {data.category.description}
                            </p>
                        )}
                        <p className="mt-2 text-sm text-muted-foreground">
                            {data.total} {data.total === 1 ? 'article' : 'articles'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Posts Grid */}
            <div className="container py-12">
                <div className="max-w-7xl mx-auto">
                    {data.posts.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                {data.posts.map((post: any) => (
                                    <article
                                        key={post._id}
                                        className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                                    >
                                        {post.featuredImage && (
                                            <Link href={`/news/${post.slug}`} className="block relative h-48 overflow-hidden">
                                                <Image
                                                    src={post.featuredImage}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </Link>
                                        )}
                                        <div className="p-5">
                                            <Link href={`/news/${post.slug}`}>
                                                <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                                    {post.title}
                                                </h3>
                                            </Link>
                                            {post.excerpt && (
                                                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                                    {post.excerpt}
                                                </p>
                                            )}
                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                {post.author && (
                                                    <span>By {post.author.name}</span>
                                                )}
                                                {post.publishedAt && (
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {format(new Date(post.publishedAt), 'MMM dd')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            {/* Pagination */}
                            {data.totalPages > 1 && (
                                <div className="flex justify-center gap-2">
                                    {page > 1 && (
                                        <Link
                                            href={`/category/${slug}?page=${page - 1}`}
                                            className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
                                        >
                                            Previous
                                        </Link>
                                    )}

                                    <div className="flex gap-2">
                                        {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((pageNum) => (
                                            <Link
                                                key={pageNum}
                                                href={`/category/${slug}?page=${pageNum}`}
                                                className={`px-4 py-2 rounded-lg border border-border transition-colors ${pageNum === page
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'hover:bg-muted'
                                                    }`}
                                            >
                                                {pageNum}
                                            </Link>
                                        ))}
                                    </div>

                                    {page < data.totalPages && (
                                        <Link
                                            href={`/category/${slug}?page=${page + 1}`}
                                            className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
                                        >
                                            Next
                                        </Link>
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-16">
                            <div className="inline-flex p-6 bg-muted rounded-full mb-4">
                                <Folder className="w-12 h-12 text-muted-foreground" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">No articles yet</h3>
                            <p className="text-muted-foreground mb-6">
                                There are no published articles in this category.
                            </p>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Home
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
