'use client'

import StarterKit from '@tiptap/starter-kit'

import {Editor, EditorContent, useEditor} from '@tiptap/react'
import {useState} from 'react'
import {Tooltip} from "@mui/material";

interface TextEditorProps {
    currentText: string
    onTextChange: (text: string) => void
}

const TextEditor = (params: TextEditorProps) => {

    const editor = useEditor({
        extensions: [StarterKit],
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

function TextEditorToolbar({editor}: Readonly<{ editor: Editor }>) {
    const [isSelectHeading, setIsSelectHeading] = useState(false)

    return (
        <div className="toolbar flex-wrap w-full gap-3 md:gap-5">
            <div className={'flex gap-1'}>
                <Tooltip title='Header'>
                    <button
                        type={"button"}
                        onClick={() => setIsSelectHeading(!isSelectHeading)}
                        className={editor.isActive('heading') ? 'active' : ''}
                        tabIndex={-1}
                    >Header
                    </button>
                </Tooltip>
                <div className={isSelectHeading ? 'flex gap-1' : 'hidden'}>
                    <button
                        type={"button"}
                        onClick={() => editor.chain().focus().toggleHeading({level: 1}).run()}
                        className={editor.isActive('heading', {level: 1}) ? 'active' : ''}
                        tabIndex={-1}
                    >
                        H1
                    </button>
                    <button
                        type={"button"}
                        onClick={() => editor.chain().focus().toggleHeading({level: 2}).run()}
                        className={editor.isActive('heading', {level: 2}) ? 'active' : ''}
                        tabIndex={-1}
                    >
                        H2
                    </button>
                    <button
                        type={"button"}
                        onClick={() => editor.chain().focus().toggleHeading({level: 3}).run()}
                        className={editor.isActive('heading', {level: 3}) ? 'active' : ''}
                        tabIndex={-1}
                    >
                        H3
                    </button>
                    <span className='border-x-[1px] border-gray-300 ml-3'></span>
                </div>
            </div>
            <Tooltip title={'Bold'}>
                <button
                    type={"button"}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive('bold') ? 'active' : ''}
                    tabIndex={-1}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor">
                        <path
                            d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z"/>
                    </svg>
                </button>
            </Tooltip>
            <Tooltip title={'Italic'}>
                <button
                    type={"button"}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive('italic') ? 'active' : ''}
                    tabIndex={-1}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor">
                        <path
                            d="M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z"/>
                    </svg>
                </button>
            </Tooltip>
            <Tooltip title={'Strike'}>
                <button
                    type={"button"}
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={editor.isActive('strike') ? 'active' : ''}
                    tabIndex={-1}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor">
                        <path
                            d="M6.333 5.686c0 .31.083.581.27.814H5.166a2.8 2.8 0 0 1-.099-.76c0-1.627 1.436-2.768 3.48-2.768 1.969 0 3.39 1.175 3.445 2.85h-1.23c-.11-1.08-.964-1.743-2.25-1.743-1.23 0-2.18.602-2.18 1.607zm2.194 7.478c-2.153 0-3.589-1.107-3.705-2.81h1.23c.144 1.06 1.129 1.703 2.544 1.703 1.34 0 2.31-.705 2.31-1.675 0-.827-.547-1.374-1.914-1.675L8.046 8.5H1v-1h14v1h-3.504c.468.437.675.994.675 1.697 0 1.826-1.436 2.967-3.644 2.967"/>
                    </svg>
                </button>
            </Tooltip>
            <Tooltip title={'Numeric List'}>
                <button
                    type={"button"}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive('bulletList') ? 'active' : ''}
                    tabIndex={-1}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor">
                        <path fillRule="evenodd"
                              d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
                    </svg>
                </button>
            </Tooltip>
            <Tooltip title={'Bullet List'}>
                <button
                    type={"button"}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive('orderedList') ? 'active' : ''}
                    tabIndex={-1}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor">
                        <path fillRule="evenodd"
                              d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5"/>
                        <path
                            d="M1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32a.33.33 0 0 0-.342.338zM2.564 5h-.635V2.924h-.031l-.598.42v-.567l.629-.443h.635z"/>
                    </svg>
                </button>
            </Tooltip>
            <Tooltip title={'Quote'}>
                <button
                    type={"button"}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={editor.isActive('orderedList') ? 'active' : ''}
                    tabIndex={-1}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor">
                        <path
                            d="M12 12a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1h-1.388q0-.527.062-1.054.093-.558.31-.992t.559-.683q.34-.279.868-.279V3q-.868 0-1.52.372a3.3 3.3 0 0 0-1.085.992 4.9 4.9 0 0 0-.62 1.458A7.7 7.7 0 0 0 9 7.558V11a1 1 0 0 0 1 1zm-6 0a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1H4.612q0-.527.062-1.054.094-.558.31-.992.217-.434.559-.683.34-.279.868-.279V3q-.868 0-1.52.372a3.3 3.3 0 0 0-1.085.992 4.9 4.9 0 0 0-.62 1.458A7.7 7.7 0 0 0 3 7.558V11a1 1 0 0 0 1 1z"/>
                    </svg>
                </button>
            </Tooltip>
            <Tooltip title={'Code Block'}>
                <button
                    type={"button"}
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={editor.isActive('codeBlock') ? 'active' : ''}
                    tabIndex={-1}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor">
                        <path
                            d="M5.854 4.854a.5.5 0 1 0-.708-.708l-3.5 3.5a.5.5 0 0 0 0 .708l3.5 3.5a.5.5 0 0 0 .708-.708L2.707 8zm4.292 0a.5.5 0 0 1 .708-.708l3.5 3.5a.5.5 0 0 1 0 .708l-3.5 3.5a.5.5 0 0 1-.708-.708L13.293 8z"/>
                    </svg>
                </button>
            </Tooltip>
            <Tooltip title={'Code'}>
                <button
                    type={"button"}
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    className={editor.isActive('code') ? 'active' : ''}
                    tabIndex={-1}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                         viewBox="0 0 16 16">
                        <path
                            d="M2.114 8.063V7.9c1.005-.102 1.497-.615 1.497-1.6V4.503c0-1.094.39-1.538 1.354-1.538h.273V2h-.376C3.25 2 2.49 2.759 2.49 4.352v1.524c0 1.094-.376 1.456-1.49 1.456v1.299c1.114 0 1.49.362 1.49 1.456v1.524c0 1.593.759 2.352 2.372 2.352h.376v-.964h-.273c-.964 0-1.354-.444-1.354-1.538V9.663c0-.984-.492-1.497-1.497-1.6M13.886 7.9v.163c-1.005.103-1.497.616-1.497 1.6v1.798c0 1.094-.39 1.538-1.354 1.538h-.273v.964h.376c1.613 0 2.372-.759 2.372-2.352v-1.524c0-1.094.376-1.456 1.49-1.456V7.332c-1.114 0-1.49-.362-1.49-1.456V4.352C13.51 2.759 12.75 2 11.138 2h-.376v.964h.273c.964 0 1.354.444 1.354 1.538V6.3c0 .984.492 1.497 1.497 1.6"/>
                    </svg>
                </button>
            </Tooltip>
        </div>
    );
}


