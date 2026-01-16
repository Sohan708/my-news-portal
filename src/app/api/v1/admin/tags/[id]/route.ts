import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Tag } from '@/models';

// GET single tag by ID
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        const tag = await Tag.findById(params.id).lean();

        if (!tag) {
            return NextResponse.json(
                { success: false, message: 'Tag not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: tag,
        });
    } catch (error: any) {
        console.error('Error fetching tag:', error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

// UPDATE tag
export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        await connectDB();

        const { name, slug, description } = body;

        const tag = await Tag.findByIdAndUpdate(
            params.id,
            {
                name,
                slug,
                description: description || '',
            },
            { new: true, runValidators: true }
        );

        if (!tag) {
            return NextResponse.json(
                { success: false, message: 'Tag not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: tag,
        });
    } catch (error: any) {
        console.error('Error updating tag:', error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

// DELETE tag
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        // Check if tag is used in posts
        const { Post } = await import('@/models');
        const postCount = await Post.countDocuments({ tags: params.id });

        if (postCount > 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Cannot delete tag used in ${postCount} posts. Please remove it from posts first.`,
                },
                { status: 400 }
            );
        }

        const tag = await Tag.findByIdAndDelete(params.id);

        if (!tag) {
            return NextResponse.json(
                { success: false, message: 'Tag not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Tag deleted successfully',
        });
    } catch (error: any) {
        console.error('Error deleting tag:', error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
