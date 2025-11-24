"use client";

import { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { Info } from 'lucide-react';

interface AuthModeInfo {
  mode: 'api' | 'mock';
  apiUrl?: string;
  message: string;
}

export function AuthModeIndicator() {
  const [authMode, setAuthMode] = useState<AuthModeInfo | null>(null);

  useEffect(() => {
    // Check current auth mode
    fetch('/api/auth/mode')
      .then(res => res.json())
      .then(data => setAuthMode(data))
      .catch(() => {
        // Fallback if endpoint doesn't exist
        setAuthMode({
          mode: 'mock',
          message: 'Mock Mode (API unavailable)'
        });
      });
  }, []);

  if (!authMode) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <Badge 
        variant={authMode.mode === 'api' ? 'default' : 'secondary'}
        className="flex items-center gap-2 px-3 py-1"
      >
        <Info className="h-3 w-3" />
        <span className="text-xs">
          {authMode.mode === 'api' ? '🌐 API Mode' : '🎭 Mock Mode'}
        </span>
      </Badge>
      {authMode.apiUrl && (
        <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
          {authMode.apiUrl}
        </div>
      )}
    </div>
  );
}
