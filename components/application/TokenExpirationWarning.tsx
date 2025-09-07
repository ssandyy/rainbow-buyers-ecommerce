"use client"

import { useEffect, useState } from "react";
import { isTokenExpired, getTimeUntilExpiration } from "@/lib/jwtUtils";

interface TokenExpirationWarningProps {
    onLogout: () => void;
}

const TokenExpirationWarning = ({ onLogout }: TokenExpirationWarningProps) => {
    const [showWarning, setShowWarning] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    useEffect(() => {
        const checkTokenExpiration = () => {
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('access_token='))
                ?.split('=')[1];

            if (!token) return;

            const timeUntilExpiry = getTimeUntilExpiration(token);
            
            if (timeUntilExpiry && timeUntilExpiry < 5 * 60 * 1000) { // Less than 5 minutes
                setShowWarning(true);
                setTimeLeft(timeUntilExpiry);
            } else {
                setShowWarning(false);
            }
        };

        // Check immediately
        checkTokenExpiration();

        // Check every minute
        const interval = setInterval(checkTokenExpiration, 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (timeLeft && timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1000);
            }, 1000);

            return () => clearTimeout(timer);
        } else if (timeLeft === 0) {
            // Token expired, logout user
            onLogout();
        }
    }, [timeLeft, onLogout]);

    if (!showWarning) return null;

    const minutes = Math.floor((timeLeft || 0) / 60000);
    const seconds = Math.floor(((timeLeft || 0) % 60000) / 1000);

    return (
        <div className="fixed top-4 right-4 bg-yellow-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="font-semibold">Session Expiring Soon</h4>
                    <p className="text-sm">
                        Your session will expire in {minutes}:{seconds.toString().padStart(2, '0')}
                    </p>
                    <p className="text-xs mt-1">
                        We're trying to refresh your session automatically...
                    </p>
                </div>
                <button
                    onClick={onLogout}
                    className="ml-2 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default TokenExpirationWarning;



