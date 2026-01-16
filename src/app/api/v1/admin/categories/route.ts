import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Category } from '@/models';
import { nanoid } from 'nanoid';

// GET all categories
export async function GET() {
    try {
        await connectDB();

        const categories = await Category.find()
            .populate('parent', 'name slug')
            .sort({ order: 1, name: 1 })
            .lean();

        return NextResponse.json({
            success: true,
            data: categories,
        });
    } catch (error: any) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

// CREATE new category
export async function POST(request: Request) {
    try {
        const body = await request.json();
        await connectDB();

        const { name, slug: providedSlug, description, parent, order, isActive } = body;

        // Validate required fields
        if (!name) {
            return NextResponse.json(
                { success: false, message: 'Category name is required' },
                { status: 400 }
            );
        }

        // Generate unique slug
        let slug = providedSlug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const existingCategory = await Category.findOne({ slug });
        if (existingCategory) {
            slug = `${slug}-${nanoid(6)}`;
        }

        // Create category
        const category = await Category.create({
            name,
            slug,
            description: description || '',
            parent: parent || null,
            order: order || 0,
            isActive: isActive ?? true,
        });

        return NextResponse.json({
            success: true,
            data: category,
        });
    } catch (error: any) {
        console.error('Error creating category:', error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
