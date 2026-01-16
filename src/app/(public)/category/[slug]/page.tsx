import { notFound } from 'next/navigation';
import Link from 'next/link';
import connectDB from '@/lib/db';
import { Category, Post } from '@/models';
import type { ICategory, IPost } from '@/models';
import ArticleCard from '@/components/ArticleCard';
import { Metadata } from 'next';

interface PageProps {
    params: { slug: string };
    searchParams: { page?: string };
}

async function getCategory(slug: string): Promise<ICategory | null> {
    try {
        await connectDB();
        const category = await Category.findOne({ slug, isActive: true }).lean();
        return category ? JSON.parse(JSON.stringify(category)) : null;
    } catch (error) {
        console.error('Error fetching category:', error);
        return null;
    }
}

async function getCategoryPosts(categoryId: any, page: number = 1, limit: number = 12): Promise<{
    posts: IPost[];
    total: number;
    pages: number;
}> {
    try {
        await connectDB();
        const skip = (page - 1) * limit;

        const [posts, total] = await Promise.all([
            Post.find({ category: categoryId, status: 'published' })
                .populate('author', 'name email image')
                .populate('category', 'name slug')
                .populate('tags', 'name slug')
                .sort({ publishedAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Post.countDocuments({ category: categoryId, status: 'published' }),
        ]);

        return {
            posts: JSON.parse(JSON.stringify(posts)),
            total,
            pages: Math.ceil(total / limit),
        };
    } catch (error) {
        console.error('Error fetching category posts:', error);
        return { posts: [], total: 0, pages: 0 };
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const category = await getCategory(params.slug);

    if (!category) {
        return {
            title: 'Category Not Found',
        };
    }

    return {
        title: `${category.name} - News & Articles`,
        description: category.description || `Latest ${category.name.toLowerCase()} news and articles`,
    };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
    const category = await getCategory(params.slug);

    if (!category) {
        notFound();
    }

    const currentPage = Number(searchParams.page) || 1;
    const { posts, total, pages } = await getCategoryPosts(category._id, currentPage);

    return (
        <div className="py-8">
            <div className="container">
                {/* Breadcrumbs */}
                <nav className="mb-6 text-sm">
                    <ol className="flex items-center space-x-2 text-muted-foreground">
                        <li>
                            <Link href="/" className="hover:text-foreground">
                                Home
                            </Link>
                        </li>
                        <li>/</li>
                        <li className="text-foreground font-medium">{category.name}</li>
                    </ol>
                </nav>

                {/* Category Header */}
                <header className="mb-8">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif mb-4">
                        {category.name}
                    </h1>
                    {category.description && (
                        <p className="text-lg text-muted-foreground">{category.description}</p>
                    )}
                </header>

                {/* Articles Grid */}
                {posts.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {posts.map((post) => (
                                <ArticleCard key={post._id.toString()} post={post} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pages > 1 && (
                            <nav className="flex justify-center items-center space-x-2">
                                {currentPage > 1 && (
                                    <Link
                                        href={`/category/${params.slug}?page=${currentPage - 1}`}
                                        className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg"
                                    >
                                        Previous
                                    </Link>
                                )}

                                <div className="flex items-center space-x-1">
                                    {Array.from({ length: pages }, (_, i) => i + 1).map((page) => (
                                        <Link
                                            key={page}
                                            href={`/category/${params.slug}?page=${page}`}
                                            className={`px-4 py-2 rounded-lg ${page === currentPage
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted hover:bg-muted/80'
                                                }`}
                                        >
                                            {page}
                                        </Link>
                                    ))}
                                </div>

                                {currentPage < pages && (
                                    <Link
                                        href={`/category/${params.slug}?page=${currentPage + 1}`}
                                        className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg"
                                    >
                                        Next
                                    </Link>
                                )}
                            </nav>
                        )}

                        {/* Results Info */}
                        <p className="text-center text-sm text-muted-foreground mt-4">
                            Showing {(currentPage - 1) * 12 + 1} - {Math.min(currentPage * 12, total)} of {total}{' '}
                            articles
                        </p>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground text-lg">No articles found in this category yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
