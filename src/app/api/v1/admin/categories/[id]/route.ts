import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Category } from '@/models';

// GET single category by ID
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        const category = await Category.findById(params.id)
            .populate('parent', 'name slug')
            .lean();

        if (!category) {
            return NextResponse.json(
                { success: false, message: 'Category not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: category,
        });
    } catch (error: any) {
        console.error('Error fetching category:', error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

// UPDATE category
export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        await connectDB();

        const { name, slug, description, parent, order, isActive } = body;

        const category = await Category.findByIdAndUpdate(
            params.id,
            {
                name,
                slug,
                description: description || '',
                parent: parent || null,
                order: order || 0,
                isActive: isActive ?? true,
            },
            { new: true, runValidators: true }
        ).populate('parent', 'name slug');

        if (!category) {
            return NextResponse.json(
                { success: false, message: 'Category not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: category,
        });
    } catch (error: any) {
        console.error('Error updating category:', error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

// DELETE category
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        // Check if category has posts
        const { Post } = await import('@/models');
        const postCount = await Post.countDocuments({ category: params.id });

        if (postCount > 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Cannot delete category with ${postCount} posts. Please reassign or delete the posts first.`,
                },
                { status: 400 }
            );
        }

        const category = await Category.findByIdAndDelete(params.id);

        if (!category) {
            return NextResponse.json(
                { success: false, message: 'Category not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Category deleted successfully',
        });
    } catch (error: any) {
        console.error('Error deleting category:', error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
