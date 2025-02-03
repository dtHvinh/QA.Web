'use client'

import StarterKit from '@tiptap/starter-kit'
import {EditorContent, useEditor} from '@tiptap/react'
import Image from '@tiptap/extension-image';
import {TextEditorToolbar} from "@/components/TextEditorToolbar";
import {useEffect} from "react";

interface TextEditorProps {
    currentText: string
    onTextChange: (text: string) => void
}

const TextEditor = (params: TextEditorProps) => {
    const editor = useEditor({
        extensions: [StarterKit, Image],
        editable: true,
        content: params.currentText,
        onUpdate: ({editor}) => {
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
        editor?.commands.setContent(params.currentText);
    }, [params.currentText]);

    if (!editor) {
        return null
    }

    return (
        <div className='text-editor'>
            <TextEditorToolbar editor={editor}/>
            <hr/>
            <EditorContent spellCheck='false' editor={editor}/>
        </div>
    )
}

export default TextEditor


