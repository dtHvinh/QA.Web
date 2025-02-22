'use client'

import {ErrorResponse} from "@/props/ErrorResponse";
import {backendURL, Routes} from "@/utilities/Constants";
import notifyError from "@/utilities/ToastrExtensions";
import {setCookie} from "cookies-next/client";
import Link from "next/link";
import {redirect, usePathname} from "next/navigation";
import React, {FormEvent, useState} from "react";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const name = usePathname()

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true);

        try {
            const formData = new FormData(e.currentTarget)
            const data = {
                email: formData.get('email') as string,
                password: formData.get('password') as string,
            };

            const response = await fetch(`${backendURL}/api${name}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const error = (await response.json()) as ErrorResponse;
                notifyError(error.title);
                return;
            }

            const body = await response.json();

            setCookie('auth', body)

        } catch {
            notifyError('Something went wrong');
            return;
        } finally {
            setIsLoading(false);
        }

        redirect('/')
    }

    return (
        <div className="flex flex-col h-screen">
            <div className="grid place-items-center mx-2 my-20 sm:my-auto">

                <div className="w-full p-12 sm:w-8/12 md:w-6/12 lg:w-5/12 2xl:w-4/12
                                bg-white rounded-lg md:border-2 md:border-gray-300">

                    <h2 className="text-center font-semibold text-3xl lg:text-4xl text-gray-800">
                        Log in
                    </h2>
                    <form className="mt-10" method="POST" onSubmit={handleSubmit}>

                        <label htmlFor="email"
                               className="block text-xs font-semibold text-gray-600 uppercase">E-mail</label>
                        <input id="email" type="email" name="email" placeholder="e-mail address" autoComplete="email"
                               className="block w-full py-3 px-1 mt-2
                    text-gray-800 appearance-none
                    border-b-2 border-gray-100
                    focus:text-gray-500 focus:outline-none focus:border-gray-200"
                               required/>

                        <label htmlFor="password"
                               className="block mt-2 text-xs font-semibold text-gray-600 uppercase">Password</label>
                        <input id="password" type="password" name="password" placeholder="password"
                               autoComplete="current-password"
                               className="block w-full py-3 px-1 mt-2 mb-4
                    text-gray-800 appearance-none
                    border-b-2 border-gray-100
                    focus:text-gray-500 focus:outline-none focus:border-gray-200"
                               required/>

                        <button type="submit"
                                className="w-full py-3 mt-10 bg-gray-800 rounded-sm
                    font-medium text-white uppercase
                    focus:outline-none hover:bg-gray-700 hover:shadow-none">
                            {isLoading ? 'Login...' : 'Login'}
                        </button>

                        <div className="sm:flex sm:flex-wrap mt-8 sm:mb-4 text-sm text-center">
                            <Link href="#" className="flex-2 underline">
                                Forgot password?
                            </Link>

                            <p className="flex-1 text-gray-500 text-md mx-4 my-1 sm:my-auto">
                                or
                            </p>

                            <Link href={Routes.Auth.Register} className="flex-2 underline">
                                Create an Account
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}