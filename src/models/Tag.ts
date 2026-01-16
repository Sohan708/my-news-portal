import mongoose, { Schema, models } from 'mongoose';

export interface ITag extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
}

const TagSchema = new Schema<ITag>(
    {
        name: {
            type: String,
            required: [true, 'Tag name is required'],
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
    },
    {
        timestamps: true,
    }
);

// Index
TagSchema.index({ slug: 1 });

const Tag = models.Tag || mongoose.model<ITag>('Tag', TagSchema);

export default Tag;
