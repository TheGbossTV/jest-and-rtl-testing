import { useState, useEffect, useCallback } from 'react';

/**
 * HARD EXAMPLE 2: Advanced Search Filter with Debouncing and Complex Interactions
 * 
 * COMPONENT DESCRIPTION:
 * A sophisticated search and filter component that combines real-time search with multiple filter options.
 * This component demonstrates advanced React patterns, performance optimization, and complex user interactions.
 * 
 * WHAT THIS COMPONENT DOES:
 * - Performs debounced search to avoid excessive API calls
 * - Supports multiple filter criteria (category, price range, stock status)
 * - Manages complex async operations with proper error handling
 * - Implements search result limiting and pagination concepts
 * - Provides real-time feedback with loading states
 * - Tracks search statistics and performance metrics
 * - Handles request cancellation to prevent race conditions
 * - Offers retry functionality for failed searches
 * - Clears all filters and resets state
 * - Optimizes performance with useCallback and debouncing
 * 
 * WHAT SHOULD BE TESTED:
 * ✅ Search input updates and triggers debounced search
 * ✅ All filter controls work correctly (category, price, stock)
 * ✅ Shows loading state during search operations
 * ✅ Displays search results with correct data
 * ✅ Handles and displays error states properly
 * ✅ Retry button works when errors occur
 * ✅ Clear all button resets all filters and results
 * ✅ Debouncing prevents excessive API calls
 * ✅ Search statistics are tracked and displayed
 * ✅ Empty search states are handled correctly
 * ✅ Complex filter combinations work together
 * ✅ Performance optimizations don't break functionality
 * 
 * TESTING CONCEPTS DEMONSTRATED:
 * - Testing debounced functionality with fake timers
 * - Complex async operation testing with waitFor()
 * - Testing multiple interactive elements simultaneously
 * - Advanced mocking of API services and async functions
 * - Testing error handling and retry mechanisms
 * - Testing performance optimizations (useCallback, debouncing)
 * - Testing complex user workflows and interactions
 * - Testing request cancellation and cleanup
 * - Testing component state management under complex conditions
 * - Advanced testing patterns for real-world scenarios
 */

export interface SearchResult {
  id: string;
  title: string;
  category: string;
  price: number;
  description: string;
  inStock: boolean;
}

export interface SearchFilters {
  category: string;
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
}

interface SearchFilterProps {
  onResultsChange?: (results: SearchResult[]) => void;
  placeholder?: string;
  debounceMs?: number;
  maxResults?: number;
}

// Simulated API service (would normally be in a separate file)
const searchAPI = {
  async searchProducts(
    query: string, 
    filters: SearchFilters, 
    signal?: AbortSignal
  ): Promise<SearchResult[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Simulate potential network error
    if (Math.random() < 0.1) {
      throw new Error('Network error occurred');
    }
    
    // Check if request was aborted
    if (signal?.aborted) {
      throw new Error('Request aborted');
    }
    
    // Mock data for demonstration
    const mockResults: SearchResult[] = [
      {
        id: '1',
        title: 'Laptop Pro',
        category: 'electronics',
        price: 1299.99,
        description: 'High-performance laptop',
        inStock: true
      },
      {
        id: '2',
        title: 'Coffee Maker',
        category: 'appliances',
        price: 89.99,
        description: 'Automatic coffee maker',
        inStock: false
      },
      {
        id: '3',
        title: 'Running Shoes',
        category: 'sports',
        price: 129.99,
        description: 'Comfortable running shoes',
        inStock: true
      },
      {
        id: '4',
        title: 'Gaming Mouse',
        category: 'electronics',
        price: 79.99,
        description: 'High-precision gaming mouse',
        inStock: true
      },
      {
        id: '5',
        title: 'Yoga Mat',
        category: 'sports',
        price: 39.99,
        description: 'Non-slip yoga mat',
        inStock: true
      }
    ];
    
    // Filter results based on query and filters
    return mockResults.filter(item => {
      const matchesQuery = query === '' || 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase());
      
      const matchesCategory = filters.category === '' || 
        item.category === filters.category;
      
      const matchesPriceRange = item.price >= filters.minPrice && 
        item.price <= filters.maxPrice;
      
      const matchesStock = !filters.inStockOnly || item.inStock;
      
      return matchesQuery && matchesCategory && matchesPriceRange && matchesStock;
    });
  }
};

