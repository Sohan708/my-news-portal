import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Post } from '@/models';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('q') || '';
        const category = searchParams.get('category');
        const tag = searchParams.get('tag');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        // Build search query
        const searchQuery: any = { status: 'published' };

        // Text search
        if (query) {
            searchQuery.$or = [
                { title: { $regex: query, $options: 'i' } },
                { excerpt: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } },
            ];
        }

        // Filter by category
        if (category) {
            searchQuery.category = category;
        }

        // Filter by tag
        if (tag) {
            searchQuery.tags = tag;
        }

        const skip = (page - 1) * limit;

        // Execute search with pagination
        const [posts, total] = await Promise.all([
            Post.find(searchQuery)
                .populate('author', 'name image')
                .populate('category', 'name slug')
                .populate('tags', 'name slug')
                .sort('-publishedAt')
                .skip(skip)
                .limit(limit)
                .lean(),
            Post.countDocuments(searchQuery),
        ]);

        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            success: true,
            data: posts,
            meta: {
                query,
                category,
                tag,
                page,
                limit,
                total,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        });
    } catch (error) {
        console.error('Error searching posts:', error);
        return NextResponse.json(
            {
                success: false,
                error: {
                    message: 'Search failed',
                    code: 'SEARCH_ERROR',
                },
            },
            { status: 500 }
        );
    }
}
