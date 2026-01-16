import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Post, Category } from '@/models';

// GET single post by ID
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        const post = await Post.findById(params.id)
            .populate('author', 'name email image')
            .populate('category', 'name slug')
            .populate('tags', 'name slug')
            .lean();

        if (!post) {
            return NextResponse.json(
                { success: false, message: 'Post not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: post,
        });
    } catch (error: any) {
        console.error('Error fetching post:', error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

// UPDATE post
export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        await connectDB();

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
            isBreaking,
            metaTitle,
            metaDescription,
        } = body;

        // Find category if provided
        let categoryId = null;
        if (category) {
            const cat = await Category.findOne({ slug: category });
            categoryId = cat?._id;
        }

        // Build update object
        const updateData: any = {
            title,
            slug,
            excerpt: excerpt || '',
            content,
            featuredImage: featuredImage || '',
            category: categoryId,
            tags: tags || [],
            status,
            isFeatured: isFeatured || false,
            isBreaking: isBreaking || false,
            'seo.metaTitle': metaTitle || title,
            'seo.metaDescription': metaDescription || excerpt || '',
        };

        // Update publishedAt if status changed to published
        const existingPost = await Post.findById(params.id);
        if (status === 'published' && existingPost?.status !== 'published') {
            updateData.publishedAt = new Date();
        }

        const post = await Post.findByIdAndUpdate(
            params.id,
            updateData,
            { new: true, runValidators: true }
        )
            .populate('author', 'name email image')
            .populate('category', 'name slug')
            .populate('tags', 'name slug');

        if (!post) {
            return NextResponse.json(
                { success: false, message: 'Post not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: post,
        });
    } catch (error: any) {
        console.error('Error updating post:', error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

// DELETE post
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        const post = await Post.findByIdAndDelete(params.id);

        if (!post) {
            return NextResponse.json(
                { success: false, message: 'Post not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Post deleted successfully',
        });
    } catch (error: any) {
        console.error('Error deleting post:', error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
