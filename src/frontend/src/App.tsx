import { useState, useEffect } from 'react';
import './App.css';
import { Listing } from './types/Listing';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ThemeToggle } from './components/ThemeToggle';
import { SearchBar } from './components/SearchBar';
import { ListingsTable } from './components/ListingsTable';
import { formatPrice, formatDate } from './utils/formatters';
import { requestSort as sortListings } from './utils/sortUtils';

interface ParsedFilters {
    minPrice: number | null;
    maxPrice: number | null;
    minBedrooms: string;
    targetBudget: number | null;
    city: string;
}

function App() {
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<ParsedFilters | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Listing | 'relevancy'; direction: 'asc' | 'desc' } | null>({ key: 'listedDate', direction: 'desc' });
  const [expandedDescriptionId, setExpandedDescriptionId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const listingsPerPage = 10;
  
  const minPrice = allListings.length > 0 ? Math.min(...allListings.map(l => l.price)) : 0;
  const maxPrice = allListings.length > 0 ? Math.max(...allListings.map(l => l.price)) : 1000000;

  useEffect(() => {
    fetch('/api/listings')
      .then(res => res.json())
      .then(data => {
        setAllListings(data);
        setFilteredListings(data);
      });
  }, []);

    useEffect(() => {
        import('./utils/sortUtils').then(({ calculateRelevancyScore }) => {
            let result = [...allListings];
            if (searchQuery) {
                const queryParts = searchQuery.toLowerCase().split(' ').filter(part => part !== '');
                result = result.filter(l => {
                    const desc = l.description.toLowerCase();
                    return queryParts.every(part => desc.includes(part));
                });
            }
            if (activeFilters) {
                if (activeFilters.minPrice) result = result.filter(l => l.price >= Number(activeFilters.minPrice));
                if (activeFilters.maxPrice) result = result.filter(l => l.price <= Number(activeFilters.maxPrice));
                if (activeFilters.targetBudget) {
                    result = result.filter(l => l.price <= (activeFilters.targetBudget as number));
                }
                if (activeFilters.minBedrooms && activeFilters.minBedrooms !== 'Any') {
                    if (activeFilters.minBedrooms === '5+') {
                        result = result.filter(l => l.bedrooms >= 5);
                    } else {
                        result = result.filter(l => l.bedrooms >= Number(activeFilters.minBedrooms));
                    }
                }
                if (activeFilters.city) result = result.filter(l => l.city.toLowerCase().includes(activeFilters.city.toLowerCase()));
            }
            
            if (sortConfig) {
                if (sortConfig.key === 'relevancy') {
                    result.sort((a, b) => {
                        const scoreA = calculateRelevancyScore(a, activeFilters?.targetBudget || null);
                        const scoreB = calculateRelevancyScore(b, activeFilters?.targetBudget || null);
                        return sortConfig.direction === 'asc' ? scoreA - scoreB : scoreB - scoreA;
                    });
                } else {
                    result.sort((a, b) => {
                        const aValue = a[sortConfig.key as keyof Listing];
                        const bValue = b[sortConfig.key as keyof Listing];
                        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                        return 0;
                    });
                }
            }

            setFilteredListings(result);
            setCurrentPage(1);
        });
    }, [searchQuery, activeFilters, allListings, sortConfig]);

  const requestSort = (key: keyof Listing | 'relevancy') => {
      sortListings(key, sortConfig, setSortConfig);
  };

  const indexOfLastListing = currentPage * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentListings = filteredListings.slice(indexOfFirstListing, indexOfLastListing);
  const totalPages = Math.ceil(filteredListings.length / listingsPerPage);

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <Header />
      
      <ThemeToggle isDarkMode={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
      
      <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        onApplyFilters={(filters) => {
            setActiveFilters(filters);
            setIsSidebarOpen(false);
        }}
        minPriceRange={minPrice}
        maxPriceRange={maxPrice}
      />

      <ListingsTable 
        currentListings={currentListings}
        requestSort={requestSort}
        sortConfig={sortConfig}
        expandedDescriptionId={expandedDescriptionId}
        setExpandedDescriptionId={setExpandedDescriptionId}
        formatPrice={formatPrice}
        formatDate={formatDate}
        onOpenFilter={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {totalPages > 1 && (
        <div className="pagination">
            <button className="rounded-button" disabled={currentPage === 1} onClick={() => setCurrentPage(c => c - 1)}>Prev</button>
            <span>{currentPage} / {totalPages}</span>
            <button className="rounded-button" disabled={currentPage === totalPages} onClick={() => setCurrentPage(c => c + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}

export default App;
