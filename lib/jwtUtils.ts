"use client"

// Utility function to check if JWT token is expired (client-side)
export const isTokenExpired = (token: string): boolean => {
    try {
        // Decode JWT payload (without verification - just for expiration check)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        
        // Check if token is expired
        return payload.exp < currentTime;
    } catch (error) {
        // If we can't decode the token, consider it expired
        return true;
    }
};

// Utility function to get token expiration time
export const getTokenExpirationTime = (token: string): number | null => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000; // Convert to milliseconds
    } catch (error) {
        return null;
    }
};

// Utility function to get time until token expires
export const getTimeUntilExpiration = (token: string): number | null => {
    const expirationTime = getTokenExpirationTime(token);
    if (!expirationTime) return null;
    
    return expirationTime - Date.now();
};
