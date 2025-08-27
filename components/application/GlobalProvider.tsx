"use client"

import { persistor, store } from '@/store/configureStore'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import Loading from './Loading'


const GlobalProvider = ({ children }: any) => {
    return (
        <Provider store={store}>
            <PersistGate loading={<Loading />} persistor={persistor} >
                {children}
            </PersistGate>
        </Provider>
    )
}

export default GlobalProvider