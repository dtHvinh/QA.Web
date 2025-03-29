'use client'

import { postFetcher } from "@/helpers/request-utils";
import { ErrorResponse } from "@/props/ErrorResponse";
import { setCookie } from "cookies-next/client";
import React, { useState } from "react";

interface RegisterFormProps {
    onSuccess?: () => void;
    onLoginClick?: () => void;
}

export default function RegisterForm({ onSuccess, onLoginClick }: RegisterFormProps) {
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true);
        setError('');

        try {
            const formData = new FormData(e.currentTarget)
            const data = {
                email: formData.get('email') as string,
                password: formData.get('password') as string,
                confirmPassword: formData.get('confirmPassword') as string,
            };

            const response = await postFetcher('/api/auth/register', JSON.stringify(data), {
                needAuth: false,
            })

            if (!response.ok) {
                const err = (await response.json()) as ErrorResponse;
                setError(err.title);
                return;
            }

            const body = await response.json();
            setCookie('auth', body)
            onSuccess?.();
        } catch (error) {
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full px-4 py-6 sm:px-8">
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-6">
                Create your account
            </h2>

            {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                        placeholder="Create a password"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        name="confirmPassword"
                        required
                        className="w-full px-3 py-2 bg-[var(--input-background)] border border-[var(--border-color)] 
                                 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]
                                 text-[var(--text-primary)]"
                        placeholder="Confirm your password"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 bg-[var(--primary)] text-white rounded-lg 
                             hover:bg-[var(--primary-darker)] transition-colors font-medium
                             disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Creating account...
                        </span>
                    ) : 'Create account'}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-[var(--text-secondary)]">
                Already have an account?{' '}
                <button
                    onClick={onLoginClick}
                    className="text-[var(--primary)] hover:text-[var(--primary-darker)] font-medium"
                >
                    Sign in
                </button>
            </div>
        </div>
    );
}