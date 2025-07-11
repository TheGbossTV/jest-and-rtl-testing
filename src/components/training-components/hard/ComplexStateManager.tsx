import React, { useReducer, useEffect, useCallback } from 'react';
import type { User, Notification, AppState, AppAction } from './ComplexStateManagerTypes';
import { AppContext } from './ComplexStateManagerContext';

const initialState: AppState = {
  user: null,
  notifications: [],
  settings: {
    debugMode: false,
    apiUrl: 'https://api.example.com',
    retryAttempts: 3
  },
  ui: {
    loading: false,
    error: null,
    activeModal: null
  }
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        ui: { ...state.ui, error: null }
      };
      
    case 'CLEAR_USER':
      return {
        ...state,
        user: null,
        notifications: []
      };
      
         case 'ADD_NOTIFICATION': {
       const newNotification: Notification = {
         ...action.payload,
         id: Date.now().toString(),
         timestamp: new Date(),
         read: false
       };
       return {
         ...state,
         notifications: [newNotification, ...state.notifications].slice(0, 50) // Keep max 50
       };
     }
      
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
        )
      };
      
    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: []
      };
      
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
      
    case 'SET_LOADING':
      return {
        ...state,
        ui: { ...state.ui, loading: action.payload }
      };
      
    case 'SET_ERROR':
      return {
        ...state,
        ui: { ...state.ui, error: action.payload }
      };
      
    case 'SET_ACTIVE_MODAL':
      return {
        ...state,
        ui: { ...state.ui, activeModal: action.payload }
      };
      
    case 'UPDATE_USER_PREFERENCES':
      if (!state.user) return state;
      return {
        ...state,
        user: {
          ...state.user,
          preferences: { ...state.user.preferences, ...action.payload }
        }
      };
      
    default:
      return state;
  }
};



interface ComplexStateManagerProps {
  children?: React.ReactNode;
  onStateChange?: (state: AppState) => void;
  initialUser?: User;
}

const ComplexStateManager: React.FC<ComplexStateManagerProps> = ({
  children,
  onStateChange,
  initialUser
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize user if provided
  useEffect(() => {
    if (initialUser) {
      dispatch({ type: 'SET_USER', payload: initialUser });
    }
  }, [initialUser]);

  // Auto-cleanup old notifications
  useEffect(() => {
    const cleanup = setInterval(() => {
      const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
      const hasOldNotifications = state.notifications.some(
        notification => notification.timestamp < cutoffTime
      );
      
             if (hasOldNotifications) {
         // We can't directly update state here, so we'll use a custom cleanup action
         // Future: implement a cleanup dispatch action
       }
    }, 60000); // Check every minute
    
    return () => clearInterval(cleanup);
  }, [state.notifications]);

  // Persist user preferences to localStorage
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('userPreferences', JSON.stringify(state.user.preferences));
    }
  }, [state.user?.preferences]);

  // Load user preferences from localStorage
  useEffect(() => {
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences && state.user) {
      try {
        const preferences = JSON.parse(savedPreferences);
        dispatch({ type: 'UPDATE_USER_PREFERENCES', payload: preferences });
      } catch (error) {
        console.error('Failed to load user preferences:', error);
      }
    }
  }, [state.user?.id]);

  // Call onStateChange when state changes
  useEffect(() => {
    onStateChange?.(state);
  }, [state, onStateChange]);

  // Derived state and selectors
  const selectors = {
    getUnreadNotifications: () => state.notifications.filter(n => !n.read),
    getNotificationsByType: (type: Notification['type']) => 
      state.notifications.filter(n => n.type === type),
    isAdmin: () => state.user?.role === 'admin',
    isAuthenticated: () => !!state.user,
    getTheme: () => state.user?.preferences.theme || 'light'
  };

  // Action creators
  const actions = {
    login: useCallback(async (email: string, password: string) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (email === 'admin@example.com' && password === 'admin123') {
          const user: User = {
            id: '1',
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'admin',
            preferences: {
              theme: 'dark',
              notifications: true,
              language: 'en'
            }
          };
          dispatch({ type: 'SET_USER', payload: user });
          dispatch({ type: 'ADD_NOTIFICATION', payload: {
            type: 'success',
            message: 'Successfully logged in',
            read: false
          }});
        } else {
          throw new Error('Invalid credentials');
        }
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Login failed' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }, []),
    
    logout: useCallback(() => {
      dispatch({ type: 'CLEAR_USER' });
      dispatch({ type: 'ADD_NOTIFICATION', payload: {
        type: 'info',
        message: 'Successfully logged out',
        read: false
      }});
    }, []),
    
    addNotification: useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    }, []),
    
    markNotificationRead: useCallback((id: string) => {
      dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
    }, []),
    
    updateSettings: useCallback((settings: Partial<AppState['settings']>) => {
      dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
    }, []),
    
    updateUserPreferences: useCallback((preferences: Partial<User['preferences']>) => {
      dispatch({ type: 'UPDATE_USER_PREFERENCES', payload: preferences });
    }, []),
    
    openModal: useCallback((modalName: string) => {
      dispatch({ type: 'SET_ACTIVE_MODAL', payload: modalName });
    }, []),
    
    closeModal: useCallback(() => {
      dispatch({ type: 'SET_ACTIVE_MODAL', payload: null });
    }, [])
  };

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <div className="complex-state-manager" data-testid="complex-state-manager">
        <div className="state-display">
          <h3>Current State</h3>
          <div className="state-section">
            <h4>User</h4>
            <div data-testid="user-info">
              {state.user ? (
                <>
                  <p>Name: {state.user.name}</p>
                  <p>Email: {state.user.email}</p>
                  <p>Role: {state.user.role}</p>
                  <p>Theme: {state.user.preferences.theme}</p>
                </>
              ) : (
                <p>Not logged in</p>
              )}
            </div>
          </div>
          
          <div className="state-section">
            <h4>Notifications ({state.notifications.length})</h4>
            <div data-testid="notifications-info">
              <p>Unread: {selectors.getUnreadNotifications().length}</p>
              <p>Errors: {selectors.getNotificationsByType('error').length}</p>
            </div>
          </div>
          
          <div className="state-section">
            <h4>UI State</h4>
            <div data-testid="ui-info">
              <p>Loading: {state.ui.loading ? 'Yes' : 'No'}</p>
              <p>Error: {state.ui.error || 'None'}</p>
              <p>Active Modal: {state.ui.activeModal || 'None'}</p>
            </div>
          </div>
        </div>
        
        <div className="actions">
          <h3>Actions</h3>
          <button 
            onClick={() => actions.login('admin@example.com', 'admin123')}
            disabled={state.ui.loading}
            data-testid="login-button"
          >
            Login as Admin
          </button>
          <button 
            onClick={actions.logout}
            disabled={!state.user}
            data-testid="logout-button"
          >
            Logout
          </button>
          <button 
            onClick={() => actions.addNotification({ type: 'info', message: 'Test notification', read: false })}
            data-testid="add-notification-button"
          >
            Add Notification
          </button>
          <button 
            onClick={() => actions.updateUserPreferences({ theme: state.user?.preferences.theme === 'light' ? 'dark' : 'light' })}
            disabled={!state.user}
            data-testid="toggle-theme-button"
          >
            Toggle Theme
          </button>
          <button 
            onClick={() => actions.openModal('settings')}
            data-testid="open-modal-button"
          >
            Open Settings Modal
          </button>
        </div>
        
        {children}
      </div>
    </AppContext.Provider>
  );
};

export default ComplexStateManager; 