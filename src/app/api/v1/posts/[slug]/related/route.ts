import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Post } from '@/models';

interface RouteParams {
    params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        await connectDB();

        const { slug } = await params;
        const searchParams = request.nextUrl.searchParams;
        const limit = parseInt(searchParams.get('limit') || '5');

        // First, find the current post to get its category
        const currentPost = await Post.findOne({ slug, status: 'published' })
            .select('_id category')
            .lean();

        if (!currentPost) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        message: 'Post not found',
                        code: 'POST_NOT_FOUND',
                    },
                },
                { status: 404 }
            );
        }

        // Find related posts in the same category
        const relatedPosts = await Post.find({
            status: 'published',
            category: currentPost.category,
            _id: { $ne: currentPost._id }, // Exclude current post
        })
            .populate('author', 'name image')
            .populate('category', 'name slug')
            .sort('-publishedAt')
            .limit(limit)
            .lean();

        return NextResponse.json({
            success: true,
            data: relatedPosts,
            meta: {
                total: relatedPosts.length,
            },
        });
    } catch (error) {
        console.error('Error fetching related posts:', error);
        return NextResponse.json(
            {
                success: false,
                error: {
                    message: 'Failed to fetch related posts',
                    code: 'FETCH_RELATED_ERROR',
                },
            },
            { status: 500 }
        );
    }
}
