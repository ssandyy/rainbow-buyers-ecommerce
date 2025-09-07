"use client"

import axios from "axios";

// Utility function to automatically refresh token when it's about to expire
export const setupTokenRefresh = () => {
    // Check token expiration every 5 minutes
    const checkInterval = setInterval(async () => {
        try {
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('access_token='))
                ?.split('=')[1];

            if (!token) {
                clearInterval(checkInterval);
                return;
            }

            // Check if token expires in the next 10 minutes
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Math.floor(Date.now() / 1000);
            const timeUntilExpiry = payload.exp - currentTime;

            // If token expires in less than 10 minutes, refresh it
            if (timeUntilExpiry < 600) { // 10 minutes = 600 seconds
                try {
                    const response = await axios.post("/api/authentication/refresh");
                    
                    if (response.data.success) {
                        console.log("Token refreshed automatically");
                        // Dispatch action to update Redux state if needed
                        window.dispatchEvent(new CustomEvent('tokenRefreshed', { 
                            detail: response.data.data 
                        }));
                    }
                } catch (error) {
                    console.error("Automatic token refresh failed:", error);
                    // Clear tokens and redirect to login
                    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    window.location.href = '/auth/login';
                }
            }
        } catch (error) {
            console.error("Token refresh check failed:", error);
            clearInterval(checkInterval);
        }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return checkInterval;
};

// Function to clear the refresh interval
export const clearTokenRefresh = (intervalId: NodeJS.Timeout) => {
    clearInterval(intervalId);
};


