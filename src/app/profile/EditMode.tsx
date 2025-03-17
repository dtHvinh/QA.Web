import getAuth from "@/helpers/auth-utils";
import { IsErrorResponse, putFetcher } from "@/helpers/request-utils";
import { countTotalDays } from "@/helpers/time-utils";
import { ExternalLinkResponse, UserResponse } from "@/types/types";
import notifyError, { notifySucceed } from "@/utilities/ToastrExtensions";
import { Add, Cancel, Delete, Save } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import { FormEvent, useEffect, useState } from "react";


interface EditModeProps {
    profile: UserResponse;
    externalLinks: ExternalLinkResponse[];
    onEditModeClick: () => void;
    onSocialLinksChange?: (links: ExternalLinkResponse[]) => void;
    onUsernameChange?: (username: string) => void;
};

const EditMode = (
    {
        profile,
        onEditModeClick,
        onUsernameChange,
        onSocialLinksChange,
        externalLinks
    }: Readonly<EditModeProps>) => {
    const auth = getAuth()
    const [editedName, setEditedName] = useState(profile.username)
    const [socialLinks, setSocialLinks] = useState<ExternalLinkResponse[]>(externalLinks ?? []);
    const [anyChange, setAnyChange] = useState(false)
    const maxLinks = 5

    const requestUrl = "/api/user/"

    useEffect(() => {
        setAnyChange(editedName != profile.username || JSON.stringify(socialLinks) != JSON.stringify(externalLinks))
    }, [editedName, socialLinks])

    const handleLinkChange = (index: number, field: keyof ExternalLinkResponse, value: string) => {
        const updatedLinks = [...socialLinks];
        updatedLinks[index][field] = value;
        setSocialLinks(updatedLinks);
    };

    const addNewLink = () => {
        if (socialLinks.length == maxLinks)
            notifyError("Max links reached", { vertical: "top", horizontal: "center" }, 0.5)
        else
            setSocialLinks([...socialLinks, { id: '0', provider: "", url: "" }]);
    }

    const removeLink = (index: number) => {
        const updatedLinks = [...socialLinks];
        updatedLinks.splice(index, 1);
        setSocialLinks(updatedLinks);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const updateObject = {
            username: editedName,
            links: socialLinks
        }

        const res = await putFetcher(['/api/user', auth!.accessToken, JSON.stringify(updateObject)]);

        if (!IsErrorResponse(res)) {
            notifySucceed("Profile updated", { vertical: "top", horizontal: "center" }, 1)
            onEditModeClick()
            onSocialLinksChange?.(socialLinks)
            onUsernameChange?.(editedName)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="bg-[var(--card-background)] rounded-xl shadow-sm border border-[var(--border-color)] overflow-hidden">
                <div className="bg-transparent h-32"></div>
                <div className="px-6 pb-6">
                    <div className="flex flex-col sm:flex-row sm:items-end -mt-16 mb-6 gap-4">
                        <Avatar
                            variant="rounded"
                            src={auth?.profilePicture}
                            alt={profile.username}
                            sx={{
                                width: 120,
                                height: 120,
                                border: '4px solid var(--card-background)',
                                backgroundColor: 'var(--hover-background)',
                                boxShadow: 'var(--shadow-sm)'
                            }}
                        />
                        <div className="flex-grow mt-4 sm:mt-0">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                <div className="w-full max-w-md">
                                    <label htmlFor="username" className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                                        Username
                                    </label>
                                    <input
                                        id="username"
                                        type="text"
                                        spellCheck="false"
                                        autoFocus
                                        className="w-full px-4 py-2 border border-[var(--border-color)] bg-[var(--input-background)] text-[var(--text-primary)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        onChange={(e) => setEditedName(e.target.value)}
                                        defaultValue={profile.username}
                                    />
                                </div>
                            </div>
                            <div className="mt-2 text-[var(--text-secondary)]">
                                Member for {countTotalDays(profile.createdAt)} days
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 mt-6">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-[var(--text-primary)]">
                                    External Links
                                </label>
                                <button
                                    type="button"
                                    onClick={addNewLink}
                                    className="flex items-center gap-1 text-sm text-[var(--primary)] hover:text-[var(--primary-darker)]"
                                >
                                    <Add fontSize="small" />
                                    Add Link
                                </button>
                            </div>

                            {socialLinks.map((link, index) => (
                                <div key={index} className="flex gap-2 mb-3">
                                    <div className="w-1/3">
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-2 border border-[var(--border-color)] bg-[var(--input-background)] text-[var(--text-primary)] rounded-lg transition-colors"
                                            value={link.provider}
                                            onChange={(e) => handleLinkChange(index, 'provider', e.target.value)}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="url"
                                            spellCheck="false"
                                            required
                                            className="w-full px-4 py-2 border border-[var(--border-color)] bg-[var(--input-background)] text-[var(--text-primary)] rounded-lg transition-colors"
                                            placeholder="https://example.com"
                                            value={link.url}
                                            onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeLink(index)}
                                        className="p-2 text-[var(--text-secondary)] hover:text-[var(--error)] transition-colors"
                                    >
                                        <Delete fontSize="small" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                        <button
                            onClick={onEditModeClick}
                            className="flex items-center gap-2 px-4 py-2 bg-[var(--hover-background)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--hover-background-darker)] transition-colors"
                        >
                            <Cancel fontSize="small" />
                            <span>Cancel</span>
                        </button>
                        <button
                            type="submit"
                            disabled={!anyChange}
                            className="flex items-center gap-2 px-4 py-2 disabled:bg-[var(--disabled-background)] bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Save fontSize="small" />
                            <span>Save Changes</span>
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}
export default EditMode
