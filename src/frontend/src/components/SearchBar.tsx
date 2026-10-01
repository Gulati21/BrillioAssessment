import React from 'react';
import '../styles/SearchBar.css';

interface SearchBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onSearchChange }) => (
    <div className="search-container">
        <input 
            className="search-bar"
            type="text" 
            placeholder="Search description..." 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
        />
    </div>
);
