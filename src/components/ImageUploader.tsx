'use client';

import { useState } from 'react';
import { Upload, Link as LinkIcon, X, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ImageUploaderProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
}

export default function ImageUploader({ value, onChange, label = 'Featured Image' }: ImageUploaderProps) {
    const [uploadType, setUploadType] = useState<'upload' | 'url'>('upload');
    const [uploading, setUploading] = useState(false);
    const [urlInput, setUrlInput] = useState(value);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            onChange(data.url);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleUrlSubmit = () => {
        if (urlInput && urlInput.startsWith('http')) {
            onChange(urlInput);
        } else {
            alert('Please enter a valid URL');
        }
    };

    const handleRemove = () => {
        onChange('');
        setUrlInput('');
    };

    return (
        <div>
            <label className="block text-sm font-semibold mb-2">
                {label}
            </label>

            {/* Tabs */}
            <div className="flex gap-2 mb-4">
                <button
                    type="button"
                    onClick={() => setUploadType('upload')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${uploadType === 'upload'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted hover:bg-muted/70'
                        }`}
                >
                    <Upload className="w-4 h-4 inline mr-2" />
                    Upload Image
                </button>
                <button
                    type="button"
                    onClick={() => setUploadType('url')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${uploadType === 'url'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted hover:bg-muted/70'
                        }`}
                >
                    <LinkIcon className="w-4 h-4 inline mr-2" />
                    Image URL
                </button>
            </div>

            {/* Upload Area */}
            {uploadType === 'upload' ? (
                <div className="border-2 border-dashed border-border rounded-lg p-6">
                    {value ? (
                        <div className="relative">
                            <div className="relative h-64 rounded-lg overflow-hidden mb-3">
                                <Image
                                    src={value}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
                            >
                                <X className="w-4 h-4" />
                                Remove Image
                            </button>
                        </div>
                    ) : (
                        <div className="text-center">
                            {uploading ? (
                                <div className="flex flex-col items-center gap-3">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                    <p className="text-sm text-muted-foreground">Uploading...</p>
                                </div>
                            ) : (
                                <>
                                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                    <label className="cursor-pointer">
                                        <span className="px-4 py-2 bg-primary text-primary-foreground rounded-lg inline-block hover:bg-primary/90 transition-colors">
                                            Choose Image
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                        />
                                    </label>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        PNG, JPG, GIF up to 5MB
                                    </p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    {value ? (
                        <div className="relative">
                            <div className="relative h-64 rounded-lg overflow-hidden mb-3 border border-border">
                                <Image
                                    src={value}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex gap-3">
                                <input
                                    type="url"
                                    value={urlInput}
                                    onChange={(e) => setUrlInput(e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                    className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <button
                                    type="button"
                                    onClick={handleUrlSubmit}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    Update
                                </button>
                                <button
                                    type="button"
                                    onClick={handleRemove}
                                    className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-3">
                            <input
                                type="url"
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                className="flex-1 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <button
                                type="button"
                                onClick={handleUrlSubmit}
                                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Add
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
