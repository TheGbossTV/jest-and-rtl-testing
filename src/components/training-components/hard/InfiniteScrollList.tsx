import React, { useState, useEffect, useCallback, useRef } from 'react';

interface ListItem {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
  category: string;
  priority: 'low' | 'medium' | 'high';
}

interface InfiniteScrollListProps {
  itemsPerPage?: number;
  onLoadMore?: (page: number) => Promise<ListItem[]>;
  onItemClick?: (item: ListItem) => void;
  filterCategory?: string;
  sortBy?: 'timestamp' | 'priority' | 'title';
  sortOrder?: 'asc' | 'desc';
  virtualScrolling?: boolean;
}

const InfiniteScrollList: React.FC<InfiniteScrollListProps> = ({
  itemsPerPage = 20,
  onLoadMore,
  onItemClick,
  filterCategory,
  sortBy = 'timestamp',
  sortOrder = 'desc',
  virtualScrolling = true
}) => {
  const [items, setItems] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 50 });
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const itemHeight = 120;

  const generateMockData = useCallback((page: number, limit: number): ListItem[] => {
    const categories = ['work', 'personal', 'urgent', 'ideas', 'shopping'];
    const priorities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
    
    return Array.from({ length: limit }, (_, index) => {
      const itemId = page * limit + index;
      return {
        id: `item-${itemId}`,
        title: `Item ${itemId + 1}`,
        content: `This is the content for item ${itemId + 1}. It contains some mock data for testing purposes.`,
        timestamp: new Date(Date.now() - Math.random() * 1000000000),
        category: categories[Math.floor(Math.random() * categories.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)]
      };
    });
  }, []);

  const loadItems = useCallback(async (page: number) => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let newItems: ListItem[];
      
      if (onLoadMore) {
        newItems = await onLoadMore(page);
      } else {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        newItems = generateMockData(page, itemsPerPage);
      }
      
      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setItems(prev => [...prev, ...newItems]);
        setCurrentPage(page);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load items');
    } finally {
      setLoading(false);
    }
  }, [loading, onLoadMore, generateMockData, itemsPerPage]);

  // Initial load
  useEffect(() => {
    loadItems(0);
  }, []);

  // Filter and sort items
  const processedItems = React.useMemo(() => {
    let filtered = items;
    
    if (filterCategory) {
      filtered = items.filter(item => item.category === filterCategory);
    }
    
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'timestamp':
          comparison = a.timestamp.getTime() - b.timestamp.getTime();
          break;
                 case 'priority': {
           const priorityOrder = { low: 1, medium: 2, high: 3 };
           comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
           break;
         }
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  }, [items, filterCategory, sortBy, sortOrder]);

  // Virtual scrolling calculation
  const calculateVisibleRange = useCallback(() => {
    if (!scrollContainerRef.current || !virtualScrolling) return;
    
    const container = scrollContainerRef.current;
    const scrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;
    
    const start = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const end = Math.min(start + visibleCount + 5, processedItems.length); // Buffer
    
    setVisibleRange({ start: Math.max(0, start - 5), end });
  }, [processedItems.length, itemHeight, virtualScrolling]);

  // Scroll event handler
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const threshold = 200;
    
    // Check if near bottom for infinite scroll
    if (container.scrollTop + container.clientHeight >= container.scrollHeight - threshold) {
      if (hasMore && !loading) {
        loadItems(currentPage + 1);
      }
    }
    
    // Update visible range for virtual scrolling
    calculateVisibleRange();
  }, [hasMore, loading, currentPage, loadItems, calculateVisibleRange]);

  // Debounced scroll handler
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    let timeoutId: NodeJS.Timeout;
    
    const debouncedScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 10);
    };
    
    container.addEventListener('scroll', debouncedScroll);
    
    return () => {
      container.removeEventListener('scroll', debouncedScroll);
      clearTimeout(timeoutId);
    };
  }, [handleScroll]);

  // Intersection Observer for loading trigger
  useEffect(() => {
    if (!loadingRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadItems(currentPage + 1);
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(loadingRef.current);
    
    return () => observer.disconnect();
  }, [hasMore, loading, currentPage, loadItems]);

  const handleItemClick = (item: ListItem) => {
    onItemClick?.(item);
  };

  const visibleItems = virtualScrolling 
    ? processedItems.slice(visibleRange.start, visibleRange.end)
    : processedItems;

  const totalHeight = processedItems.length * itemHeight;
  const offsetY = virtualScrolling ? visibleRange.start * itemHeight : 0;

  return (
    <div className="infinite-scroll-list" data-testid="infinite-scroll-list">
      <div className="list-info" data-testid="list-info">
        <span>Total items: {processedItems.length}</span>
        {filterCategory && <span>Filter: {filterCategory}</span>}
        <span>Sort: {sortBy} ({sortOrder})</span>
      </div>
      
      <div 
        ref={scrollContainerRef}
        className="scroll-container"
        data-testid="scroll-container"
        style={{ height: '400px', overflow: 'auto' }}
      >
        {virtualScrolling && (
          <div style={{ height: totalHeight, position: 'relative' }}>
            <div 
              style={{ 
                transform: `translateY(${offsetY}px)`,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0
              }}
            >
                             {visibleItems.map((item) => (
                <div
                  key={item.id}
                  className={`list-item priority-${item.priority}`}
                  data-testid={`list-item-${item.id}`}
                  onClick={() => handleItemClick(item)}
                  style={{ height: itemHeight }}
                >
                  <div className="item-header">
                    <h4>{item.title}</h4>
                    <span className={`priority-badge ${item.priority}`}>
                      {item.priority}
                    </span>
                  </div>
                  <p className="item-content">{item.content}</p>
                  <div className="item-meta">
                    <span className="category">{item.category}</span>
                    <span className="timestamp">
                      {item.timestamp.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {!virtualScrolling && (
          <>
            {visibleItems.map((item) => (
              <div
                key={item.id}
                className={`list-item priority-${item.priority}`}
                data-testid={`list-item-${item.id}`}
                onClick={() => handleItemClick(item)}
              >
                <div className="item-header">
                  <h4>{item.title}</h4>
                  <span className={`priority-badge ${item.priority}`}>
                    {item.priority}
                  </span>
                </div>
                <p className="item-content">{item.content}</p>
                <div className="item-meta">
                  <span className="category">{item.category}</span>
                  <span className="timestamp">
                    {item.timestamp.toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </>
        )}
        
        {loading && (
          <div className="loading-indicator" data-testid="loading-indicator">
            Loading more items...
          </div>
        )}
        
        {error && (
          <div className="error-message" data-testid="error-message">
            {error}
          </div>
        )}
        
        {!hasMore && !loading && (
          <div className="end-message" data-testid="end-message">
            No more items to load
          </div>
        )}
        
        <div ref={loadingRef} style={{ height: '1px' }} />
      </div>
    </div>
  );
};

export default InfiniteScrollList; 