import { useState, useEffect } from 'react';
import { fetchAllServices, fetchServiceById } from '../api/serviceApi';

/**
 * Hook to fetch all services
 */
export const useServices = () => {
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getServices = async () => {
            try {
                setIsLoading(true);
                const data = await fetchAllServices();
                setServices(data);
                setError(null);
            } catch (err) {
                console.error("Error in useServices hook:", err);
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        getServices();
    }, []);

    return { services, isLoading, error };
};

/**
 * Hook to fetch a single service by ID
 */
export const useServiceById = (id) => {
    const [service, setService] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) {
            setIsLoading(false);
            return;
        }

        const getService = async () => {
            try {
                setIsLoading(true);
                const data = await fetchServiceById(id);
                setService(data);
                setError(null);
            } catch (err) {
                console.error(`Error in useServiceById hook for id ${id}:`, err);
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        getService();
    }, [id]);

    return { service, isLoading, error };
};
