import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Category } from '@/models';

// GET /api/v1/categories - List all active categories
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const categories = await Category.find({ isActive: true })
            .populate('parent', 'name slug')
            .sort({ order: 1, name: 1 })
            .lean();

        // Organize into hierarchy
        const categoryMap = new Map();
        const rootCategories: any[] = [];

        // First pass: create map
        categories.forEach((cat: any) => {
            categoryMap.set(cat._id.toString(), { ...cat, children: [] });
        });

        // Second pass: build hierarchy
        categories.forEach((cat: any) => {
            const category = categoryMap.get(cat._id.toString());
            if (cat.parent) {
                const parentId = typeof cat.parent === 'object' ? cat.parent._id.toString() : cat.parent.toString();
                const parent = categoryMap.get(parentId);
                if (parent) {
                    parent.children.push(category);
                } else {
                    rootCategories.push(category);
                }
            } else {
                rootCategories.push(category);
            }
        });

        return NextResponse.json({
            success: true,
            data: rootCategories,
        });
    } catch (error: any) {
        console.error('GET /api/v1/categories error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to fetch categories',
            },
            { status: 500 }
        );
    }
}
