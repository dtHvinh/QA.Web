'use client'

import { useTheme } from '@/context/ThemeContext';
import { DarkMode, LightMode } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <Tooltip title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
            <IconButton
                onClick={toggleTheme}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
                {theme === 'light' ? <DarkMode /> : <LightMode />}
            </IconButton>
        </Tooltip>
    );
}