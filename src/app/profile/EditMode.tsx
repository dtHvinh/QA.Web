import getAuth, { updateCurrentAuthPfp, updateCurrentAuthUsername } from "@/helpers/auth-utils";
import { formPutFetcher, IsErrorResponse, putFetcher } from "@/helpers/request-utils";
import { countTotalDays } from "@/helpers/time-utils";
import { fromImage } from "@/helpers/utils";
import { ExternalLinkResponse, TextResponse, UserResponse } from "@/types/types";
import notifyError, { notifySucceed } from "@/utilities/ToastrExtensions";
import { Add, AddPhotoAlternate, Cancel, Delete, Save } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import { FormEvent, useEffect, useState } from "react";


interface EditModeProps {
    profile: UserResponse;
    externalLinks: ExternalLinkResponse[];
    onEditModeClick: () => void;
    onSocialLinksChange?: (links: ExternalLinkResponse[]) => void;
    onUsernameChange?: (username: string) => void;
    onProfilePictureChange?: (profilePicture: string) => void;
};

const EditMode = ({
    profile,
    onEditModeClick,
    onUsernameChange,
    onSocialLinksChange,
    onProfilePictureChange,
    externalLinks
}: Readonly<EditModeProps>) => {
    const auth = getAuth()
    const [editedName, setEditedName] = useState(profile.userName)
    const [socialLinks, setSocialLinks] = useState<ExternalLinkResponse[]>(externalLinks ?? []);
    const [anyChange, setAnyChange] = useState(false)
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [profilePreview, setProfilePreview] = useState(auth?.profilePicture || '');
    const maxLinks = 5

    useEffect(() => {
        setAnyChange(editedName != profile.userName || JSON.stringify(socialLinks) != JSON.stringify(externalLinks))
    }, [editedName, socialLinks])

    const handleLinkChange = (index: number, field: keyof ExternalLinkResponse, value: string) => {
        const updatedLinks = [...socialLinks];
        updatedLinks[index][field] = value;
        setSocialLinks(updatedLinks);
    };

    const addNewLink = () => {
        if (socialLinks.length == maxLinks)
            notifyError("Max links reached")
        else
            setSocialLinks([...socialLinks, { id: '0', provider: "", url: "" }]);
    }

    const removeLink = (index: number) => {
        const updatedLinks = [...socialLinks];
        updatedLinks.splice(index, 1);
        setSocialLinks(updatedLinks);
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('profilePicture', file);

            const res = await formPutFetcher('/api/user/profile-picture', formData);

            if (!IsErrorResponse(res)) {
                const previewUrl = URL.createObjectURL(file);
                setProfilePreview(previewUrl);
                onProfilePictureChange?.(previewUrl);
                notifySucceed("Profile picture updated");

                updateCurrentAuthPfp((res as TextResponse).message)
            }
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const updateData = {
            username: editedName,
            links: socialLinks
        };

        const res = await putFetcher('/api/user', JSON.stringify(updateData));

        if (!IsErrorResponse(res)) {
            notifySucceed("Profile updated")
            onEditModeClick()
            onSocialLinksChange?.(socialLinks)
            onUsernameChange?.(editedName)

            updateCurrentAuthUsername(editedName)
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="bg-[var(--card-background)] rounded-xl shadow-sm border border-[var(--border-color)] overflow-hidden">
                <div className="bg-transparent h-32"></div>
                <div className="px-6 pb-6">
                    <div className="flex flex-col sm:flex-row sm:items-end -mt-16 mb-6 gap-4">
                        <div className="relative group">
                            <Avatar
                                variant="rounded"
                                src={fromImage(profile.profilePicture)}
                                alt={profile.userName}
                                sx={{
                                    width: 120,
                                    height: 120,
                                    border: '4px solid var(--card-background)',
                                    backgroundColor: 'var(--hover-background)',
                                    boxShadow: 'var(--shadow-sm)'
                                }}
                            />
                            <label className="absolute inset-0 flex items-center justify-center bg-black/50 
                                opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg">
                                <AddPhotoAlternate className="text-white" />
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>
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
                                        className="w-full px-4 py-2  bg-[var(--input-background)] text-[var(--text-primary)] rounded-lg border-black border-2"
                                        onChange={(e) => setEditedName(e.target.value)}
                                        defaultValue={profile.userName}
                                    />
                                </div>
                            </div>
                            <div className="mt-2 text-[var(--text-secondary)]">
                                Member for {countTotalDays(profile.creationDate)}
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
