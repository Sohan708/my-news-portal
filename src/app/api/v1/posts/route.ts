import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Post } from '@/models';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        // Get query parameters
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const category = searchParams.get('category');
        const featured = searchParams.get('featured');
        const sort = searchParams.get('sort') || '-publishedAt';

        // Build query
        const query: any = { status: 'published' };

        if (category) {
            query.category = category;
        }

        if (featured === 'true') {
            query.isFeatured = true;
        }

        // Calculate skip
        const skip = (page - 1) * limit;

        // Execute query with pagination
        const [posts, total] = await Promise.all([
            Post.find(query)
                .populate('author', 'name image')
                .populate('category', 'name slug')
                .populate('tags', 'name slug')
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),
            Post.countDocuments(query),
        ]);

        // Calculate pagination metadata
        const totalPages = Math.ceil(total / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        return NextResponse.json({
            success: true,
            data: posts,
            meta: {
                page,
                limit,
                total,
                totalPages,
                hasNextPage,
                hasPrevPage,
            },
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json(
            {
                success: false,
                error: {
                    message: 'Failed to fetch posts',
                    code: 'FETCH_POSTS_ERROR',
                },
            },
            { status: 500 }
        );
    }
}
