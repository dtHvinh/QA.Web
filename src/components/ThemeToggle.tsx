'use client'

import { useTheme } from '@/context/ThemeContext';
import { DarkMode, LightMode } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme !== 'light';

    return (
        <Tooltip title={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
            <IconButton
                onClick={toggleTheme}
                className={`relative overflow-hidden rounded-full p-2 w-10 h-10
                    ${isDark ? 'bg-gray-800' : 'bg-blue-50'} 
                    transition-colors duration-500`}
            >
                <div className="relative w-full h-full flex items-center justify-center">
                    <motion.div
                        initial={false}
                        animate={{
                            x: isDark ? 0 : 20,
                            opacity: isDark ? 1 : 0,
                        }}
                        transition={{
                            duration: 0.4,
                            ease: "easeInOut",
                        }}
                        className={`absolute ${isDark ? 'text-yellow-300' : 'text-blue-600'}`}
                    >
                        <LightMode />
                    </motion.div>
                    <motion.div
                        initial={false}
                        animate={{
                            x: isDark ? -20 : 0,
                            opacity: isDark ? 0 : 1,
                        }}
                        transition={{
                            duration: 0.4,
                            ease: "easeInOut",
                        }}
                        className={`absolute ${isDark ? 'text-yellow-300' : 'text-blue-600'}`}
                    >
                        <DarkMode />
                    </motion.div>
                </div>
            </IconButton>
        </Tooltip>
    );
}