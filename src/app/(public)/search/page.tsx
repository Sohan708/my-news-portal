import Link from 'next/link';
import connectDB from '@/lib/db';
import { Post } from '@/models';
import type { IPost } from '@/models';
import ArticleCard from '@/components/ArticleCard';
import { Metadata } from 'next';

interface PageProps {
    searchParams: { q?: string; category?: string; page?: string };
}

async function searchPosts(
    query: string,
    categorySlug?: string,
    page: number = 1,
    limit: number = 12
): Promise<{
    posts: IPost[];
    total: number;
    pages: number;
}> {
    try {
        await connectDB();
        const skip = (page - 1) * limit;

        // Build search query
        const searchQuery: any = {
            status: 'published',
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { excerpt: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } },
            ],
        };

        // Add category filter if provided
        if (categorySlug) {
            const { Category } = await import('@/models');
            const category = await Category.findOne({ slug: categorySlug }).lean();
            if (category) {
                searchQuery.category = category._id;
            }
        }

        const [posts, total] = await Promise.all([
            Post.find(searchQuery)
                .populate('author', 'name email image')
                .populate('category', 'name slug')
                .populate('tags', 'name slug')
                .sort({ publishedAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Post.countDocuments(searchQuery),
        ]);

        return {
            posts: JSON.parse(JSON.stringify(posts)),
            total,
            pages: Math.ceil(total / limit),
        };
    } catch (error) {
        console.error('Error searching posts:', error);
        return { posts: [], total: 0, pages: 0 };
    }
}

export const metadata: Metadata = {
    title: 'Search Articles',
    description: 'Search for news articles and blog posts',
};

export default async function SearchPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const query = params.q || '';
    const categorySlug = params.category;
    const currentPage = Number(params.page) || 1;

    let results = { posts: [] as IPost[], total: 0, pages: 0 };

    if (query) {
        results = await searchPosts(query, categorySlug, currentPage);
    }

    return (
        <div className="py-8">
            <div className="container">
                {/* Search Header */}
                <header className="mb-8">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif mb-4">Search</h1>

                    {/* Search Form */}
                    <form method="GET" className="max-w-2xl">
                        <div className="flex gap-2">
                            <input
                                type="search"
                                name="q"
                                defaultValue={query}
                                placeholder="Search articles..."
                                className="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium"
                            >
                                Search
                            </button>
                        </div>
                    </form>
                </header>

                {/* Search Results */}
                {query ? (
                    <>
                        <div className="mb-6">
                            <p className="text-muted-foreground">
                                {results.total > 0 ? (
                                    <>
                                        Found <span className="font-bold text-foreground">{results.total}</span>{' '}
                                        {results.total === 1 ? 'result' : 'results'} for &quot;
                                        <span className="font-bold text-foreground">{query}</span>&quot;
                                    </>
                                ) : (
                                    <>
                                        No results found for &quot;
                                        <span className="font-bold text-foreground">{query}</span>&quot;
                                    </>
                                )}
                            </p>
                        </div>

                        {results.posts.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                    {results.posts.map((post) => (
                                        <ArticleCard key={post._id.toString()} post={post} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {results.pages > 1 && (
                                    <nav className="flex justify-center items-center space-x-2">
                                        {currentPage > 1 && (
                                            <Link
                                                href={`/search?q=${query}&page=${currentPage - 1}${categorySlug ? `&category=${categorySlug}` : ''
                                                    }`}
                                                className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg"
                                            >
                                                Previous
                                            </Link>
                                        )}

                                        <div className="flex items-center space-x-1">
                                            {Array.from({ length: results.pages }, (_, i) => i + 1).map((page) => (
                                                <Link
                                                    key={page}
                                                    href={`/search?q=${query}&page=${page}${categorySlug ? `&category=${categorySlug}` : ''
                                                        }`}
                                                    className={`px-4 py-2 rounded-lg ${page === currentPage
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-muted hover:bg-muted/80'
                                                        }`}
                                                >
                                                    {page}
                                                </Link>
                                            ))}
                                        </div>

                                        {currentPage < results.pages && (
                                            <Link
                                                href={`/search?q=${query}&page=${currentPage + 1}${categorySlug ? `&category=${categorySlug}` : ''
                                                    }`}
                                                className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg"
                                            >
                                                Next
                                            </Link>
                                        )}
                                    </nav>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12 bg-muted rounded-lg">
                                <p className="text-lg mb-4">No articles found matching your search.</p>
                                <p className="text-sm text-muted-foreground">
                                    Try using different keywords or browse our categories
                                </p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Enter a search term to find articles</p>
                    </div>
                )}
            </div>
        </div>
    );
}
