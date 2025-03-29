'use client'

import { AuthProps, setRememberAuth } from "@/helpers/auth-utils";
import { IsErrorResponse, postFetcher } from "@/helpers/request-utils";
import notifyError from "@/utilities/ToastrExtensions";
import { FormEvent, useState } from "react";

interface LoginFormProps {
    onSuccess?: () => void;
    onRegisterClick?: () => void;
}

export default function LoginForm({ onSuccess, onRegisterClick }: LoginFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isRememberMe, setIsRememberMe] = useState(true)

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true);

        try {
            const formData = new FormData(e.currentTarget)
            const data = {
                email: formData.get('email') as string,
                password: formData.get('password') as string,
            };

            const response = await postFetcher(`/api/auth/login`, JSON.stringify(data), {
                needAuth: false,
            })

            if (IsErrorResponse(response)) {
                return;
            }

            setRememberAuth(response as AuthProps)

            onSuccess?.();
        } catch (e: any) {
            notifyError(e);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full px-4 py-6 sm:px-8">
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-6">
                Log in to your account
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                            Email address
                        </label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full px-3 py-2 bg-[var(--input-background)] border border-[var(--border-color)] 
                                     rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] 
                                     text-[var(--text-primary)]"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="w-full px-3 py-2 bg-[var(--input-background)] border border-[var(--border-color)] 
                                     rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]
                                     text-[var(--text-primary)]"
                            placeholder="Enter your password"
                        />
                    </div>

                    {/* <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <input defaultChecked={isRememberMe} onChange={() => setIsRememberMe(!isRememberMe)}
                                type="checkbox" className="w-4 h-4 rounded border-[var(--border-color)] text-[var(--text-primary)]" />
                            <span className="ml-2 text-sm text-[var(--text-secondary)]">Remember me</span>
                        </label>
                        <Link href="#" className="text-sm text-[var(--primary)] hover:text-[var(--primary-darker)]">
                            Forgot password?
                        </Link>
                    </div> */}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2.5 px-4 bg-[var(--primary)] text-white rounded-lg 
                                 hover:bg-[var(--primary-darker)] transition-colors font-medium
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Signing in...
                            </span>
                        ) : 'Sign in'}
                    </button>
                </div>
            </form>

            <div className="mt-6 text-center text-sm text-[var(--text-secondary)]">
                Don't have an account?{' '}
                <button
                    onClick={onRegisterClick}
                    className="text-[var(--primary)] hover:text-[var(--primary-darker)] font-medium"
                >
                    Create account
                </button>
            </div>
        </div>
    );
}