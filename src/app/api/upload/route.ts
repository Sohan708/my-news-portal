import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Get Cloudinary credentials from env
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset) {
            return NextResponse.json(
                { error: 'Cloudinary configuration missing' },
                { status: 500 }
            );
        }

        // Upload to Cloudinary
        const cloudinaryFormData = new FormData();
        cloudinaryFormData.append('file', file);
        cloudinaryFormData.append('upload_preset', uploadPreset);

        const cloudinaryResponse = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
                method: 'POST',
                body: cloudinaryFormData,
            }
        );

        if (!cloudinaryResponse.ok) {
            throw new Error('Cloudinary upload failed');
        }

        const data = await cloudinaryResponse.json();

        return NextResponse.json({
            success: true,
            url: data.secure_url,
            public_id: data.public_id,
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload image' },
            { status: 500 }
        );
    }
}
