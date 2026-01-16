import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Tag } from '@/models';
import { nanoid } from 'nanoid';

// GET all tags
export async function GET() {
    try {
        await connectDB();

        const tags = await Tag.find()
            .sort({ name: 1 })
            .lean();

        return NextResponse.json({
            success: true,
            data: tags,
        });
    } catch (error: any) {
        console.error('Error fetching tags:', error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

// CREATE new tag
export async function POST(request: Request) {
    try {
        const body = await request.json();
        await connectDB();

        const { name, slug: providedSlug, description } = body;

        // Validate required fields
        if (!name) {
            return NextResponse.json(
                { success: false, message: 'Tag name is required' },
                { status: 400 }
            );
        }

        // Generate unique slug
        let slug = providedSlug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const existingTag = await Tag.findOne({ slug });
        if (existingTag) {
            slug = `${slug}-${nanoid(6)}`;
        }

        // Create tag
        const tag = await Tag.create({
            name,
            slug,
            description: description || '',
        });

        return NextResponse.json({
            success: true,
            data: tag,
        });
    } catch (error: any) {
        console.error('Error creating tag:', error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
