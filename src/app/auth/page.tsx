'use client'

import { AuthProps } from "@/helpers/auth-utils";
import { IsErrorResponse, postFetcher } from "@/helpers/request-utils";
import notifyError from "@/utilities/ToastrExtensions";
import { setCookie } from "cookies-next/client";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const formData = new FormData(e.currentTarget);
            const data = {
                email: formData.get('email') as string,
                password: formData.get('password') as string,
                ...((!isLogin && { confirmPassword: formData.get('confirmPassword') as string }))
            };

            const response = await postFetcher(`/api/auth/${isLogin ? 'login' : 'register'}`, JSON.stringify(data));

            if (IsErrorResponse(response)) {
                setError(response.title);
                return;
            }

            setCookie('auth', response as AuthProps);
            router.push('/');

        } catch (e: any) {
            notifyError(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="hidden md:block space-y-6 p-8"
                >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {isLogin ? 'Welcome Back!' : 'Join Our Community'}
                    </h1>
                    <p className="text-gray-600 text-lg">
                        {isLogin
                            ? 'Share your knowledge and help others grow.'
                            : 'Create an account and start your journey with us.'}
                    </p>
                    <div className="flex gap-4">
                        <div className="p-4 bg-white/50 backdrop-blur-sm rounded-xl shadow-sm">
                            <h3 className="font-semibold text-gray-800">1000+</h3>
                            <p className="text-sm text-gray-600">Active Users</p>
                        </div>
                        <div className="p-4 bg-white/50 backdrop-blur-sm rounded-xl shadow-sm">
                            <h3 className="font-semibold text-gray-800">5000+</h3>
                            <p className="text-sm text-gray-600">Questions Answered</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div
                        className="text-center mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-2xl font-bold text-gray-900">
                            {isLogin ? 'Sign In' : 'Create Account'}
                        </h2>
                    </motion.div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg"
                        >
                            {error}
                        </motion.div>
                    )}

                    <AnimatePresence mode="wait">
                        <motion.form
                            key={isLogin ? 'login' : 'register'}
                            className="space-y-5"
                            onSubmit={handleSubmit}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className="w-full text-black px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                    placeholder="your@email.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    className="w-full text-black px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>

                            <AnimatePresence>
                                {!isLogin && (
                                    <motion.div
                                        className="space-y-2"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                    >
                                        <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            required
                                            className="text-black w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                            placeholder="••••••••"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg 
                                         hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 
                                         disabled:cursor-not-allowed font-medium"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    isLogin ? 'Sign In' : 'Create Account'
                                )}
                            </button>
                        </motion.form>
                    </AnimatePresence>

                    <motion.div
                        className="mt-6 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                        >
                            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                        </button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}