import { use } from "react";

export default function CommunityDetailPage({ params }: { params: Promise<{ name: string }> }) {
    const { name } = use(params);
    return (
        <div className="page-container mx-auto">
            <h1 className="text-black">Community Detail Page {name}</h1>
        </div>
    )
}