import hljs from "highlight.js";

export function highlightCode() {
    document.querySelectorAll('pre code:not(.hljs)').forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
    });
}

export function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'instant' });
}

export function fromImage(imagePath?: string) {
    return !imagePath
        ? "/default-pfp.png"
        : imagePath.startsWith("blob")
            ? imagePath
            : process.env.NEXT_PUBLIC_STORAGE_HOST + '/' + imagePath;
}

export function isScrollBottom(e: HTMLDivElement) {
    const scrollTop = e.scrollTop;
    const scrollHeight = e.scrollHeight;
    const clientHeight = e.clientHeight;
    return scrollTop + clientHeight >= scrollHeight - 10;
}

export function getProviderImage(url: string) {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?sz=16&domain_url=${domain}`
}

export function upsert<T>(array: T[] | undefined, element: T, selector: (e: T) => unknown): T[] {
    if (!array) array = [];

    const guardSelector = (e: T) => {
        if (!selector(e))
            throw new Error("Invalid selector");

        return selector(e);
    }

    const i = array.findIndex(e => guardSelector(e) === guardSelector(element));
    if (i > -1) array[i] = element;
    else array.push(element);

    return array;
}