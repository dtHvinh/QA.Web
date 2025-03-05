'use client'

import { TextEditorToolbar } from "@/components/TextEditorToolbar";
import Image from '@tiptap/extension-image';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useState } from "react";

interface TextEditorProps {
    currentText: string
    onTextChange: (text: string) => void
    resetFlag?: boolean
}

const TextEditor = (params: TextEditorProps) => {
    const [currentImages, setCurrentImages] = useState<string[]>([])

    const editor = useEditor({
        extensions: [StarterKit, Image],
        editable: true,
        content: params.currentText,
        onUpdate: ({ editor }) => {
            let content = editor.getHTML();
            const json = editor.getJSON().content;

            if (Array.isArray(json) && json.length === 1 && !json[0].hasOwnProperty("content")) {
                content = "";
            }

            params.onTextChange(content)
        },
        immediatelyRender: false,
    })

    useEffect(() => {
        editor?.commands.setContent('');
    }, [params.resetFlag]);

    useEffect(() => {
        return () => {
            console.log('destroy')
        }
    }, []);

    if (!editor) {
        return null
    }

    return (
        <div className='text-editor'>
            <TextEditorToolbar editor={editor} onImageAdd={(url) => setCurrentImages([...currentImages, url])} />
            <hr />
            <EditorContent spellCheck='false' editor={editor} />
        </div>
    )
}

export default TextEditor


