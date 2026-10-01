import React from 'react';
import { Listing } from '../types/Listing';
import '../styles/ListingsTable.css';

interface ListingsTableProps {
    currentListings: Listing[];
    requestSort: (key: keyof Listing | 'relevancy') => void;
    sortConfig: { key: keyof Listing | 'relevancy'; direction: 'asc' | 'desc' } | null;
    expandedDescriptionId: string | null;
    setExpandedDescriptionId: (id: string | null) => void;
    formatPrice: (price: number) => string;
    formatDate: (dateString: string) => string;
    onOpenFilter: () => void;
}

export const ListingsTable: React.FC<ListingsTableProps> = ({ 
    currentListings, requestSort, sortConfig, expandedDescriptionId, setExpandedDescriptionId, 
    formatPrice, formatDate, onOpenFilter 
}) => {
    const getSortIndicator = (key: keyof Listing | 'relevancy') => {
        if (sortConfig && sortConfig.key === key) {
            return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
        }
        return '';
    };

    return (
    <div className="table-wrapper">
        <button className="filter-button" onClick={onOpenFilter}>Filter</button>
        <button className="filter-button" style={{right: '80px'}} onClick={() => requestSort('relevancy')}>Sort by Relevancy</button>
        <div className="table-container">
            <table className="listings-table">
            <thead>
            <tr>
                <th onClick={() => requestSort('address')}>Address{getSortIndicator('address')}</th>
                <th onClick={() => requestSort('city')}>City, State{getSortIndicator('city')}</th>
                <th onClick={() => requestSort('price')}>Price{getSortIndicator('price')}</th>
                <th onClick={() => requestSort('bedrooms')}>Bedrooms{getSortIndicator('bedrooms')}</th>
                <th onClick={() => requestSort('bathrooms')}>Bathrooms{getSortIndicator('bathrooms')}</th>
                <th onClick={() => requestSort('sqft')}>SqFt{getSortIndicator('sqft')}</th>
                <th onClick={() => requestSort('listedDate')}>Date Listed{getSortIndicator('listedDate')}</th>
                <th onClick={() => requestSort('status')}>Status{getSortIndicator('status')}</th>
                <th>Description</th>
            </tr>
            </thead>
            <tbody>
            {currentListings.length > 0 ? (
                currentListings.map(listing => (
                <tr key={listing.id}>
                    <td>{listing.address}</td>
                    <td title={listing.zip}>{listing.city}, {listing.state}</td>
                    <td title={listing.price.toLocaleString()}>{formatPrice(listing.price)}</td>
                    <td>{listing.bedrooms}</td>
                    <td>{listing.bathrooms}</td>
                    <td>{listing.sqft}</td>
                    <td title={formatDate(listing.listedDate)}>{formatDate(listing.listedDate)}</td>
                    <td>{listing.status}</td>
                    <td>
                        {listing.description.length > 200 && expandedDescriptionId !== listing.id ? (
                            <>
                                {listing.description.substring(0, 200)}...
                                <button onClick={() => setExpandedDescriptionId(listing.id)}>Expand</button>
                            </>
                        ) : (
                            <>
                                {listing.description}
                                {listing.description.length > 200 && <button onClick={() => setExpandedDescriptionId(null)}>Collapse</button>}
                            </>
                        )}
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                <td colSpan={9}>No results</td>
                </tr>
            )}
            </tbody>
        </table>
        </div>
    </div>
    );
};
