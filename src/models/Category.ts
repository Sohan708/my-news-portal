import mongoose, { Schema, models } from 'mongoose';

export interface ICategory extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    slug: string;
    description?: string;
    parent?: mongoose.Types.ObjectId | ICategory | null;
    image?: string;
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
    {
        name: {
            type: String,
            required: [true, 'Category name is required'],
            trim: true,
            unique: true,
        },
        slug: {
            type: String,
            required: [true, 'Slug is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        description: {
            type: String,
            maxlength: 500,
        },
        parent: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            default: null,
        },
        image: {
            type: String,
            default: null,
        },
        order: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
CategorySchema.index({ slug: 1 });
CategorySchema.index({ parent: 1 });
CategorySchema.index({ isActive: 1 });

const Category = models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
