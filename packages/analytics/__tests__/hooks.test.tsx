import { renderHook, act } from '@neothink/testing';
import { usePageView, useContentView, useProgressTracker } from '../src/hooks';
import { analytics } from '../src/index';

// Mock the analytics module
jest.mock('../src/index', () => ({
  analytics: {
    track: jest.fn().mockResolvedValue({}),
  },
}));

/**
 * Tests for the analytics hooks
 * 
 * @see DEVELOPMENT.md - Testing with packages/testing
 * @see SUPABASE.md - Analytics tracking implementation
 */
describe('Analytics Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('usePageView', () => {
    it('tracks a page view when mounted', () => {
      const { result } = renderHook(() => usePageView('hub'));
      
      // Should have called track with a page_view event
      expect(analytics.track).toHaveBeenCalledWith('page_view', {
        platform: 'hub',
        page: window.location.pathname,
      });
    });
    
    it('accepts additional properties', () => {
      const { result } = renderHook(() => 
        usePageView('hub', { referrer: 'google' })
      );
      
      // Should include the additional properties
      expect(analytics.track).toHaveBeenCalledWith('page_view', {
        platform: 'hub',
        page: window.location.pathname,
        referrer: 'google',
      });
    });
  });
  
  describe('useContentView', () => {
    it('returns a function to track content views', () => {
      const { result } = renderHook(() => useContentView());
      
      // Use the returned function to track a content view
      act(() => {
        result.current('hub', {
          content_id: '123',
          content_title: 'Test Content',
          content_type: 'article',
        });
      });
      
      // Should have called track with a content_view event
      expect(analytics.track).toHaveBeenCalledWith('content_view', {
        platform: 'hub',
        content_id: '123',
        content_title: 'Test Content',
        content_type: 'article',
      });
    });
    
    it('merges additional properties', () => {
      const { result } = renderHook(() => useContentView());
      
      act(() => {
        result.current('hub', {
          content_id: '123',
          content_title: 'Test Content',
          content_type: 'article',
          author: 'Test Author',
        });
      });
      
      // Should include the additional properties
      expect(analytics.track).toHaveBeenCalledWith('content_view', {
        platform: 'hub',
        content_id: '123',
        content_title: 'Test Content',
        content_type: 'article',
        author: 'Test Author',
      });
    });
  });
  
  describe('useProgressTracker', () => {
    it('returns a function to track progress', () => {
      const { result } = renderHook(() => useProgressTracker());
      
      // Use the returned function to track progress
      act(() => {
        result.current('hub', {
          content_id: '123',
          progress_percentage: 50,
          completed: false,
        });
      });
      
      // Should have called track with a progress event
      expect(analytics.track).toHaveBeenCalledWith('progress', {
        platform: 'hub',
        content_id: '123',
        progress_percentage: 50,
        completed: false,
      });
    });
    
    it('tracks completion events', () => {
      const { result } = renderHook(() => useProgressTracker());
      
      act(() => {
        result.current('hub', {
          content_id: '123',
          progress_percentage: 100,
          completed: true,
        });
      });
      
      // Should have been called with completed=true
      expect(analytics.track).toHaveBeenCalledWith('progress', {
        platform: 'hub',
        content_id: '123',
        progress_percentage: 100,
        completed: true,
      });
      
      // Should also call a separate completion event
      expect(analytics.track).toHaveBeenCalledWith('completion', {
        platform: 'hub',
        content_id: '123',
      });
    });
  });
}); 