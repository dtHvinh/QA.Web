'use client'

import {ClassAttributes, Fragment, HTMLAttributes} from 'react'
import cs from 'classnames'
import ReactMarkdown, {ExtraProps} from 'react-markdown'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {vscDarkPlus} from 'react-syntax-highlighter/dist/esm/styles/prism'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'

import './index.scss'

export interface MarkdownProps {
    className?: string
    children: string
}

const HighlightCode = (
    props: ClassAttributes<HTMLElement> & HTMLAttributes<HTMLElement> & ExtraProps
) => {
    const {children, className, ref, ...rest} = props
    const match = /language-(\w+)/.exec(className || '')

    const code = match ? String(children).replace(/\n$/, '') : ''

    return match ? (
        <>
            <SyntaxHighlighter {...rest} style={vscDarkPlus} language={match[1]} PreTag="div">
                {code}
            </SyntaxHighlighter>
        </>
    ) : (
        <code ref={ref} {...rest} className={cs('highlight', className)}>
            {children}
        </code>
    )
}

export const Markdown = ({className, children}: MarkdownProps) => {
    return (
        <ReactMarkdown
            className={cs('prose dark:prose-invert max-w-none text-section', className)}
            remarkPlugins={[remarkParse, remarkMath, remarkRehype, remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeKatex, rehypeStringify]}
            components={{
                code(props) {
                    return <HighlightCode {...props} />
                }
            }}
        >
            {children}
        </ReactMarkdown>
    )
}