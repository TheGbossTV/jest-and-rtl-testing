import React, { useState, useEffect, useCallback } from "react";

interface ApiResponse<T> {
  data: T;
  status: "success" | "error";
  message?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user" | "guest";
}

interface AsyncDataFetcherProps {
  endpoint: string;
  onDataLoad?: (data: User[]) => void;
  onError?: (error: Error) => void;
  retryAttempts?: number;
  refreshInterval?: number;
  filterRole?: "admin" | "user" | "guest" | null;
  returnEmpty?: boolean;
}

const AsyncDataFetcher: React.FC<AsyncDataFetcherProps> = ({
  endpoint,
  onDataLoad,
  onError,
  retryAttempts = 3,
  refreshInterval = 0,
  filterRole = null,
  returnEmpty = false,
}) => {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  const mockFetch = useCallback(
    async (url: string, signal: AbortSignal): Promise<ApiResponse<User[]>> => {
      console.log("mockFetch", url);

      // Simulate network delay
      await new Promise((resolve) =>
        setTimeout(resolve, Math.random() * 1000 + 500)
      );

      if (signal.aborted) {
        throw new Error("Request was aborted");
      }

      // Simulate random failures for testing
      if (Math.random() < 0.3) {
        throw new Error("Network error: Failed to fetch data");
      }

      // Mock data
      const mockUsers: User[] = [
        { id: 1, name: "John Doe", email: "john@example.com", role: "admin" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", role: "user" },
        { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "guest" },
        {
          id: 4,
          name: "Alice Brown",
          email: "alice@example.com",
          role: "user",
        },
        {
          id: 5,
          name: "Charlie Wilson",
          email: "charlie@example.com",
          role: "admin",
        },
      ];

      if (returnEmpty) {
        return {
          data: [],
          status: "success",
          message: "Data fetched successfully",
        };
      }

      return {
        data: mockUsers,
        status: "success",
        message: "Data fetched successfully",
      };
    },
    []
  );

  const fetchData = useCallback(
    async (isRetry: boolean = false) => {
      if (abortController) {
        abortController.abort();
      }

      const controller = new AbortController();
      setAbortController(controller);

      try {
        setLoading(true);
        setError(null);

        const response = await mockFetch(endpoint, controller.signal);

        if (response.status === "error") {
          throw new Error(response.message || "Unknown error occurred");
        }

        setData(response.data);
        setLastFetch(new Date());
        setRetryCount(0);
        onDataLoad?.(response.data);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return; // Request was aborted, don't set error
        }

        const error = err instanceof Error ? err : new Error("Unknown error");
        setError(error);
        onError?.(error);

        if (!isRetry && retryCount < retryAttempts) {
          setRetryCount((prev) => prev + 1);
          setTimeout(() => fetchData(true), 1000 * Math.pow(2, retryCount)); // Exponential backoff
        }
      } finally {
        setLoading(false);
        setAbortController(null);
      }
    },
    [
      endpoint,
      mockFetch,
      onDataLoad,
      onError,
      retryAttempts,
      retryCount,
      abortController,
    ]
  );

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [endpoint]);

  // Auto-refresh interval
  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(() => {
        fetchData();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [refreshInterval, fetchData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [abortController]);

  const handleRetry = () => {
    setRetryCount(0);
    fetchData();
  };

  const handleRefresh = () => {
    fetchData();
  };

  const filteredData = filterRole
    ? data.filter((user) => user.role === filterRole)
    : data;

  const getStatusMessage = () => {
    if (loading) return "Loading...";
    if (error) return `Error: ${error.message}`;
    if (data.length === 0) return "No data available";
    return `Loaded ${filteredData.length} users`;
  };

  return (
    <div className="async-data-fetcher" data-testid="async-data-fetcher">
      <div className="fetcher-header">
        <h3>User Data</h3>
        <div className="fetcher-controls">
          <button
            onClick={handleRefresh}
            disabled={loading}
            data-testid="refresh-button"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
          {error && retryCount >= retryAttempts && (
            <button onClick={handleRetry} data-testid="retry-button">
              Retry
            </button>
          )}
        </div>
      </div>

      <div className="fetcher-status" data-testid="fetcher-status">
        {getStatusMessage()}
      </div>

      {retryCount > 0 && (
        <div className="retry-info" data-testid="retry-info">
          Retry attempt {retryCount} of {retryAttempts}
        </div>
      )}

      {lastFetch && (
        <div className="last-fetch" data-testid="last-fetch">
          Last updated: {lastFetch.toLocaleTimeString()}
        </div>
      )}

      {error && (
        <div className="error-message" data-testid="error-message">
          {error.message}
        </div>
      )}

      {!loading && !error && filteredData.length > 0 && (
        <div className="data-grid" data-testid="data-grid">
          {filteredData.map((user) => (
            <div
              key={user.id}
              className={`user-card ${user.role}`}
              data-testid={`user-card-${user.id}`}
            >
              <h4>{user.name}</h4>
              <p>{user.email}</p>
              <span className={`role-badge ${user.role}`}>{user.role}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AsyncDataFetcher;
