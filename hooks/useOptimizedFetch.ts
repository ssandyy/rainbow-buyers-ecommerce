"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import axios from 'axios'

interface UseOptimizedFetchOptions {
  immediate?: boolean
  retryCount?: number
  retryDelay?: number
  cacheTime?: number
  staleTime?: number
}

interface CacheEntry {
  data: any
  timestamp: number
  staleTime: number
}

// Simple in-memory cache
const cache = new Map<string, CacheEntry>()

export const useOptimizedFetch = <T = any>(
  url: string,
  options: UseOptimizedFetchOptions = {}
) => {
  const {
    immediate = true,
    retryCount = 3,
    retryDelay = 1000,
    cacheTime = 5 * 60 * 1000, // 5 minutes
    staleTime = 2 * 60 * 1000, // 2 minutes
  } = options

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [success, setSuccess] = useState(false)
  const retryCountRef = useRef(0)
  const abortControllerRef = useRef<AbortController | null>(null)

  const isStale = useCallback((entry: CacheEntry) => {
    return Date.now() - entry.timestamp > entry.staleTime
  }, [])

  const isExpired = useCallback((entry: CacheEntry) => {
    return Date.now() - entry.timestamp > cacheTime
  }, [cacheTime])

  const fetchData = useCallback(async (forceRefresh = false) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController()

    // Check cache first
    if (!forceRefresh && cache.has(url)) {
      const cachedEntry = cache.get(url)!
      
      if (!isExpired(cachedEntry)) {
        setData(cachedEntry.data)
        setSuccess(true)
        setError(null)
        
        // If data is stale, fetch in background
        if (isStale(cachedEntry)) {
          fetchData(true)
        }
        return
      } else {
        // Remove expired cache
        cache.delete(url)
      }
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await axios.get(url, {
        signal: abortControllerRef.current.signal,
        timeout: 10000, // 10 second timeout
      })

      if (response.data.success) {
        setData(response.data.data)
        setSuccess(true)
        setError(null)
        
        // Cache the response
        cache.set(url, {
          data: response.data.data,
          timestamp: Date.now(),
          staleTime,
        })
        
        retryCountRef.current = 0
      } else {
        throw new Error(response.data.message || 'Request failed')
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return // Request was cancelled
      }

      setError(err)
      setSuccess(false)

      // Retry logic
      if (retryCountRef.current < retryCount) {
        retryCountRef.current++
        setTimeout(() => {
          fetchData(forceRefresh)
        }, retryDelay * retryCountRef.current)
      }
    } finally {
      setLoading(false)
    }
  }, [url, retryCount, retryDelay, cacheTime, staleTime, isStale, isExpired])

  const refetch = useCallback(() => {
    return fetchData(true)
  }, [fetchData])

  const clearCache = useCallback(() => {
    cache.delete(url)
  }, [url])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    if (immediate) {
      fetchData()
    }
  }, [immediate, fetchData])

  return {
    data,
    loading,
    error,
    success,
    refetch,
    clearCache,
  }
}

// Hook for POST requests with loading states
export const useOptimizedMutation = <T = any>(
  url: string,
  options: { onSuccess?: (data: T) => void; onError?: (error: Error) => void } = {}
) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [success, setSuccess] = useState(false)
  const [data, setData] = useState<T | null>(null)

  const mutate = useCallback(async (payload: any) => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await axios.post(url, payload, {
        timeout: 15000, // 15 second timeout for mutations
      })

      if (response.data.success) {
        setData(response.data.data)
        setSuccess(true)
        setError(null)
        options.onSuccess?.(response.data.data)
      } else {
        throw new Error(response.data.message || 'Request failed')
      }
    } catch (err: any) {
      setError(err)
      setSuccess(false)
      options.onError?.(err)
    } finally {
      setLoading(false)
    }
  }, [url, options])

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
    setSuccess(false)
    setData(null)
  }, [])

  return {
    mutate,
    loading,
    error,
    success,
    data,
    reset,
  }
}



