import ArticleCard from '@/components/ArticleCard';
import connectDB from '@/lib/db';
import { Post } from '@/models';
import type { IPost } from '@/models';

async function getFeaturedPost(): Promise<IPost | null> {
    try {
        await connectDB();
        const post = await Post.findOne({ status: 'published', isFeatured: true })
            .populate('author', 'name email image')
            .populate('category', 'name slug')
            .populate('tags', 'name slug')
            .sort({ publishedAt: -1 })
            .lean();

        return post ? (JSON.parse(JSON.stringify(post)) as IPost) : null;
    } catch (error) {
        console.error('Error fetching featured post:', error);
        return null;
    }
}

async function getBreakingNews(): Promise<IPost[]> {
    try {
        await connectDB();
        const posts = await Post.find({ status: 'published', isBreaking: true })
            .populate('author', 'name email image')
            .populate('category', 'name slug')
            .select('title slug')
            .sort({ publishedAt: -1 })
            .limit(5)
            .lean();

        return JSON.parse(JSON.stringify(posts));
    } catch (error) {
        console.error('Error fetching breaking news:', error);
        return [];
    }
}

async function getLatestPosts(limit: number = 6): Promise<IPost[]> {
    try {
        await connectDB();
        const posts = await Post.find({ status: 'published' })
            .populate('author', 'name email image')
            .populate('category', 'name slug')
            .populate('tags', 'name slug')
            .sort({ publishedAt: -1 })
            .limit(limit)
            .lean();

        return JSON.parse(JSON.stringify(posts));
    } catch (error) {
        console.error('Error fetching latest posts:', error);
        return [];
    }
}

async function getTrendingPosts(): Promise<IPost[]> {
    try {
        await connectDB();
        const posts = await Post.find({ status: 'published' })
            .populate('author', 'name email image')
            .populate('category', 'name slug')
            .sort({ views: -1 })
            .limit(5)
            .lean();

        return JSON.parse(JSON.stringify(posts));
    } catch (error) {
        console.error('Error fetching trending posts:', error);
        return [];
    }
}

export default async function HomePage() {
    const [featuredPost, breakingNews, latestPosts, trendingPosts] = await Promise.all([
        getFeaturedPost(),
        getBreakingNews(),
        getLatestPosts(),
        getTrendingPosts(),
    ]);

    return (
        <div className="py-8">
            <div className="container">
                {/* Breaking News Ticker */}
                {breakingNews.length > 0 && (
                    <div className="bg-destructive text-white py-3 px-6 rounded-lg mb-8 overflow-hidden">
                        <div className="flex items-center">
                            <span className="font-bold text-sm mr-4 flex-shrink-0">BREAKING NEWS</span>
                            <div className="flex-1 overflow-hidden">
                                <div className="animate-marquee whitespace-nowrap inline-block">
                                    {breakingNews.map((news, index) => (
                                        <span key={news._id.toString()} className="inline-block mx-8">
                                            <a href={`/news/${news.slug}`} className="hover:underline">
                                                {news.title}
                                            </a>
                                            {index < breakingNews.length - 1 && <span className="mx-4">•</span>}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Hero Section */}
                {featuredPost && (
                    <section className="mb-12">
                        <ArticleCard post={featuredPost} variant="featured" />
                    </section>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl md:text-3xl font-bold font-serif">Latest News</h2>
                        </div>

                        {latestPosts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {latestPosts.map((post) => (
                                    <ArticleCard key={post._id.toString()} post={post} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground text-lg">No articles available yet.</p>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Please check back later or contact the administrator.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:col-span-1">
                        {/* Trending Posts */}
                        <div className="bg-muted rounded-lg p-6 sticky top-20">
                            <h3 className="text-xl font-bold font-serif mb-6">Trending Now</h3>

                            {trendingPosts.length > 0 ? (
                                <div className="space-y-6">
                                    {trendingPosts.map((post, index) => (
                                        <div key={post._id.toString()} className="flex items-start space-x-4">
                                            <span className="text-3xl font-bold text-primary/20 flex-shrink-0">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <div className="flex-1">
                                                <ArticleCard post={post} variant="compact" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No trending posts yet.</p>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
