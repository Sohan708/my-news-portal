import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Post } from '@/models';

// GET /api/v1/posts/[slug] - Get single post by slug
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();

        const { slug } = await params;

        const post = await Post.findOne({ slug, status: 'published' })
            .populate('author', 'name email image bio')
            .populate('category', 'name slug')
            .populate('tags', 'name slug')
            .lean();

        if (!post) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Post not found',
                },
                { status: 404 }
            );
        }

        // Increment views
        await Post.findByIdAndUpdate(post._id, { $inc: { views: 1 } });

        return NextResponse.json({
            success: true,
            data: post,
        });
    } catch (error: any) {
        console.error('GET /api/v1/posts/[slug] error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to fetch post',
            },
            { status: 500 }
        );
    }
}
