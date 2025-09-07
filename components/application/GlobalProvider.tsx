"use client"

import { persistor, store } from '@/store/configureStore'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Loading from './Loading'
import AuthProvider from './AuthProvider'
import TokenExpirationWarning from './TokenExpirationWarning'
import { useAuth } from '@/hooks/useAuth'

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
        },
    },
})

const GlobalProviderContent = ({ children }: any) => {
    const { logout } = useAuth()
    
    return (
        <>
            <AuthProvider />
            <TokenExpirationWarning onLogout={logout} />
            {children}
        </>
    )
}

const GlobalProvider = ({ children }: any) => {
    return (
        <Provider store={store}>
            <PersistGate loading={<Loading />} persistor={persistor} >
                <QueryClientProvider client={queryClient}>
                    <GlobalProviderContent>
                        {children}
                    </GlobalProviderContent>
                </QueryClientProvider>
            </PersistGate>
        </Provider>
    )
}

export default GlobalProvider