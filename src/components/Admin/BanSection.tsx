import { deleteFetcher, getFetcher, IsErrorResponse, postFetcher } from "@/helpers/request-utils";
import { BanInfoResponse, GetUserResponse } from "@/types/types";
import notifyError from "@/utilities/ToastrExtensions";
import { useEffect, useState } from "react";

interface BanRequest {
    days: number;
    hours: number;
    minutes: number;
    reason: string;
}

export default function BanSection({ user, onUserBanned, onUserUnban }:
    {
        user: GetUserResponse,
        onUserBanned: (id: number) => void
        onUserUnban: (id: number) => void
    }) {
    const [isBanned, setIsBanned] = useState(user.isBanned)
    const [banInfo, setBanInfo] = useState<BanInfoResponse>();

    const [banRequest, setBanRequest] = useState<BanRequest>({
        days: 0,
        hours: 0,
        minutes: 0,
        reason: ''
    })

    useEffect(() => {
        if (isBanned) {
            const fetchBanInfo = async () => {
                const response = await getFetcher(`/api/admin/ban-info/${user.id}`)

                if (!IsErrorResponse(response)) {
                    setBanInfo(response as BanInfoResponse)
                }
            }

            fetchBanInfo().then()
        }
    }, [isBanned])

    const handleBanUser = async () => {
        if (banRequest.days <= 0 && banRequest.hours <= 0 && banRequest.minutes <= 0)
            notifyError('Please enter a valid ban time', { vertical: "top", horizontal: "center" });
        else {
            const response = await postFetcher(`/api/admin/ban/${user.id}`, JSON.stringify(banRequest))

            if (!IsErrorResponse(response)) {
                onUserBanned(user.id)
                setIsBanned(true)
            }
        }
    }

    const handleUnBanUser = async () => {
        const response = deleteFetcher(`/api/admin/unban/${user.id}`)

        if (!IsErrorResponse(response)) {
            onUserUnban(user.id)
            setIsBanned(false)
        }
    }

    return (
        <div className="space-y-6">
            {!isBanned ? (
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">Ban User</h3>
                        <p className="text-sm text-gray-500 mt-1">Set the duration for how long this user will be banned</p>
                    </div>

                    <div className="grid gap-6">

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <label className="block text-sm font-medium text-gray-700 mb-3">Ban Duration</label>
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        max={99}
                                        min={0}
                                        defaultValue={0}
                                        onChange={(e) => setBanRequest({ ...banRequest, days: parseInt(e.target.value) })}
                                        className="w-16 h-12 text-center border rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                    />
                                    <span className="text-sm font-medium text-gray-600 w-14">Days</span>
                                </div>

                                <span className="text-gray-400 font-medium">:</span>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        max={23}
                                        min={0}
                                        defaultValue={0}
                                        onChange={(e) => setBanRequest({ ...banRequest, hours: parseInt(e.target.value) })}
                                        className="w-16 h-12 text-center border rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                    />
                                    <span className="text-sm font-medium text-gray-600 w-14">Hours</span>
                                </div>

                                <span className="text-gray-400 font-medium">:</span>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        max={59}
                                        min={0}
                                        defaultValue={0}
                                        onChange={(e) => setBanRequest({ ...banRequest, minutes: parseInt(e.target.value) })}
                                        className="w-16 h-12 text-center border rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                    />
                                    <span className="text-sm font-medium text-gray-600 w-14">Mins</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <label className="block text-sm font-medium text-gray-700 mb-3">Reason for ban</label>
                            <textarea
                                rows={3}
                                placeholder="Enter the reason for banning this user..."
                                onChange={(e) => setBanRequest({ ...banRequest, reason: e.target.value })}
                                className="w-full px-4 py-3 border rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={handleBanUser}
                                className="px-6 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors 
                                         disabled:bg-gray-300 disabled:cursor-not-allowed"
                                disabled={isBanned}
                            >
                                Ban User
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-red-50 p-6 rounded-lg space-y-4">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">User is Currently Banned</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Ban will expire on {new Date(banInfo?.endedDate || '').toLocaleString()}
                        </p>
                        {banInfo?.reason && (
                            <p className="text-sm text-gray-600 mt-2">
                                <span className="font-medium">Reason:</span> {banInfo.reason}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={handleUnBanUser}
                        className="px-6 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 
                                 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        disabled={!isBanned}
                    >
                        Unban User
                    </button>
                </div>
            )}
        </div>
    );
}    
