"use client"

import { useEffect, useState, useRef } from 'react'

interface PerformanceMetrics {
  renderTime: number
  apiResponseTime: number
  memoryUsage: number
  isSlowConnection: boolean
}

interface PerformanceMonitorProps {
  children: React.ReactNode
  threshold?: number
  onSlowOperation?: (metrics: PerformanceMetrics) => void
}

export const PerformanceMonitor = ({ 
  children, 
  threshold = 1000,
  onSlowOperation 
}: PerformanceMonitorProps) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    apiResponseTime: 0,
    memoryUsage: 0,
    isSlowConnection: false,
  })
  
  const hasMeasuredRef = useRef(false)
  const onSlowOperationRef = useRef(onSlowOperation)
  
  useEffect(() => {
    onSlowOperationRef.current = onSlowOperation
  }, [onSlowOperation])

  useEffect(() => {
    if (hasMeasuredRef.current) return
    hasMeasuredRef.current = true
    
    const startTime = performance.now()
    
    const measureRenderTime = () => {
      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      setMetrics(prev => {
        const newMetrics = {
          ...prev,
          renderTime,
        }

        if (renderTime > threshold && onSlowOperationRef.current) {
          onSlowOperationRef.current(newMetrics)
        }

        return newMetrics
      })
    }

    const measureMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory
        setMetrics(prev => ({
          ...prev,
          memoryUsage: memory.usedJSHeapSize / 1024 / 1024,
        }))
      }
    }

    const checkConnectionSpeed = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection
        const isSlowConnection = connection.effectiveType === 'slow-2g' || 
                                connection.effectiveType === '2g' ||
                                connection.downlink < 1
        setMetrics(prev => ({
          ...prev,
          isSlowConnection,
        }))
      }
    }

    measureRenderTime()
    measureMemory()
    checkConnectionSpeed()

    const interval = setInterval(() => {
      measureMemory()
      checkConnectionSpeed()
    }, 10000)

    return () => clearInterval(interval)
  }, [threshold])

  return <>{children}</>
}

export const useApiPerformance = () => {
  const [responseTimes, setResponseTimes] = useState<Record<string, number>>({})

  const measureApiCall = async <T>(
    apiCall: () => Promise<T>,
    endpoint: string
  ): Promise<T> => {
    const startTime = performance.now()
    
    try {
      const result = await apiCall()
      const endTime = performance.now()
      const responseTime = endTime - startTime
      
      setResponseTimes(prev => ({
        ...prev,
        [endpoint]: responseTime,
      }))

      if (responseTime > 2000) {
        console.warn(`Slow API call detected: ${endpoint} took ${responseTime.toFixed(2)}ms`)
      }

      return result
    } catch (error) {
      const endTime = performance.now()
      const responseTime = endTime - startTime
      
      setResponseTimes(prev => ({
        ...prev,
        [endpoint]: responseTime,
      }))

      throw error
    }
  }

  return {
    responseTimes,
    measureApiCall,
  }
}

export const PerformanceWarning = ({ 
  metrics, 
  threshold = 1000 
}: { 
  metrics: PerformanceMetrics
  threshold?: number 
}) => {
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    const isSlow = metrics.renderTime > threshold || 
                   metrics.apiResponseTime > 3000 || 
                   metrics.isSlowConnection

    setShowWarning(isSlow)
  }, [metrics, threshold])

  if (!showWarning) return null

  return (
    <div className="fixed bottom-4 left-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-lg shadow-lg z-50 max-w-sm">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-sm">Performance Notice</h4>
          <p className="text-xs">
            {metrics.isSlowConnection && "Slow connection detected. "}
            {metrics.renderTime > threshold && `Render time: ${metrics.renderTime.toFixed(0)}ms. `}
            {metrics.apiResponseTime > 3000 && `API response: ${metrics.apiResponseTime.toFixed(0)}ms.`}
          </p>
        </div>
        <button
          onClick={() => setShowWarning(false)}
          className="ml-2 text-yellow-600 hover:text-yellow-800"
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default PerformanceMonitor

