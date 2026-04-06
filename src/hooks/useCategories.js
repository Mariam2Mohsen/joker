import { useState, useEffect } from 'react';
import { 
    fetchCategoriesWithSubcategories, 
    fetchCategoryBySlug, 
    fetchTopCategories 
} from '../api/categoryApi';


export const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getCategories = async () => {
            try {
                setIsLoading(true);
                const data = await fetchCategoriesWithSubcategories();
                setCategories(data);
                setError(null);
            } catch (err) {
                console.error("Error in useCategories hook:", err);
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        getCategories();
    }, []);

    return { categories, isLoading, error };
};


export const useTopCategories = (limit = 6) => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getTopCategories = async () => {
            try {
                setIsLoading(true);
                const data = await fetchTopCategories(limit);
                setCategories(data);
                setError(null);
            } catch (err) {
                console.error("Error in useTopCategories hook:", err);
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        getTopCategories();
    }, [limit]);

    return { categories, isLoading, error };
};

export const useCategoryBySlug = (slug) => {
    const [category, setCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!slug) {
            setIsLoading(false);
            return;
        }

        const getCategory = async () => {
            try {
                setIsLoading(true);
                const data = await fetchCategoryBySlug(slug);
                setCategory(data);
                setError(null);
            } catch (err) {
                console.error(`Error in useCategoryBySlug hook for slug ${slug}:`, err);
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        getCategory();
    }, [slug]);

    return { category, isLoading, error };
};
