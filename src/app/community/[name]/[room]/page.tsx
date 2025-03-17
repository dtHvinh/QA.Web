import { use } from "react";

export default function ChatRoom({ params }: { params: Promise<{ room: string }> }) {
    const { room } = use(params);

    return (
        <div>
            E {room}
        </div>
    )
}