import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Post, Category } from '@/models';
import { nanoid } from 'nanoid';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        await connectDB();

        const {
            title,
            slug: providedSlug,
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

        // Validate required fields
        if (!title || !content) {
            return NextResponse.json(
                { success: false, message: 'Title and content are required' },
                { status: 400 }
            );
        }

        // Generate unique slug
        let slug = providedSlug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const existingPost = await Post.findOne({ slug });
        if (existingPost) {
            slug = `${slug}-${nanoid(6)}`;
        }

        // Find category if provided
        let categoryId = null;
        if (category) {
            const cat = await Category.findOne({ slug: category });
            categoryId = cat?._id;
        }

        // Create post
        const post = await Post.create({
            title,
            slug,
            excerpt: excerpt || '',
            content,
            featuredImage: featuredImage || '',
            category: categoryId,
            tags: tags || [],
            status: status || 'draft',
            isFeatured: isFeatured || false,
            isBreaking: isBreaking || false,
            author: '67886a1ef32b8e5e2d4bc8cc', // TODO: Get from session
            publishedAt: status === 'published' ? new Date() : null,
            seo: {
                metaTitle: metaTitle || title,
                metaDescription: metaDescription || excerpt || '',
            },
        });

        return NextResponse.json({
            success: true,
            data: post,
        });
    } catch (error: any) {
        console.error('Error creating post:', error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const status = searchParams.get('status');
        const category = searchParams.get('category');

        const query: any = {};
        if (status) query.status = status;
        if (category) {
            const cat = await Category.findOne({ slug: category });
            if (cat) query.category = cat._id;
        }

        const skip = (page - 1) * limit;

        const [posts, total] = await Promise.all([
            Post.find(query)
                .populate('author', 'name email')
                .populate('category', 'name slug')
                .populate('tags', 'name slug')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Post.countDocuments(query),
        ]);

        return NextResponse.json({
            success: true,
            data: posts,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error: any) {
        console.error('Error fetching posts:', error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
