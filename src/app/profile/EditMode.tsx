import getAuth from "@/helpers/auth-utils";
import { countTotalDays } from "@/helpers/time-utils";
import { UserResponse } from "@/types/types";
import { Edit, Save } from "@mui/icons-material";
import { Avatar, Tooltip } from "@mui/material";
import React, { useState } from "react";

const EditMode = ({ profile, onEditModeClick }: { profile: UserResponse, onEditModeClick: () => void }) => {
    const auth = getAuth()

    const [editedName, setEditedName] = useState(profile.username)

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
                <div className={'flex space-x-6 items-center'}>
                    <Avatar variant={'square'}
                        src={auth?.profilePicture}
                        component={'div'}
                        alt="Profile Picture"
                        sx={{ width: 80, height: 80 }} />
                    <div>
                        <input
                            spellCheck='false'
                            autoFocus
                            placeholder="Username"
                            required
                            className="text-xl font-bold border border-black rounded-lg px-3" value={editedName} onChange={(e) => setEditedName(e.target.value)} />
                        <div className="mt-2 space-x-2.5">
                            <span className={'text-gray-500'}>external links:</span>
                            <input
                                type="url"
                                placeholder="Website URL"
                                className="text-xl border border-black rounded-lg px-3"
                            />
                            <input
                                type="url"
                                placeholder="GitHub URL"
                                className="text-xl border border-black rounded-lg px-3"
                            />
                        </div>

                        <div>
                            <span
                                className={'mt-2 text-gray-500'}>Joined {countTotalDays(profile.dateJoined)}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 flex-row">
                    <Tooltip title={'Save Change'} onClick={onEditModeClick}>
                        <button>
                            <Save />
                        </button>
                    </Tooltip>

                    <Tooltip title={'Edit'} onClick={onEditModeClick}>
                        <button onClick={onEditModeClick}>
                            <Edit />
                        </button>
                    </Tooltip>
                </div>
            </div>
        </div>
    )
}

export default EditMode