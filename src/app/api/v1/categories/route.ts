import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Category } from '@/models';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const searchParams = request.nextUrl.searchParams;
        const includeCount = searchParams.get('includeCount') === 'true';

        let categories;

        if (includeCount) {
            // Aggregate to include post count
            categories = await Category.aggregate([
                {
                    $lookup: {
                        from: 'posts',
                        localField: '_id',
                        foreignField: 'category',
                        as: 'posts',
                    },
                },
                {
                    $project: {
                        name: 1,
                        slug: 1,
                        description: 1,
                        parent: 1,
                        postCount: { $size: '$posts' },
                        createdAt: 1,
                        updatedAt: 1,
                    },
                },
                { $sort: { name: 1 } },
            ]);
        } else {
            // Simple query without count
            categories = await Category.find()
                .sort({ name: 1 })
                .lean();
        }

        return NextResponse.json({
            success: true,
            data: categories,
            meta: {
                total: categories.length,
            },
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            {
                success: false,
                error: {
                    message: 'Failed to fetch categories',
                    code: 'FETCH_CATEGORIES_ERROR',
                },
            },
            { status: 500 }
        );
    }
}
