import React from 'react';
import sunIcon from '../assets/sun.svg';
import moonIcon from '../assets/moon.svg';
import '../styles/ThemeToggle.css';

interface ThemeToggleProps {
    isDarkMode: boolean;
    onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, onToggle }) => (
    <button className="theme-toggle" onClick={onToggle}>
        <img src={isDarkMode ? sunIcon : moonIcon} alt="Toggle Theme" />
    </button>
);
