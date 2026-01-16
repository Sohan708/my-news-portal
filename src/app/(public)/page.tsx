import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Clock, TrendingUp, ArrowRight } from 'lucide-react';
import connectDB from '@/lib/db';
import { Post, Category } from '@/models';
import type { IPost, ICategory } from '@/models';

async function getHomePageData() {
    try {
        await connectDB();

        const [featuredPost, latestPosts, trendingPosts, categories] = await Promise.all([
            Post.findOne({ status: 'published', isFeatured: true })
                .populate('author', 'name image')
                .populate('category', 'name slug')
                .sort({ publishedAt: -1 })
                .lean(),
            Post.find({ status: 'published' })
                .populate('author', 'name image')
                .populate('category', 'name slug')
                .sort({ publishedAt: -1 })
                .limit(12)
                .lean(),
            Post.find({ status: 'published' })
                .sort({ views: -1 })
                .limit(5)
                .lean(),
            Category.find().sort({ name: 1 }).lean(),
        ]);

        return {
            featuredPost: featuredPost ? JSON.parse(JSON.stringify(featuredPost)) : null,
            latestPosts: JSON.parse(JSON.stringify(latestPosts)),
            trendingPosts: JSON.parse(JSON.stringify(trendingPosts)),
            categories: JSON.parse(JSON.stringify(categories)),
        };
    } catch (error) {
        console.error('Error fetching homepage data:', error);
        return {
            featuredPost: null,
            latestPosts: [],
            trendingPosts: [],
            categories: [],
        };
    }
}

export default async function HomePage() {
    const data = await getHomePageData();

    return (
        <div className="min-h-screen">
            {/* Hero Section - Featured Article */}
            {data.featuredPost && (
                <section className="relative h-[600px] bg-black">
                    <div className="absolute inset-0">
                        {data.featuredPost.featuredImage && (
                            <Image
                                src={data.featuredPost.featuredImage}
                                alt={data.featuredPost.title}
                                fill
                                className="object-cover opacity-60"
                                priority
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    </div>

                    <div className="relative h-full container flex items-end pb-16">
                        <div className="max-w-3xl pl-4 md:pl-0">
                            {data.featuredPost.category && (
                                <Link
                                    href={`/category/${(data.featuredPost.category as any).slug}`}
                                    className="inline-block px-4 py-1.5 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider rounded mb-4 hover:bg-primary/90 transition-colors"
                                >
                                    {(data.featuredPost.category as any).name}
                                </Link>
                            )}
                            <Link href={`/news/${data.featuredPost.slug}`} className="group">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 group-hover:text-primary transition-colors leading-tight">
                                    {data.featuredPost.title}
                                </h1>
                            </Link>
                            {data.featuredPost.excerpt && (
                                <p className="text-lg text-gray-200 mb-4 line-clamp-2">
                                    {data.featuredPost.excerpt}
                                </p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-gray-300">
                                {data.featuredPost.author && (
                                    <span>By {(data.featuredPost.author as any).name}</span>
                                )}
                                {data.featuredPost.publishedAt && (
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {format(new Date(data.featuredPost.publishedAt), 'MMM dd, yyyy')}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Main Content Grid */}
            <div className="container py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {/* Latest News - Main Column */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                                Latest News
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {data.latestPosts.map((post: any) => (
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
                                        {post.category && (
                                            <Link
                                                href={`/category/${post.category.slug}`}
                                                className="inline-block px-2.5 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded mb-3 hover:bg-primary/20 transition-colors"
                                            >
                                                {post.category.name}
                                            </Link>
                                        )}
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
                                            {post.publishedAt && (
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {format(new Date(post.publishedAt), 'MMM dd')}
                                                </span>
                                            )}
                                            <Link
                                                href={`/news/${post.slug}`}
                                                className="flex items-center gap-1 text-primary hover:gap-2 transition-all"
                                            >
                                                Read More
                                                <ArrowRight className="w-3 h-3" />
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar - Trending & Categories */}
                    <div className="space-y-8">
                        {/* Trending Posts */}
                        <div className="bg-card border border-border rounded-xl p-6">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                Trending Now
                            </h3>
                            <div className="space-y-4">
                                {data.trendingPosts.map((post: any, index: number) => (
                                    <Link
                                        key={post._id}
                                        href={`/news/${post.slug}`}
                                        className="flex gap-3 group"
                                    >
                                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                                            {index + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                                                {post.title}
                                            </h4>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {post.views || 0} views
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="bg-card border border-border rounded-xl p-6">
                            <h3 className="text-xl font-bold mb-4">Categories</h3>
                            <div className="space-y-2">
                                {data.categories.map((category: any) => (
                                    <Link
                                        key={category._id}
                                        href={`/category/${category.slug}`}
                                        className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted transition-colors group"
                                    >
                                        <span className="font-medium text-sm">{category.name}</span>
                                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}