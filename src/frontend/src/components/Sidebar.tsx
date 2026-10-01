import {useState} from 'react';
import '../styles/Sidebar.css';

interface Filters {
    minPrice: string;
    maxPrice: string;
    minBedrooms: string;
    targetBudget: string;
    city: string;
}

interface ParsedFilters {
    minPrice: number | null;
    maxPrice: number | null;
    minBedrooms: string;
    targetBudget: number | null;
    city: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onApplyFilters: (filters: ParsedFilters) => void;
    minPriceRange: number;
    maxPriceRange: number;
}

export const parseBudget = (budget: string) => {
    if (!budget) return null;
    let val = budget.toLowerCase();
    if (val.endsWith('k')) {
        return parseFloat(val) * 1000;
    }
    return parseFloat(val);
};

export const Sidebar = ({ isOpen, onClose, onApplyFilters, minPriceRange, maxPriceRange }: Props) => {
    const [filters, setFilters] = useState<Filters>({
        minPrice: minPriceRange.toString(),
        maxPrice: maxPriceRange.toString(),
        minBedrooms: 'Any',
        targetBudget: '',
        city: ''
    });

    const handlePriceChange = (field: 'minPrice' | 'maxPrice', value: string) => {
        let numericValue = value === '' ? '' : Math.max(0, parseInt(value, 10)).toString();
        
        let newFilters = { ...filters, [field]: numericValue };

        const min = parseInt(newFilters.minPrice, 10) || 0;
        const max = parseInt(newFilters.maxPrice, 10) || 1000000;

        // Validation for price range
        if (field === 'minPrice' && min > max) {
            newFilters.minPrice = newFilters.maxPrice;
        } else if (field === 'maxPrice' && max < min) {
            newFilters.maxPrice = newFilters.minPrice;
        }

        setFilters(newFilters);
    };

    const handleTargetBudgetChange = (value: string) => {
        // Keep the raw value in the box (e.g., '425k')
        // We'll parse it during filtering
        setFilters({ ...filters, targetBudget: value });
    };

    if (!isOpen) return null;

    return (
        <div className="sidebar-container">
            <div className="sidebar-content">
                <h2>Filters</h2>

                <div className="filter-group">
                    <label>Target Budget</label>
                    <br/>
                    <input placeholder="Target Budget" value={filters.targetBudget} onChange={e => handleTargetBudgetChange(e.target.value)} />
                </div>

                <div className="filter-group">
                    <label>Price Range</label>
                    <div className="price-inputs">
                        <input type="number" placeholder="Min" value={filters.minPrice} onChange={e => handlePriceChange('minPrice', e.target.value)} />
                        <input type="number" placeholder="Max" value={filters.maxPrice} onChange={e => handlePriceChange('maxPrice', e.target.value)} />
                    </div>
                    <div className="slider-wrapper" style={{ position: 'relative', height: '30px', marginTop: '10px' }}>
                        <input type="range" className="slider-input" min={minPriceRange} max={maxPriceRange} step="1000" value={filters.minPrice || minPriceRange} onChange={e => handlePriceChange('minPrice', e.target.value)} />
                        <input type="range" className="slider-input" min={minPriceRange} max={maxPriceRange} step="1000" value={filters.maxPrice || maxPriceRange} onChange={e => handlePriceChange('maxPrice', e.target.value)} />
                    </div>
                </div>

                <div className="filter-group">
                    <label>Bedrooms</label>
                    <div className="bedroom-options">
                        {['Any', '1', '2', '3', '4', '5+'].map(option => (
                            <button 
                                key={option} 
                                className={filters.minBedrooms === option ? 'active' : ''}
                                onClick={() => setFilters({...filters, minBedrooms: option})}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="filter-group">
                    <label>City</label>
                    <br/>
                    <input placeholder="City" value={filters.city} onChange={e => setFilters({...filters, city: e.target.value})} />
                </div>
            </div>

            <div className="sidebar-footer">
                <button className="rounded-button clear-button" onClick={() => {
                    const clearedFilters = { minPrice: '', maxPrice: '', minBedrooms: 'Any', targetBudget: '', city: '' };
                    setFilters(clearedFilters);
                    onApplyFilters({
                        minPrice: null,
                        maxPrice: null,
                        minBedrooms: 'Any',
                        targetBudget: null,
                        city: ''
                    });
                    onClose();
                }}>Clear All</button>
                <button className="rounded-button view-button" onClick={() => onApplyFilters({
                    minPrice: filters.minPrice ? Number(filters.minPrice) : null,
                    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : null,
                    minBedrooms: filters.minBedrooms,
                    targetBudget: parseBudget(filters.targetBudget),
                    city: filters.city
                })}>View</button>
            </div>
        </div>
    );
};
