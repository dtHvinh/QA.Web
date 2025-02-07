import hljs from "highlight.js";

export function highlightCode() {
    document.querySelectorAll('pre code:not(.hljs)').forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
    });
}