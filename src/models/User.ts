import mongoose, { Schema, models } from 'mongoose';

export interface IUser extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    emailVerified?: Date;
    image?: string;
    password?: string;
    role: 'admin' | 'editor' | 'author' | 'user';
    bio?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        emailVerified: {
            type: Date,
            default: null,
        },
        image: {
            type: String,
            default: null,
        },
        password: {
            type: String,
            select: false, // Don't return password by default
        },
        role: {
            type: String,
            enum: ['admin', 'editor', 'author', 'user'],
            default: 'user',
        },
        bio: {
            type: String,
            maxlength: 500,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

const User = models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
