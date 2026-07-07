import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const STORAGE_KEY = "dev-simulated-date";

interface DevDateContextType {
  simulatedDate: Date | null;
  setSimulatedDate: (date: Date | null) => void;
  getCurrentDate: () => Date;
  isSimulating: boolean;
}

const DevDateContext = createContext<DevDateContextType | null>(null);

export function useDevDate() {
  const context = useContext(DevDateContext);
  if (!context) {
    // Return default values when context is not available (production)
    return {
      simulatedDate: null,
      setSimulatedDate: () => {},
      getCurrentDate: () => new Date(),
      isSimulating: false,
    };
  }
  return context;
}

interface DevDateProviderProps {
  children: ReactNode;
}

export function DevDateProvider({ children }: DevDateProviderProps) {
  const [simulatedDate, setSimulatedDateState] = useState<Date | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const date = new Date(stored);
        if (!Number.isNaN(date.getTime())) {
          setSimulatedDateState(date);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsHydrated(true);
  }, []);

  const setSimulatedDate = useCallback((date: Date | null) => {
    setSimulatedDateState(date);
    if (date) {
      localStorage.setItem(STORAGE_KEY, date.toISOString());
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const getCurrentDate = useCallback(() => {
    return simulatedDate ?? new Date();
  }, [simulatedDate]);

  // Don't render until hydrated to prevent hydration mismatch
  if (!isHydrated) {
    return <>{children}</>;
  }

  return (
    <DevDateContext.Provider
      value={{
        simulatedDate,
        setSimulatedDate,
        getCurrentDate,
        isSimulating: simulatedDate !== null,
      }}
    >
      {children}
    </DevDateContext.Provider>
  );
}
