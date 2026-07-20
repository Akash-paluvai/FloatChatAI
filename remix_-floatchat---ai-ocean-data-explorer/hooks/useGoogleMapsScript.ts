import { useState, useEffect } from 'react';

// IMPORTANT: Replace this placeholder with your actual Google Maps API key.
// You can get a key from the Google Cloud Platform: https://cloud.google.com/maps-platform/
const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY_HERE";

// Use a singleton pattern to ensure the script is only loaded once.
let isScriptLoaded = false;
let loadingPromise: Promise<void> | null = null;
const activeListeners: ((error?: Error) => void)[] = [];

const loadScript = () => {
    if (!loadingPromise) {
        loadingPromise = new Promise<void>((resolve, reject) => {
            // Check if script is already on the page (e.g., from a previous session)
            if (document.querySelector('script[src*="maps.googleapis.com"]')) {
                isScriptLoaded = true;
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&map_ids=FLOAT_CHAT_MAP`;
            script.async = true;
            script.defer = true;
            
            script.onload = () => {
                isScriptLoaded = true;
                resolve();
            };
            
            script.onerror = () => {
                reject(new Error('Failed to load Google Maps script. Check the API key and network connection.'));
            };
            
            document.head.appendChild(script);
        });
        
        loadingPromise
            .then(() => activeListeners.forEach(cb => cb()))
            .catch(err => activeListeners.forEach(cb => cb(err)));
    }
};

export const useGoogleMapsScript = () => {
    const [isLoaded, setIsLoaded] = useState(isScriptLoaded);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        // The check for a missing key is no longer needed since we have a placeholder.
        // Google Maps will show an error on the map itself if the key is invalid or missing.
        if (isScriptLoaded) {
            setIsLoaded(true);
            return;
        }

        const listener = (err?: Error) => {
            if (err) {
                setError(err);
            } else {
                setIsLoaded(true);
            }
        };

        activeListeners.push(listener);
        loadScript();

        return () => {
            // Remove listener on cleanup
            const index = activeListeners.indexOf(listener);
            if (index > -1) {
                activeListeners.splice(index, 1);
            }
        };
    }, []);

    return { isLoaded, error };
};
