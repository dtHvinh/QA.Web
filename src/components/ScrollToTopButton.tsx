'use client'

import { useEffect, useState } from 'react';

export default function ScrollToTopButton() {
    const [isAtTop, setIsAtTop] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            setIsAtTop(window.scrollY === 0);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    if (isAtTop) {
        return null;
    }

    return (
        <div className={'hidden md:block fixed z-[99]'}>
            <button onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }} className={'bg-gray-200 hover:bg-gray-300 p-4 fixed rounded-full right-7 bottom-7 transition-colors'}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="[var(--text-primary)]"
                    viewBox="0 0 16 16">
                    <path fillRule="evenodd"
                        d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z" />
                </svg>


            </button>
        </div>
    );
}