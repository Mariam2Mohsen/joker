import { useState, useEffect } from 'react';
import { fetchAllProviders } from '../api/providerApi';

export const useProviders = () => {
    const [providers, setProviders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getProviders = async () => {
            try {
                setIsLoading(true);
                const data = await fetchAllProviders();
                setProviders(data);
                setError(null);
            } catch (err) {
                console.error("Error in useProviders hook:", err);
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        getProviders();
    }, []);

    return { providers, isLoading, error };
};
