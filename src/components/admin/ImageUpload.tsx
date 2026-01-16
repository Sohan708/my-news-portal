'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    label?: string;
    aspectRatio?: string;
}

export default function ImageUpload({ value, onChange, label = 'Upload Image', aspectRatio }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string>(value || '');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/v1/admin/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            const imageUrl = data.data.url;

            setPreview(imageUrl);
            onChange(imageUrl);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemove = () => {
        setPreview('');
        onChange('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-3">
            {label && <label className="block text-sm font-medium">{label}</label>}

            {preview ? (
                <div className="relative group">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full rounded-lg border border-border"
                        style={aspectRatio ? { aspectRatio } : undefined}
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 p-2 bg-destructive text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X size={18} />
                    </button>
                </div>
            ) : (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                >
                    {isUploading ? (
                        <div className="flex flex-col items-center space-y-2">
                            <Loader2 className="animate-spin text-primary" size={32} />
                            <p className="text-sm text-muted-foreground">Uploading...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center space-y-2">
                            <ImageIcon className="text-muted-foreground" size={32} />
                            <div>
                                <p className="text-sm font-medium">Click to upload image</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    PNG, JPG, GIF up to 5MB
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading}
            />

            {/* URL Input Fallback */}
            <div className="flex items-center space-x-2">
                <div className="flex-1">
                    <input
                        type="url"
                        value={preview}
                        onChange={(e) => {
                            setPreview(e.target.value);
                            onChange(e.target.value);
                        }}
                        placeholder="Or paste image URL"
                        className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>
        </div>
    );
}
