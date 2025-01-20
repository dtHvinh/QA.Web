'use client';

import {Routes} from "@/utilities/Constants";
import Link from "next/link";
import {usePathname} from "next/navigation";

export function TopBanner() {
    const path = usePathname();

    return (
        !path.startsWith(Routes.NewQuestion) &&
        <div className="w-full max-h-32 min-h-16 bg-blue-950 gap-4 text-white items-center flex justify-center">
            <Link href={Routes.NewQuestion} title="Ask a question" className="bg-white text-black rounded-full p-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd"
                          d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                </svg>
            </Link>
            <div className="font-bold text-2xl font-mono">Start asking a question</div>
        </div>
    );
}
