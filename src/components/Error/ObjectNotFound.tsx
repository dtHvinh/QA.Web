export default function ObjectNotfound({ title, message }: Readonly<{ title: string, message: string }>) {
    return (
        <div className="max-w-5xl mx-auto py-12">
            <div className="bg-[var(--card-background)] border border-[var(--border-color)] rounded-xl p-8 text-center">
                <div className="max-w-md mx-auto space-y-6">
                    <div className="w-16 h-16 bg-[var(--hover-background)] rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-8 h-8 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">{title}</h2>
                        <p className="text-[var(--text-secondary)]">{message}</p>
                    </div>
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--primary)] hover:bg-[var(--primary-darker)] transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    )
}