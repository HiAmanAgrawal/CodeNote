import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface UIState {
  // Theme and appearance
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  sidebarWidth: number;
  
  // Navigation and routing
  currentRoute: string;
  breadcrumbs: Array<{ label: string; href: string }>;
  
  // Modals and overlays
  activeModals: string[];
  modalStack: string[];
  
  // Notifications
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
    action?: { label: string; onClick: () => void };
  }>;
  
  // Loading states
  loadingStates: Record<string, boolean>;
  globalLoading: boolean;
  
  // UI preferences
  animationsEnabled: boolean;
  reducedMotion: boolean;
  compactMode: boolean;
  highContrast: boolean;
  
  // Responsive
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  
  // Actions
  setTheme: (theme: UIState['theme']) => void;
  toggleSidebar: () => void;
  setSidebarWidth: (width: number) => void;
  setCurrentRoute: (route: string) => void;
  setBreadcrumbs: (breadcrumbs: UIState['breadcrumbs']) => void;
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  closeAllModals: () => void;
  addNotification: (notification: Omit<UIState['notifications'][0], 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  setLoading: (key: string, loading: boolean) => void;
  setGlobalLoading: (loading: boolean) => void;
  setAnimationsEnabled: (enabled: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
  setCompactMode: (compact: boolean) => void;
  setHighContrast: (highContrast: boolean) => void;
  setScreenSize: (size: UIState['screenSize']) => void;
  updateResponsive: () => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        theme: 'system',
        sidebarCollapsed: false,
        sidebarWidth: 280,
        currentRoute: '/',
        breadcrumbs: [],
        activeModals: [],
        modalStack: [],
        notifications: [],
        loadingStates: {},
        globalLoading: false,
        animationsEnabled: true,
        reducedMotion: false,
        compactMode: false,
        highContrast: false,
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        screenSize: 'lg',

        // Actions
        setTheme: (theme) => set((state) => {
          state.theme = theme;
        }),

        toggleSidebar: () => set((state) => {
          state.sidebarCollapsed = !state.sidebarCollapsed;
        }),

        setSidebarWidth: (width) => set((state) => {
          state.sidebarWidth = Math.max(200, Math.min(400, width));
        }),

        setCurrentRoute: (route) => set((state) => {
          state.currentRoute = route;
        }),

        setBreadcrumbs: (breadcrumbs) => set((state) => {
          state.breadcrumbs = breadcrumbs;
        }),

        openModal: (modalId) => set((state) => {
          if (!state.activeModals.includes(modalId)) {
            state.activeModals.push(modalId);
            state.modalStack.push(modalId);
          }
        }),

        closeModal: (modalId) => set((state) => {
          state.activeModals = state.activeModals.filter(id => id !== modalId);
          state.modalStack = state.modalStack.filter(id => id !== modalId);
        }),

        closeAllModals: () => set((state) => {
          state.activeModals = [];
          state.modalStack = [];
        }),

        addNotification: (notification) => set((state) => {
          const id = crypto.randomUUID();
          const newNotification = { ...notification, id };
          state.notifications.push(newNotification);

          // Auto-remove after duration
          if (notification.duration !== 0) {
            setTimeout(() => {
              get().removeNotification(id);
            }, notification.duration || 5000);
          }
        }),

        removeNotification: (id) => set((state) => {
          state.notifications = state.notifications.filter(n => n.id !== id);
        }),

        clearNotifications: () => set((state) => {
          state.notifications = [];
        }),

        setLoading: (key, loading) => set((state) => {
          state.loadingStates[key] = loading;
        }),

        setGlobalLoading: (loading) => set((state) => {
          state.globalLoading = loading;
        }),

        setAnimationsEnabled: (enabled) => set((state) => {
          state.animationsEnabled = enabled;
        }),

        setReducedMotion: (reduced) => set((state) => {
          state.reducedMotion = reduced;
        }),

        setCompactMode: (compact) => set((state) => {
          state.compactMode = compact;
        }),

        setHighContrast: (highContrast) => set((state) => {
          state.highContrast = highContrast;
        }),

        setScreenSize: (size) => set((state) => {
          state.screenSize = size;
          
          // Update responsive flags
          state.isMobile = size === 'xs' || size === 'sm';
          state.isTablet = size === 'md';
          state.isDesktop = size === 'lg' || size === 'xl' || size === '2xl';
        }),

        updateResponsive: () => {
          const width = window.innerWidth;
          let size: UIState['screenSize'] = 'lg';
          
          if (width < 640) size = 'xs';
          else if (width < 768) size = 'sm';
          else if (width < 1024) size = 'md';
          else if (width < 1280) size = 'lg';
          else if (width < 1536) size = 'xl';
          else size = '2xl';
          
          get().setScreenSize(size);
        },
      })),
      {
        name: 'ui-store',
        partialize: (state) => ({
          theme: state.theme,
          sidebarCollapsed: state.sidebarCollapsed,
          sidebarWidth: state.sidebarWidth,
          animationsEnabled: state.animationsEnabled,
          reducedMotion: state.reducedMotion,
          compactMode: state.compactMode,
          highContrast: state.highContrast,
        }),
      }
    ),
    {
      name: 'ui-store',
    }
  )
);

// Responsive hook
export function useResponsive() {
  const { isMobile, isTablet, isDesktop, screenSize, updateResponsive } = useUIStore();

  React.useEffect(() => {
    updateResponsive();
    
    const handleResize = () => {
      updateResponsive();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateResponsive]);

  return { isMobile, isTablet, isDesktop, screenSize };
}

// Loading hook
export function useLoading(key?: string) {
  const { loadingStates, globalLoading, setLoading, setGlobalLoading } = useUIStore();

  const isLoading = key ? loadingStates[key] || false : globalLoading;
  const setIsLoading = key ? (loading: boolean) => setLoading(key, loading) : setGlobalLoading;

  return { isLoading, setIsLoading };
}

// Modal hook
export function useModal(modalId: string) {
  const { activeModals, openModal, closeModal } = useUIStore();
  
  const isOpen = activeModals.includes(modalId);
  const open = () => openModal(modalId);
  const close = () => closeModal(modalId);
  const toggle = () => isOpen ? close() : open();

  return { isOpen, open, close, toggle };
}

// Notification hook
export function useNotifications() {
  const { notifications, addNotification, removeNotification, clearNotifications } = useUIStore();

  const success = (title: string, message?: string) => 
    addNotification({ type: 'success', title, message });
  
  const error = (title: string, message?: string) => 
    addNotification({ type: 'error', title, message });
  
  const warning = (title: string, message?: string) => 
    addNotification({ type: 'warning', title, message });
  
  const info = (title: string, message?: string) => 
    addNotification({ type: 'info', title, message });

  return {
    notifications,
    success,
    error,
    warning,
    info,
    remove: removeNotification,
    clear: clearNotifications,
  };
}

export default useUIStore; 