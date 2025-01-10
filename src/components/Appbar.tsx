'use client'

import { AuthContext } from "@/context/AuthContextProvider";
import { AppName, Routes } from "@/utilities/Constants";
import Image from 'next/image';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";

export default function Appbar() {
    const authContext = useContext(AuthContext);
    const currentPath = usePathname();

    return (
        !currentPath.startsWith('/auth') &&
        <div className="flex items-center justify-between py-4 w-full" >
            <div className="gap-4 hidden md:flex items-center">
                <Link href={'/'} className="text-2xl ">
                    {AppName}
                </Link>
                <div className="ml-8 gap-8 text-md flex items-center text-gray-700">
                    <button className="hover:bg-gray-300 p-2 rounded-full transition-colors">Questions</button>
                    <button className="hover:bg-gray-300 p-2 rounded-full transition-colors">Bookmarks</button>
                </div>
            </div>

            <div className="flex gap-4 items-center">
                <div>
                    <input type="text" placeholder="Search..." className="text-gray-500 border p-2 outline-none rounded-full w-[400px] focus:border-black transition-colors" />
                </div>
                {authContext !== null
                    ?
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <Image
                            src="https://ui-avatars.com/api/?name=hien+vinh2"
                            width={32}
                            height={32}
                            quality={100}
                            className="rounded-full"
                            alt="A"
                        />
                    </div>
                    :
                    <div className="text-gray-500 flex gap-2">
                        <Link href={Routes.Auth.Login} className="rounded-full border py-1 px-4 border-gray-300 hover:bg-gray-200 transition-all active:scale-95">Log in</Link>
                        <Link href={Routes.Auth.Register} className="rounded-full border py-1 px-4 border-gray-300 hover:bg-gray-200 transition-all active:scale-95">Sign up</Link>
                    </div>
                }
            </div>
        </div>
    )
}