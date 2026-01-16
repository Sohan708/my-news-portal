import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Post } from '@/models';

// GET /api/v1/posts - List all posts with pagination and filters
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);

        // Pagination
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        // Filters
        const status = searchParams.get('status');
        const category = searchParams.get('category');
        const isFeatured = searchParams.get('isFeatured');
        const isBreaking = searchParams.get('isBreaking');
        const search = searchParams.get('search');

        // Build query
        const query: any = {};

        if (status) {
            query.status = status;
        } else {
            // Default to published for public API
            query.status = 'published';
        }

        if (category) {
            query.category = category;
        }

        if (isFeatured !== null && isFeatured !== undefined) {
            query.isFeatured = isFeatured === 'true';
        }

        if (isBreaking !== null && isBreaking !== undefined) {
            query.isBreaking = isBreaking === 'true';
        }

        if (search) {
            query.$text = { $search: search };
        }

        // Execute query
        const posts = await Post.find(query)
            .populate('author', 'name email image')
            .populate('category', 'name slug')
            .populate('tags', 'name slug')
            .sort({ publishedAt: -1 })
            .limit(limit)
            .skip(skip)
            .lean();

        // Get total count
        const total = await Post.countDocuments(query);

        return NextResponse.json({
            success: true,
            data: posts,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error: any) {
        console.error('GET /api/v1/posts error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to fetch posts',
            },
            { status: 500 }
        );
    }
}
