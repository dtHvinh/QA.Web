'use client'

import TagLabel from "@/components/TagLabel";
import getAuth from "@/helpers/auth-utils";

export default function Home() {
    const auth = getAuth();

    return (
        <div className="grid grid-cols-3 gap-4 mt-2">
            <div className="text-2xl col-span-3">
                Hello, {auth?.username}
            </div>

            <div className="gap-4 col-span-3 md:col-span-1 border-2 border-gray-400 h-full m-2 p-4 flex flex-col">
                <div className="text-lg font-semibold">
                    Reputation
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex">
                        <div className="w-3/4 -ml-4 text-center">
                            0
                        </div>
                        <svg viewBox="0 0 180 30" xmlns="http://www.w3.org/2000/svg">
                            <rect width="100%" height="33%" fill="lightblue">
                            </rect>
                            <rect y="20" width="100%" height="33%" fill="lightblue">
                            </rect>
                            <path
                                d="M0 27 L90 9.857142857142858 L108 13.285714285714285 L126 9.857142857142858 L144 13.285714285714285 L180 3"
                                stroke="blue" strokeDasharray="6, 6" strokeWidth="3" fill="none">
                            </path>
                        </svg>
                    </div>
                    <small>Earn reputation by Asking, Answering</small>
                </div>
            </div>

            <div className="gap-4 col-span-3 md:col-span-1 border-2 border-gray-400 h-full m-2 p-4 flex flex-col">
                <div className="text-lg font-semibold ">
                    Your most watched tags
                </div>
                <div className="flex space-x-2">
                    <TagLabel name="javascript" description={'a'}/>
                    <TagLabel name="javascript" description={'a'}/>
                </div>
            </div>

        </div>
    );
}
