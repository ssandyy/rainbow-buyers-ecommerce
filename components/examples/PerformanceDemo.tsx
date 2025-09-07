"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ButtonLoading } from '@/components/application/ButtonLoading'
import { LoadingWrapper, ProductGridLoading, TableLoading, FormLoading } from '@/components/application/LoadingWrapper'
import { useOptimizedFetch, useOptimizedMutation } from '@/hooks/useOptimizedFetch'

// Example component showing the new loading states and performance optimizations
export const PerformanceDemo = () => {
  const [showLoading, setShowLoading] = useState(false)
  const [buttonState, setButtonState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  // Example of optimized API fetch
  const { data: products, loading, error, refetch } = useOptimizedFetch('/api/product', {
    immediate: false,
    cacheTime: 5 * 60 * 1000, // 5 minutes
    staleTime: 2 * 60 * 1000, // 2 minutes
  })

  // Example of optimized mutation
  const { mutate: createProduct, loading: creating, success, error: createError } = useOptimizedMutation('/api/product/create', {
    onSuccess: (data) => {
      console.log('Product created:', data)
      setButtonState('success')
      setTimeout(() => setButtonState('idle'), 2000)
    },
    onError: (error) => {
      console.error('Error creating product:', error)
      setButtonState('error')
      setTimeout(() => setButtonState('idle'), 2000)
    }
  })

  const handleButtonClick = () => {
    setButtonState('loading')
    // Simulate API call
    setTimeout(() => {
      if (Math.random() > 0.5) {
        setButtonState('success')
      } else {
        setButtonState('error')
      }
      setTimeout(() => setButtonState('idle'), 2000)
    }, 2000)
  }

  const handleFetchProducts = () => {
    setShowLoading(true)
    refetch().finally(() => {
      setTimeout(() => setShowLoading(false), 1000)
    })
  }

  return (
    <div className="p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Performance & UI Improvements Demo</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Showcasing enhanced loading states, optimized API calls, and improved button variants
        </p>
      </div>

      {/* Enhanced Button Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Enhanced Button Variants</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="default">Default</Button>
          <Button variant="success">Success</Button>
          <Button variant="warning">Warning</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="info">Info</Button>
          <Button variant="admin">Admin</Button>
          <Button variant="premium">Premium</Button>
          <Button variant="outline">Outline</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      {/* Button Loading States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Button Loading States</h2>
        <div className="flex gap-4 flex-wrap">
          <ButtonLoading
            text="Save Changes"
            loading={buttonState === 'loading'}
            success={buttonState === 'success'}
            error={buttonState === 'error'}
            onClick={handleButtonClick}
            variant="success"
          />
          <ButtonLoading
            text="Delete Item"
            loading={buttonState === 'loading'}
            success={buttonState === 'success'}
            error={buttonState === 'error'}
            onClick={handleButtonClick}
            variant="destructive"
          />
          <ButtonLoading
            text="Admin Action"
            loading={buttonState === 'loading'}
            success={buttonState === 'success'}
            error={buttonState === 'error'}
            onClick={handleButtonClick}
            variant="admin"
          />
        </div>
      </section>

      {/* Loading Wrappers */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Loading Wrappers & Skeletons</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Product Grid Loading</h3>
            <LoadingWrapper type="product" count={4}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products?.data?.map((product: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-semibold">{product.name}</h4>
                    <p className="text-gray-600">${product.sellingPrice}</p>
                  </div>
                ))}
              </div>
            </LoadingWrapper>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Table Loading</h3>
            <LoadingWrapper type="table" count={3}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="p-4 text-left">Name</th>
                      <th className="p-4 text-left">Price</th>
                      <th className="p-4 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-4">Sample Product</td>
                      <td className="p-4">$29.99</td>
                      <td className="p-4">Active</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </LoadingWrapper>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Form Loading</h3>
            <LoadingWrapper type="form">
              <div className="max-w-md space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Product Name</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price</label>
                  <input 
                    type="number" 
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter price"
                  />
                </div>
                <Button>Save Product</Button>
              </div>
            </LoadingWrapper>
          </div>
        </div>
      </section>

      {/* API Performance Demo */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Optimized API Calls</h2>
        <div className="space-y-4">
          <Button onClick={handleFetchProducts} disabled={loading}>
            {loading ? 'Fetching...' : 'Fetch Products (with caching)'}
          </Button>
          
          {error && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              Error: {error.message}
            </div>
          )}
          
          {products && (
            <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              Successfully fetched {products.data?.length || 0} products
            </div>
          )}
        </div>
      </section>

      {/* Performance Tips */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Performance Improvements Made</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Loading States</h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Skeleton loading components</li>
              <li>• Suspense boundaries</li>
              <li>• Button loading states</li>
              <li>• Progress indicators</li>
            </ul>
          </div>
          
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">API Optimization</h3>
            <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
              <li>• Request caching</li>
              <li>• Automatic retries</li>
              <li>• Background refresh</li>
              <li>• Error handling</li>
            </ul>
          </div>
          
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">UI Enhancements</h3>
            <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
              <li>• Gradient button variants</li>
              <li>• Hover animations</li>
              <li>• Success/error states</li>
              <li>• Better accessibility</li>
            </ul>
          </div>
          
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Performance</h3>
            <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
              <li>• Fast Refresh optimization</li>
              <li>• Bundle splitting</li>
              <li>• Image optimization</li>
              <li>• Memory monitoring</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PerformanceDemo



