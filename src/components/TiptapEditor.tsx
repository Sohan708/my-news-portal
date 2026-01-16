'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Quote,
    Code,
    Undo,
    Redo,
    Link as LinkIcon,
    ImageIcon,
} from 'lucide-react';

interface TiptapEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

export default function TiptapEditor({ content, onChange, placeholder = 'Start writing your article...' }: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline',
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
        ],
        content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[400px] px-4 py-3',
            },
        },
    });

    if (!editor) {
        return null;
    }

    const addImage = () => {
        const choice = window.confirm(
            'Click OK to upload an image, or Cancel to enter a URL'
        );

        if (choice) {
            // Upload option
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = async (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (!file) return;

                try {
                    const formData = new FormData();
                    formData.append('file', file);

                    const response = await fetch('/api/upload', {
                        method: 'POST',
                        body: formData,
                    });

                    if (response.ok) {
                        const data = await response.json();
                        editor.chain().focus().setImage({ src: data.url }).run();
                    } else {
                        alert('Upload failed');
                    }
                } catch (error) {
                    alert('Upload error');
                }
            };
            input.click();
        } else {
            // URL option
            const url = window.prompt('Enter image URL:');
            if (url) {
                editor.chain().focus().setImage({ src: url }).run();
            }
        }
    };

    const setLink = () => {
        const url = window.prompt('Enter URL:');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    return (
        <div className="border border-border rounded-lg overflow-hidden bg-card">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-muted/30">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive('bold') ? 'bg-muted text-primary' : ''
                        }`}
                    title="Bold"
                >
                    <Bold className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive('italic') ? 'bg-muted text-primary' : ''
                        }`}
                    title="Italic"
                >
                    <Italic className="w-4 h-4" />
                </button>

                <div className="w-px h-6 bg-border mx-1" />

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-muted text-primary' : ''
                        }`}
                    title="Heading 1"
                >
                    <Heading1 className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-muted text-primary' : ''
                        }`}
                    title="Heading 2"
                >
                    <Heading2 className="w-4 h-4" />
                </button>

                <div className="w-px h-6 bg-border mx-1" />

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive('bulletList') ? 'bg-muted text-primary' : ''
                        }`}
                    title="Bullet List"
                >
                    <List className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive('orderedList') ? 'bg-muted text-primary' : ''
                        }`}
                    title="Numbered List"
                >
                    <ListOrdered className="w-4 h-4" />
                </button>

                <div className="w-px h-6 bg-border mx-1" />

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive('blockquote') ? 'bg-muted text-primary' : ''
                        }`}
                    title="Quote"
                >
                    <Quote className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive('codeBlock') ? 'bg-muted text-primary' : ''
                        }`}
                    title="Code Block"
                >
                    <Code className="w-4 h-4" />
                </button>

                <div className="w-px h-6 bg-border mx-1" />

                <button
                    type="button"
                    onClick={setLink}
                    className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive('link') ? 'bg-muted text-primary' : ''
                        }`}
                    title="Add Link"
                >
                    <LinkIcon className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={addImage}
                    className="p-2 rounded hover:bg-muted transition-colors"
                    title="Add Image"
                >
                    <ImageIcon className="w-4 h-4" />
                </button>

                <div className="w-px h-6 bg-border mx-1" />

                <button
                    type="button"
                    onClick={() => editor.chain().focus().undo().run()}
                    className="p-2 rounded hover:bg-muted transition-colors"
                    title="Undo"
                    disabled={!editor.can().undo()}
                >
                    <Undo className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().redo().run()}
                    className="p-2 rounded hover:bg-muted transition-colors"
                    title="Redo"
                    disabled={!editor.can().redo()}
                >
                    <Redo className="w-4 h-4" />
                </button>
            </div>

            {/* Editor Content */}
            <EditorContent editor={editor} />
        </div>
    );
}
