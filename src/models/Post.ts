import mongoose, { Schema, models } from 'mongoose';
import type { IUser } from './User';
import type { ICategory } from './Category';
import type { ITag } from './Tag';

export interface IPost extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImage?: string;
    author: mongoose.Types.ObjectId | IUser;
    category: mongoose.Types.ObjectId | ICategory;
    tags: (mongoose.Types.ObjectId | ITag)[];
    status: 'draft' | 'published' | 'archived';
    isFeatured: boolean;
    isBreaking: boolean;
    views: number;

    // SEO fields
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];

    publishedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: 200,
        },
        slug: {
            type: String,
            required: [true, 'Slug is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        excerpt: {
            type: String,
            required: [true, 'Excerpt is required'],
            maxlength: 500,
        },
        content: {
            type: String,
            required: [true, 'Content is required'],
        },
        featuredImage: {
            type: String,
            default: null,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Author is required'],
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Category is required'],
        },
        tags: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Tag',
            },
        ],
        status: {
            type: String,
            enum: ['draft', 'published', 'archived'],
            default: 'draft',
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        isBreaking: {
            type: Boolean,
            default: false,
        },
        views: {
            type: Number,
            default: 0,
        },

        // SEO fields
        metaTitle: {
            type: String,
            maxlength: 60,
        },
        metaDescription: {
            type: String,
            maxlength: 160,
        },
        metaKeywords: [String],

        publishedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for better query performance
PostSchema.index({ slug: 1 });
PostSchema.index({ status: 1 });
PostSchema.index({ category: 1 });
PostSchema.index({ author: 1 });
PostSchema.index({ isFeatured: 1 });
PostSchema.index({ isBreaking: 1 });
PostSchema.index({ publishedAt: -1 });
PostSchema.index({ createdAt: -1 });
PostSchema.index({ views: -1 });

// Text index for search
PostSchema.index({ title: 'text', content: 'text', excerpt: 'text' });

// Automatically set publishedAt when status changes to published
PostSchema.pre('save', function (next) {
    if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
        this.publishedAt = new Date();
    }
    next();
});

const Post = models.Post || mongoose.model<IPost>('Post', PostSchema);

export default Post;
