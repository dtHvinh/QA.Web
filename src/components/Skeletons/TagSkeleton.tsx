import { Skeleton } from "@mui/material";

export default function TagSkeleton() {
    return (
        <>
            {[...Array(12)].map((_, idx) => (
                <div key={idx} className={'flex flex-col animate-pulse'}>
                    <div className={'flex justify-between text-2xl'}>
                        <Skeleton variant="text" width={120} height={32} />
                        <div className={'flex space-x-2.5'}>
                            <Skeleton variant="rounded" width={60} height={32} />
                            <Skeleton variant="rounded" width={60} height={32} />
                        </div>
                    </div>
                    <div className={'my-6'}>
                        <Skeleton variant="text" width="100%" height={20} />
                        <Skeleton variant="text" width="100%" height={20} />
                        <Skeleton variant="text" width="80%" height={20} />
                    </div>
                    <div className={'w-full mt-auto flex flex-col gap-3'}>
                        <Skeleton variant="text" width={100} height={24} />
                    </div>
                </div>
            ))}
        </>
    );
}