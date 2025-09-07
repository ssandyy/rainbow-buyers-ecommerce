"use client"

import { logout } from "@/store/reducer/authReducer";
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoutes";
import { isTokenExpired } from "@/lib/jwtUtils";
import { setupTokenRefresh, clearTokenRefresh } from "@/lib/tokenRefresh";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    avatar: any;
    isEmailVerified: boolean;
}

export const useAuth = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const auth = useSelector((state: any) => state.authStore.auth);
    const [isLoading, setIsLoading] = useState(true);
    const [isValidating, setIsValidating] = useState(false);
    const hasValidated = useRef(false);
    const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const validateAuth = useCallback(async () => {
        if (isValidating) return;
        
        setIsValidating(true);
        
        try {
            // First check if we have a token in cookies (client-side check)
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('access_token='))
                ?.split('=')[1];
            
            if (!token) {
                dispatch(logout());
                return false;
            }
            
            // Check if token is expired client-side
            if (isTokenExpired(token)) {
                // Try to refresh the token
                try {
                    const refreshResponse = await axios.post("/api/authentication/refresh");
                    
                    if (refreshResponse.data.success) {
                        // Token refreshed successfully, update Redux state
                        dispatch({ type: "authStore/login", payload: refreshResponse.data.data });
                        return true;
                    } else {
                        // Refresh failed, clear auth state and cookies
                        document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                        document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                        dispatch(logout());
                        return false;
                    }
                } catch (refreshError) {
                    // Refresh failed, clear auth state and cookies
                document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                dispatch(logout());
                return false;
                }
            }
            
            const response = await axios.get("/api/authentication/me");
            
            if (response.data.success) {
                // Token is valid, update Redux state with fresh data
                dispatch({ type: "authStore/login", payload: response.data.data });
                return true;
            } else {
                // Token is invalid, clear auth state and cookie
                document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                dispatch(logout());
                return false;
            }
        } catch (error: any) {
            console.error("Auth validation error:", error);
            
            // If it's a 401 error, the token is invalid/expired
            if (error.response?.status === 401) {
                // Clear the invalid token cookies
                document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                dispatch(logout());
                return false;
            }
            
            // For other errors, don't clear auth state but log the error
            console.error("Unexpected error during auth validation:", error);
            return false;
        } finally {
            setIsValidating(false);
        }
    }, [dispatch]); // Removed isValidating from dependencies to prevent infinite loops

    const logoutUser = async () => {
        try {
            await axios.post("/api/authentication/logout");
        } catch (error) {
            console.error("Logout API error:", error);
        } finally {
            // Clear both token cookies
            document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            dispatch(logout());
            router.push(WEBSITE_LOGIN);
        }
    };

    // Setup automatic token refresh when user is authenticated
    useEffect(() => {
        if (auth && !refreshIntervalRef.current) {
            refreshIntervalRef.current = setupTokenRefresh();
            
            // Listen for token refresh events
            const handleTokenRefresh = (event: CustomEvent) => {
                dispatch({ type: "authStore/login", payload: event.detail });
            };
            
            window.addEventListener('tokenRefreshed', handleTokenRefresh as EventListener);
            
            return () => {
                window.removeEventListener('tokenRefreshed', handleTokenRefresh as EventListener);
            };
        } else if (!auth && refreshIntervalRef.current) {
            clearTokenRefresh(refreshIntervalRef.current);
            refreshIntervalRef.current = null;
        }
    }, [auth, dispatch]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (refreshIntervalRef.current) {
                clearTokenRefresh(refreshIntervalRef.current);
            }
        };
    }, []);

    // Don't run automatic validation on mount - let components handle it manually
    useEffect(() => {
        setIsLoading(false);
    }, []);

    return {
        user: auth as User | null,
        isLoading,
        isValidating,
        isAuthenticated: !!auth,
        validateAuth,
        logout: logoutUser,
    };
};
