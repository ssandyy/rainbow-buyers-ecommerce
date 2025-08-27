
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import persistReducer from "redux-persist/es/persistReducer";
import localStorage from "redux-persist/lib/storage";
import authReducer from "./reducer/authReducer";


const rootReducer = combineReducers({
    authStore: authReducer
})


const persisteConfig = {
    key: "root",
    storage: localStorage
}


const persistedReducer = persistReducer(persisteConfig, rootReducer)



export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false })
})


export const persistor = persistStore(store)