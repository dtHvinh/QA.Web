export default function MemberLoadingSkeleton() {
    return (
        <div className="space-y-3">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-[var(--hover-background)]" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 w-32 bg-[var(--hover-background)] rounded" />
                        <div className="h-3 w-20 bg-[var(--hover-background)] rounded" />
                    </div>
                </div>
            ))}
        </div>
    )
}