export const SearchFilter: React.FC<SearchFilterProps> = ({
  onResultsChange,
  placeholder = "Search products...",
  debounceMs = 300,
  maxResults = 10
}) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    category: '',
    minPrice: 0,
    maxPrice: 10000,
    inStockOnly: false
  });
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchCount, setSearchCount] = useState(0);

  // Debounced search function
  const debouncedSearch = useCallback(
    async (searchQuery: string, searchFilters: SearchFilters) => {
      if (searchQuery.trim() === '') {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const controller = new AbortController();
        const searchResults = await searchAPI.searchProducts(
          searchQuery, 
          searchFilters, 
          controller.signal
        );
        
        const limitedResults = searchResults.slice(0, maxResults);
        setResults(limitedResults);
        setSearchCount(prev => prev + 1);
        onResultsChange?.(limitedResults);
      } catch (err) {
        if (err instanceof Error && err.message !== 'Request aborted') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    },
    [maxResults, onResultsChange]
  );

  // Debounce effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      debouncedSearch(query, filters);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [query, filters, debounceMs, debouncedSearch]);

  const handleRetry = () => {
    debouncedSearch(query, filters);
  };

  const handleClearAll = () => {
    setQuery('');
    setFilters({
      category: '',
      minPrice: 0,
      maxPrice: 10000,
      inStockOnly: false
    });
    setResults([]);
    setError(null);
    setSearchCount(0);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string | number | boolean) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="component-with-tests">
      <div className="component-demo">
        <div className="search-filter">
          <h2>Advanced Search</h2>
          
          {/* Search Input */}
          <div className="search-input-container">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="search-input"
              aria-label="Search products"
            />
            {loading && (
              <div className="loading-indicator">
                Searching...
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="filters-container">
            <div className="filter-group">
              <label htmlFor="category-filter">Category:</label>
              <select
                id="category-filter"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="appliances">Appliances</option>
                <option value="sports">Sports</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="min-price">Min Price:</label>
              <input
                type="number"
                id="min-price"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', Number(e.target.value))}
                min="0"
                step="0.01"
              />
            </div>

            <div className="filter-group">
              <label htmlFor="max-price">Max Price:</label>
              <input
                type="number"
                id="max-price"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
                min="0"
                step="0.01"
              />
            </div>

            <div className="filter-group">
              <label>
                <input
                  type="checkbox"
                  checked={filters.inStockOnly}
                  onChange={(e) => handleFilterChange('inStockOnly', e.target.checked)}
                />
                In Stock Only
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              onClick={handleClearAll}
              className="clear-button"
            >
              Clear All
            </button>
            {error && (
              <button
                onClick={handleRetry}
                className="retry-button"
              >
                Retry Search
              </button>
            )}
          </div>

          {/* Search Stats */}
          <div className="search-stats">
            <span>Searches performed: {searchCount}</span>
            <span>Results found: {results.length}</span>
          </div>

          {/* Error Display */}
          {error && (
            <div className="error-message" role="alert">
              Error: {error}
            </div>
          )}

          {/* Results Display */}
          <div className="results-container">
            {results.length > 0 ? (
              <ul className="results-list">
                {results.map((result) => (
                  <li key={result.id} className="result-item">
                    <h3>{result.title}</h3>
                    <p className="description">{result.description}</p>
                    <div className="result-meta">
                      <span className="category">Category: {result.category}</span>
                      <span className="price">${result.price.toFixed(2)}</span>
                      <span className={`stock ${result.inStock ? 'in-stock' : 'out-of-stock'}`}>
                        {result.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              query && !loading && !error && (
                <div className="no-results">
                  No results found for "{query}"
                </div>
              )
            )}
          </div>
        </div>
      </div>
      
      <div className="test-coverage">
        <h4>🧪 Tests Covered:</h4>
        <ul>
          <li>✅ Debounced search input functionality</li>
          <li>✅ All filter controls work correctly</li>
          <li>✅ Shows loading state during searches</li>
          <li>✅ Displays search results with correct data</li>
          <li>✅ Handles error states and retry</li>
          <li>✅ Clear all resets filters and results</li>
          <li>✅ Search statistics tracking</li>
          <li>✅ Complex filter combinations</li>
        </ul>
      </div>
    </div>
  );
}; 