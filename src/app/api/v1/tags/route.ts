import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Tag } from '@/models';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const searchParams = request.nextUrl.searchParams;
        const includeCount = searchParams.get('includeCount') === 'true';

        let tags;

        if (includeCount) {
            // Aggregate to include post count
            tags = await Tag.aggregate([
                {
                    $lookup: {
                        from: 'posts',
                        localField: '_id',
                        foreignField: 'tags',
                        as: 'posts',
                    },
                },
                {
                    $project: {
                        name: 1,
                        slug: 1,
                        postCount: { $size: '$posts' },
                        createdAt: 1,
                        updatedAt: 1,
                    },
                },
                { $sort: { name: 1 } },
            ]);
        } else {
            // Simple query without count
            tags = await Tag.find()
                .sort({ name: 1 })
                .lean();
        }

        return NextResponse.json({
            success: true,
            data: tags,
            meta: {
                total: tags.length,
            },
        });
    } catch (error) {
        console.error('Error fetching tags:', error);
        return NextResponse.json(
            {
                success: false,
                error: {
                    message: 'Failed to fetch tags',
                    code: 'FETCH_TAGS_ERROR',
                },
            },
            { status: 500 }
        );
    }
}
