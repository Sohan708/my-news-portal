import Link from 'next/link';
import Image from 'next/image';
import { Clock, Eye } from 'lucide-react';
import { formatDate, getRelativeTime, calculateReadingTime } from '@/lib/utils';
import type { IPost } from '@/models';

interface ArticleCardProps {
    post: IPost;
    variant?: 'default' | 'featured' | 'compact';
}

export default function ArticleCard({ post, variant = 'default' }: ArticleCardProps) {
    const readingTime = calculateReadingTime(post.content);

    if (variant === 'featured') {
        return (
            <Link href={`/news/${post.slug}`} className="group block">
                <article className="relative h-[500px] md:h-[600px] rounded-lg overflow-hidden">
                    {/* Image */}
                    {post.featuredImage && (
                        <Image
                            src={post.featuredImage}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 1200px"
                            priority
                        />
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                        {/* Category Badge */}
                        {typeof post.category === 'object' && post.category.name && (
                            <span className="inline-block px-3 py-1 bg-primary text-white text-sm font-semibold rounded-full mb-4">
                                {post.category.name}
                            </span>
                        )}

                        {/* Title */}
                        <h2 className="text-3xl md:text-5xl font-bold font-serif mb-4 line-clamp-3 group-hover:text-primary transition-colors">
                            {post.title}
                        </h2>

                        {/* Excerpt */}
                        <p className="text-gray-200 text-lg mb-4 line-clamp-2">{post.excerpt}</p>

                        {/* Meta */}
                        <div className="flex items-center space-x-4 text-sm text-gray-300">
                            <span>{getRelativeTime(post.publishedAt || post.createdAt)}</span>
                            <span className="flex items-center">
                                <Clock size={14} className="mr-1" />
                                {readingTime} min read
                            </span>
                            <span className="flex items-center">
                                <Eye size={14} className="mr-1" />
                                {post.views.toLocaleString()} views
                            </span>
                        </div>
                    </div>
                </article>
            </Link>
        );
    }

    if (variant === 'compact') {
        return (
            <Link href={`/news/${post.slug}`} className="group block">
                <article className="flex space-x-4">
                    {/* Thumbnail */}
                    {post.featuredImage && (
                        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                            <Image
                                src={post.featuredImage}
                                alt={post.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                sizes="96px"
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm md:text-base line-clamp-2 group-hover:text-primary transition-colors mb-2">
                            {post.title}
                        </h3>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <span>{getRelativeTime(post.publishedAt || post.createdAt)}</span>
                            <span>•</span>
                            <span>{post.views.toLocaleString()} views</span>
                        </div>
                    </div>
                </article>
            </Link>
        );
    }

    // Default variant
    return (
        <Link href={`/news/${post.slug}`} className="group block">
            <article className="h-full flex flex-col rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow duration-300">
                {/* Image */}
                {post.featuredImage && (
                    <div className="relative h-48 md:h-56 overflow-hidden">
                        <Image
                            src={post.featuredImage}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />

                        {/* Breaking Badge */}
                        {post.isBreaking && (
                            <div className="absolute top-4 left-4 px-3 py-1 bg-destructive text-white text-xs font-bold rounded-full animate-pulse">
                                BREAKING
                            </div>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 p-5 flex flex-col">
                    {/* Category */}
                    {typeof post.category === 'object' && post.category.name && (
                        <span className="inline-block w-fit px-2 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded mb-3">
                            {post.category.name}
                        </span>
                    )}

                    {/* Title */}
                    <h3 className="text-xl font-bold font-serif mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">
                        {post.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border">
                        <div className="flex items-center space-x-3">
                            <span>{getRelativeTime(post.publishedAt || post.createdAt)}</span>
                            <span className="flex items-center">
                                <Clock size={12} className="mr-1" />
                                {readingTime} min
                            </span>
                        </div>
                        <span className="flex items-center">
                            <Eye size={12} className="mr-1" />
                            {post.views.toLocaleString()}
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
}
