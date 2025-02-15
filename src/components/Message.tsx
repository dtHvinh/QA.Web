import {AutoAwesome} from "@mui/icons-material";
import {ChatMessage} from "@/app/chatbot/page";
import {Markdown} from "@/components/Markdown/Markdown";

export default function Message(message: ChatMessage) {
    return (
        <div>
            <div
                className={`flex items-baseline ${message.role === 'user' ? 'justify-end' : ''}`}>
                {message.role === 'assistant' &&
                    <div className={'p-1'}>
                        <AutoAwesome/>
                    </div>}
                <div
                    className={`ml-3 p-3 rounded-lg  ${message.role === 'assistant' ? 'border-l-2 text-gray-800' : ' text-black border-r-2 '}`}>
                    <Markdown>{message.content}</Markdown>
                </div>
            </div>
        </div>
    );
}