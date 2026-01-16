import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Post } from '@/models';

export async function POST(request: NextRequest) {
    try {
        // TODO: Add authentication check with NextAuth

        await connectDB();

        const body = await request.json();
        const {
            title,
            slug,
            excerpt,
            content,
            featuredImage,
            category,
            tags,
            status,
            isFeatured,
        } = body;

        // Validate required fields
        if (!title || !slug || !content) {
            return NextResponse.json(
                { error: 'Title, slug, and content are required' },
                { status: 400 }
            );
        }

        // Check if slug already exists
        const existingPost = await Post.findOne({ slug });
        if (existingPost) {
            return NextResponse.json(
                { error: 'Post with this slug already exists' },
                { status: 400 }
            );
        }

        // Create post
        const post = await Post.create({
            title,
            slug,
            excerpt,
            content,
            featuredImage,
            category: category || null,
            tags: tags || [],
            status: status || 'draft',
            isFeatured: isFeatured || false,
            author: '679cbe7e7c0d0b001f0a0e30', // TODO: Get from session
            publishedAt: status === 'published' ? new Date() : undefined,
        });

        return NextResponse.json({
            success: true,
            data: post,
        });
    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json(
            { error: 'Failed to create post' },
            { status: 500 }
        );
    }
}
