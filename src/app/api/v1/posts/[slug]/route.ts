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

        // Find post and increment view count
        const post = await Post.findOneAndUpdate(
            { slug, status: 'published' },
            { $inc: { views: 1 } },
            { new: true }
        )
            .populate('author', 'name image email')
            .populate('category', 'name slug description')
            .populate('tags', 'name slug')
            .lean();

        if (!post) {
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

        return NextResponse.json({
            success: true,
            data: post,
        });
    } catch (error) {
        console.error('Error fetching post:', error);
        return NextResponse.json(
            {
                success: false,
                error: {
                    message: 'Failed to fetch post',
                    code: 'FETCH_POST_ERROR',
                },
            },
            { status: 500 }
        );
    }
}
