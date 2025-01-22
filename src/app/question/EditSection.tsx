import {QuestionResponse} from "@/types/types";
import TextEditor from "@/components/TextEditor";
import React, {useState} from "react";

export default function EditSection({question}: { question: QuestionResponse }) {
    const [editContentValue, setEditContentValue] = useState(question.content);

    return (
        <div>
            <TextEditor currentText={editContentValue}
                        onTextChange={setEditContentValue}/>
        </div>
    );
}