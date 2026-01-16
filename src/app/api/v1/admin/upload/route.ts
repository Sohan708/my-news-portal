import { NextResponse } from 'next/server';

// Using unsigned upload with upload preset - no API key/secret needed!
export const runtime = 'nodejs';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { success: false, message: 'No file provided' },
                { status: 400 }
            );
        }

        // Upload directly to Cloudinary using unsigned upload
        const cloudinaryFormData = new FormData();
        cloudinaryFormData.append('file', file);
        cloudinaryFormData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET || '');
        cloudinaryFormData.append('folder', 'news-portal');

        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;

        const response = await fetch(cloudinaryUrl, {
            method: 'POST',
            body: cloudinaryFormData,
        });

        if (!response.ok) {
            throw new Error('Cloudinary upload failed');
        }

        const result = await response.json();

        return NextResponse.json({
            success: true,
            data: {
                url: result.secure_url,
                publicId: result.public_id,
                width: result.width,
                height: result.height,
                format: result.format,
            },
        });
    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Upload failed' },
            { status: 500 }
        );
    }
}
