import { useState, useEffect, useRef, useCallback } from 'react';

interface PriorityItem {
  id: string;
  priority: 'high' | 'medium' | 'low';
  execute: () => Promise<void>;
  dependencies?: string[];
}

interface UsePriorityLoadingReturn {
  addToQueue: (item: PriorityItem) => void;
  removeFromQueue: (id: string) => void;
  isProcessing: boolean;
  queueLength: number;
  clearQueue: () => void;
}

export function usePriorityLoading(): UsePriorityLoadingReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [queueLength, setQueueLength] = useState(0);
  const queueRef = useRef<PriorityItem[]>([]);
  const processingRef = useRef<Set<string>>(new Set());
  const completedRef = useRef<Set<string>>(new Set());

  const processQueue = useCallback(async () => {
    if (isProcessing || queueRef.current.length === 0) return;

    setIsProcessing(true);
    
    // Sort queue by priority
    const sortedQueue = [...queueRef.current].sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    // Process high priority items first
    for (const item of sortedQueue) {
      if (processingRef.current.has(item.id)) continue;

      // Check dependencies
      if (item.dependencies) {
        const unmetDependencies = item.dependencies.filter(
          dep => !completedRef.current.has(dep)
        );
        if (unmetDependencies.length > 0) continue;
      }

      try {
        processingRef.current.add(item.id);
        await item.execute();
        completedRef.current.add(item.id);
      } catch (error) {
        console.error(`Error processing item ${item.id}:`, error);
      } finally {
        processingRef.current.delete(item.id);
      }

      // Remove from queue
      queueRef.current = queueRef.current.filter(q => q.id !== item.id);
      setQueueLength(queueRef.current.length);
    }

    setIsProcessing(false);
  }, [isProcessing]);

  const addToQueue = useCallback((item: PriorityItem) => {
    // Check if already in queue
    const existingIndex = queueRef.current.findIndex(q => q.id === item.id);
    if (existingIndex >= 0) {
      // Update existing item
      queueRef.current[existingIndex] = item;
    } else {
      // Add new item
      queueRef.current.push(item);
    }
    setQueueLength(queueRef.current.length);
    
    // Start processing if not already processing
    if (!isProcessing) {
      processQueue();
    }
  }, [isProcessing, processQueue]);

  const removeFromQueue = useCallback((id: string) => {
    queueRef.current = queueRef.current.filter(q => q.id !== id);
    processingRef.current.delete(id);
    setQueueLength(queueRef.current.length);
  }, []);

  const clearQueue = useCallback(() => {
    queueRef.current = [];
    processingRef.current.clear();
    completedRef.current.clear();
    setQueueLength(0);
    setIsProcessing(false);
  }, []);

  // Auto-process queue when items are added
  useEffect(() => {
    if (queueLength > 0 && !isProcessing) {
      processQueue();
    }
  }, [queueLength, isProcessing, processQueue]);

  return {
    addToQueue,
    removeFromQueue,
    isProcessing,
    queueLength,
    clearQueue,
  };
}

// Utility hook for managing loading states with priority
export function usePriorityLoadingState() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [errorStates, setErrorStates] = useState<Record<string, string | null>>({});

  const setLoading = useCallback((id: string, loading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [id]: loading }));
  }, []);

  const setError = useCallback((id: string, error: string | null) => {
    setErrorStates(prev => ({ ...prev, [id]: error }));
  }, []);

  const isLoading = useCallback((id: string) => loadingStates[id] || false, [loadingStates]);
  const hasError = useCallback((id: string) => errorStates[id] || null, [errorStates]);

  const isAnyLoading = Object.values(loadingStates).some(Boolean);
  const hasAnyError = Object.values(errorStates).some(Boolean);

  return {
    setLoading,
    setError,
    isLoading,
    hasError,
    isAnyLoading,
    hasAnyError,
    loadingStates,
    errorStates,
  };
}
