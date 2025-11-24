"use client";
import { lazy } from 'react';

// Lazy load all generateAI components
export const LazyImageUploadSection = lazy(() => import('./ImageUploadSection'));
export const LazyPromptSection = lazy(() => import('./PromptSection'));
export const LazyOutputSection = lazy(() => import('./OutputSection'));