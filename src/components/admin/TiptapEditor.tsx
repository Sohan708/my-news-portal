'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Link2,
    Image as ImageIcon,
    Code,
    Heading1,
    Heading2,
    Heading3,
} from 'lucide-react';

interface TiptapEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

export default function TiptapEditor({ content, onChange, placeholder = 'Write your content here...' }: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary hover:underline',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'max-w-full rounded-lg',
                },
            }),
        ],
        content,
        immediatelyRender: false, // Fix SSR hydration mismatch
        editorProps: {
            attributes: {
                class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[300px] px-4 py-3',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    if (!editor) {
        return null;
    }

    const addImage = () => {
        const url = window.prompt('Enter image URL:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('Enter URL:', previousUrl);

        if (url === null) {
            return;
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className="border border-border rounded-lg overflow-hidden">
            {/* Toolbar */}
            <div className="bg-muted border-b border-border p-2 flex flex-wrap gap-1">
                {/* Text Formatting */}
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded hover:bg-background transition-colors ${editor.isActive('bold') ? 'bg-background' : ''
                        }`}
                    title="Bold (Ctrl+B)"
                    type="button"
                >
                    <Bold size={18} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded hover:bg-background transition-colors ${editor.isActive('italic') ? 'bg-background' : ''
                        }`}
                    title="Italic (Ctrl+I)"
                    type="button"
                >
                    <Italic size={18} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    className={`p-2 rounded hover:bg-background transition-colors ${editor.isActive('code') ? 'bg-background' : ''
                        }`}
                    title="Inline Code"
                    type="button"
                >
                    <Code size={18} />
                </button>

                <div className="w-px bg-border mx-1" />

                {/* Headings */}
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`p-2 rounded hover:bg-background transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-background' : ''
                        }`}
                    title="Heading 1"
                    type="button"
                >
                    <Heading1 size={18} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-2 rounded hover:bg-background transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-background' : ''
                        }`}
                    title="Heading 2"
                    type="button"
                >
                    <Heading2 size={18} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`p-2 rounded hover:bg-background transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-background' : ''
                        }`}
                    title="Heading 3"
                    type="button"
                >
                    <Heading3 size={18} />
                </button>

                <div className="w-px bg-border mx-1" />

                {/* Lists */}
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded hover:bg-background transition-colors ${editor.isActive('bulletList') ? 'bg-background' : ''
                        }`}
                    title="Bullet List"
                    type="button"
                >
                    <List size={18} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded hover:bg-background transition-colors ${editor.isActive('orderedList') ? 'bg-background' : ''
                        }`}
                    title="Numbered List"
                    type="button"
                >
                    <ListOrdered size={18} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`p-2 rounded hover:bg-background transition-colors ${editor.isActive('blockquote') ? 'bg-background' : ''
                        }`}
                    title="Quote"
                    type="button"
                >
                    <Quote size={18} />
                </button>

                <div className="w-px bg-border mx-1" />

                {/* Media */}
                <button
                    onClick={setLink}
                    className={`p-2 rounded hover:bg-background transition-colors ${editor.isActive('link') ? 'bg-background' : ''
                        }`}
                    title="Add Link"
                    type="button"
                >
                    <Link2 size={18} />
                </button>
                <button
                    onClick={addImage}
                    className="p-2 rounded hover:bg-background transition-colors"
                    title="Add Image"
                    type="button"
                >
                    <ImageIcon size={18} />
                </button>

                <div className="w-px bg-border mx-1" />

                {/* Undo/Redo */}
                <button
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className="p-2 rounded hover:bg-background transition-colors disabled:opacity-50"
                    title="Undo (Ctrl+Z)"
                    type="button"
                >
                    <Undo size={18} />
                </button>
                <button
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className="p-2 rounded hover:bg-background transition-colors disabled:opacity-50"
                    title="Redo (Ctrl+Y)"
                    type="button"
                >
                    <Redo size={18} />
                </button>
            </div>

            {/* Editor Content */}
            <EditorContent editor={editor} />

            {/* Character Count */}
            <div className="bg-muted border-t border-border px-4 py-2 text-sm text-muted-foreground">
                {editor.storage.characterCount?.characters() || 0} characters
            </div>
        </div>
    );
}
