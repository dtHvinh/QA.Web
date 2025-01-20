import useLogout from "@/helpers/logout-hook";
import Image from "next/image";
import Link from "next/link";
import {useState} from "react";
import LeftNav from "./LeftNav";

export default function UserDropdown(params: Readonly<{ profilePicture?: string }>) {
    const {profilePicture} = params;
    const [isOpen, setIsOpen] = useState(false);
    const logout = useLogout();

    return (
        <div>
            <button onClick={() => setIsOpen(!isOpen)}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <Image
                    src={`${profilePicture}`}
                    width={32}
                    height={32}
                    quality={100}
                    className="rounded-full"
                    alt="A"
                />
            </button>
            <div
                className={`${isOpen ? "" : "hidden"} origin-top-left shadow-xl border-[1px] absolute right-0 md:right-52 mt-2 w-56 rounded-md bg-white ring-1 ring-black ring-opacity-5`}>
                <div className="py-2 p-2" role="menu" aria-orientation="vertical" aria-labelledby="dropdown-button">
                    <Link href="#"
                          className="block px-4 py-2 mb-1 text-sm text-gray-700 rounded-md bg-white hover:bg-gray-100"
                          role="menuitem">
                        Profile
                    </Link>
                    <Link href="#"
                          className="block px-4 py-2 mb-1 text-sm text-gray-700 rounded-md bg-white hover:bg-gray-100"
                          role="menuitem">
                        Settings
                    </Link>
                    <button onClick={logout}
                            className="w-full text-left px-4 py-2 mb-1 text-sm text-gray-700 rounded-md bg-white hover:bg-gray-100"
                            role="menuitem">
                        Logout
                    </button>
                    <hr className="mt-4 mx-4"/>
                    <div className="block md:hidden px-4 py-2 mb-1 ">
                        <LeftNav/>
                    </div>
                </div>
            </div>
        </div>
    )
}