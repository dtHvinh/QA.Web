'use client'

import { BlockRounded } from '@mui/icons-material';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function BannedPage() {
    const searchParams = useSearchParams();
    const reason = searchParams.get('reason') || 'Account has been banned';

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
            <div className="max-w-md w-full p-8 rounded-2xl bg-[var(--card-background)] shadow-lg">
                <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
                        <BlockRounded className="text-red-500" sx={{ fontSize: 40 }} />
                    </div>

                    <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                        Account Banned
                    </h1>

                    <p className="text-[var(--text-secondary)] mb-6">
                        {reason}
                    </p>

                    <Link
                        href="/auth"
                        className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-darker)] transition-colors"
                    >
                        Return to login
                    </Link>
                </div>
            </div>
        </div>
    );
}