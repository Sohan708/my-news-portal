import mongoose, { Schema, Document, Model } from 'mongoose';

// User Interface
export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password?: string;
    image?: string;
    role: 'admin' | 'editor' | 'author';
    createdAt: Date;
    updatedAt: Date;
}

// Category Interface
export interface ICategory extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    slug: string;
    description?: string;
    parent?: ICategory['_id'];
    createdAt: Date;
    updatedAt: Date;
}

// Tag Interface
export interface ITag extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
}

// Post Interface
export interface IPost extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    featuredImage?: string;
    category: ICategory['_id'] | ICategory;
    tags: ITag['_id'][] | ITag[];
    author: IUser['_id'] | IUser;
    status: 'draft' | 'published';
    isFeatured?: boolean;
    views: number;
    publishedAt?: Date;
    seo?: {
        metaTitle?: string;
        metaDescription?: string;
        ogImage?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

// User Schema
const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, select: false },
        image: { type: String },
        role: { type: String, enum: ['admin', 'editor', 'author'], default: 'author' },
    },
    { timestamps: true }
);

// Category Schema
const CategorySchema = new Schema<ICategory>(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String },
        parent: { type: Schema.Types.ObjectId, ref: 'Category' },
    },
    { timestamps: true }
);

// Tag Schema
const TagSchema = new Schema<ITag>(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
    },
    { timestamps: true }
);

// Post Schema
const PostSchema = new Schema<IPost>(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        excerpt: { type: String },
        content: { type: String, required: true },
        featuredImage: { type: String },
        category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
        tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        status: { type: String, enum: ['draft', 'published'], default: 'draft' },
        isFeatured: { type: Boolean, default: false },
        views: { type: Number, default: 0 },
        publishedAt: { type: Date },
        seo: {
            metaTitle: { type: String },
            metaDescription: { type: String },
            ogImage: { type: String },
        },
    },
    { timestamps: true }
);

// Indexes
UserSchema.index({ email: 1 });
CategorySchema.index({ slug: 1 });
TagSchema.index({ slug: 1 });
PostSchema.index({ slug: 1 });
PostSchema.index({ status: 1, publishedAt: -1 });
PostSchema.index({ category: 1, status: 1 });

// Models
export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
export const Tag: Model<ITag> = mongoose.models.Tag || mongoose.model<ITag>('Tag', TagSchema);
export const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

// Default export
export default { User, Category, Tag, Post };
