'use client'

import { AuthProps, changeAuth, getAuthList, removeAuth } from "@/helpers/auth-utils";
import { fromImage } from "@/helpers/utils";
import { Delete } from "@mui/icons-material";
import { Avatar, Dialog } from "@mui/material";
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface ChangeProfilePopupProps {
    open: boolean;
    onClose: () => void;
}

export default function ChangeProfilePopup({ open, onClose }: ChangeProfilePopupProps) {
    const authList = getAuthList();
    const [profiles, setProfiles] = useState<AuthProps[]>([]);
    const [tabValue, setTabValue] = useState(0);
    const currentProfile = authList?.current;

    useEffect(() => {
        try {
            const p = authList?.others.filter(e => e.username !== authList.current.username) || []
            setProfiles(p);
        } catch (e) {
            setProfiles([]);
        }
    }, [])

    const handleRemoveProfile = (profile: AuthProps) => {
        removeAuth(profile)
        setProfiles(authList?.others.filter(e => e.username !== authList.current.username) || []);
    };

    const handleProfileSelect = (idx: number) => {
        changeAuth(idx)
        window.location.reload();
        onClose();
    };

    const handleClose = () => {
        if (tabValue !== 0)
            setTabValue(0);
        else
            onClose();
    };

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            slotProps={{
                paper: {
                    sx: {
                        backgroundColor: 'var(--card-background)',
                        color: 'var(--text-primary)',
                        minWidth: '360px',
                        maxWidth: '90vw',
                        overflow: 'hidden'
                    }
                }
            }}
        >
            <AnimatePresence mode="popLayout" initial={false}>
                {tabValue === 0 && (
                    <motion.div
                        key="switch-accounts"
                        initial="enter"
                        animate="center"
                        exit="exit"
                        variants={slideVariants}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="border-b border-[var(--border-color)] p-4">
                            <h2 className="text-lg font-semibold">Switch Account</h2>
                        </div>
                        <div className="py-2">
                            {currentProfile && (
                                <div className="px-4 py-3">
                                    <div className="flex items-center p-3 rounded-xl bg-[var(--primary-light)] bg-opacity-10">
                                        <Avatar
                                            src={fromImage(currentProfile.profilePicture)}
                                            sx={{
                                                width: 40,
                                                height: 40,
                                                border: '2px solid var(--primary)',
                                                bgcolor: 'var(--primary-light)'
                                            }}
                                        >
                                            {currentProfile.username?.[0]?.toUpperCase()}
                                        </Avatar>
                                        <div className="ml-3 flex-1">
                                            <div className="font-medium text-[var(--text-primary)]">{currentProfile.username}</div>
                                            <div className="text-sm text-[var(--text-secondary)]">Current</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="px-4 pt-2">
                                {profiles.length > 0 && (
                                    <div className="text-xs font-medium text-[var(--text-secondary)] px-1 pb-2">
                                        OTHER ACCOUNTS
                                    </div>
                                )}
                                {profiles.map((profile, idx) => (
                                    <div
                                        key={profile.username}
                                        className="relative group"
                                    >
                                        <button
                                            onClick={() => handleProfileSelect(idx)}
                                            className="w-full flex items-center p-3 rounded-xl hover:bg-[var(--hover-background)] transition-colors"
                                        >
                                            <Avatar
                                                src={fromImage(profile.profilePicture)}
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    border: '2px solid var(--primary-light)',
                                                    bgcolor: 'var(--primary-light)'
                                                }}
                                            >
                                                {profile.username?.[0]?.toUpperCase()}
                                            </Avatar>
                                            <div className="ml-3 flex-1 text-left">
                                                <div className="font-medium text-[var(--text-primary)]">{profile.username}</div>
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => handleRemoveProfile(profile)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all"
                                        >
                                            <Delete className="text-red-500" sx={{ fontSize: 20 }} />
                                        </button>
                                    </div>
                                ))}

                                <div className="relative group">
                                    <div className="mt-2 border-t border-[var(--border-color)]">
                                        <button
                                            onClick={() => setTabValue(1)}
                                            className="w-full active:scale-95 flex items-center gap-3 p-3 mt-2 rounded-xl hover:bg-[var(--hover-background)] transition-all text-[var(--text-primary)]"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-[var(--hover-background)] flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                                    <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
                                                    <path d="M8.256 14a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1 text-left">
                                                <div className="font-medium">Login as a different user</div>
                                                <div className="text-sm text-[var(--text-secondary)]">Add another account</div>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )
                }

                {
                    tabValue === 1 && (
                        <motion.div
                            key="login-form"
                            initial="enter"
                            animate="center"
                            exit="exit"
                            variants={slideVariants}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            <LoginForm onRegisterClick={() => setTabValue(2)} onSuccess={() => window.location.reload()} />
                        </motion.div>
                    )
                }

                {
                    tabValue === 2 && (
                        <motion.div
                            key="register-form"
                            initial="enter"
                            animate="center"
                            exit="exit"
                            variants={slideVariants}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            <RegisterForm onLoginClick={() => setTabValue(1)} onSuccess={() => window.location.reload()} />
                        </motion.div>
                    )
                }
            </AnimatePresence >
        </Dialog >
    );
}