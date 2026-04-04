import axios from 'axios';
import { fetchAllProviders } from './providerApi';

const BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

const getServiceImage = (existingImage) => {
    // Zero State placeholder (Beautifully patterned SVG)
    const ZERO_STATE_SVG = `data:image/svg+xml,%3Csvg width='800' height='600' viewBox='0 0 800 600' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='800' height='600' fill='%23FEFAF6'/%3E%3Cpath d='M0 0l800 600M800 0L0 600' stroke='%23EADBC8' stroke-width='2' opacity='0.3'/%3E%3Crect x='300' y='200' width='200' height='200' rx='40' fill='%23102C57' opacity='0.05'/%3E%3Ctext x='400' y='310' font-family='Arial, sans-serif' font-size='24' font-weight='900' fill='%23102C57' opacity='0.2' text-anchor='middle' text-transform='uppercase' letter-spacing='4'%3ENO IMAGE%3C/text%3E%3C/svg%3E`;

    if (existingImage && (existingImage.startsWith('http') || existingImage.includes('.'))) {
        if (existingImage.startsWith('http')) return existingImage;
        return `http://localhost:5000/images/${existingImage}`;
    }

    return ZERO_STATE_SVG;
};

/**
 * Fetch all active services from the backend API.
 */
export const fetchAllServices = async () => {
    try {
        const response = await apiClient.get('/services');
        const data = response.data.data || [];
        
        let activeProviders = [];
        try {
            activeProviders = await fetchAllProviders();
        } catch (e) {
            console.error("Could not fetch providers for services", e);
        }

        // Map backend data to frontend ServiceCard expectations
        return data.map(service => {
            let price = service.discount ? (100 - service.discount) : 50; 
            let unit = 'EGP';
            if (service.pricing_types && service.pricing_types.length > 0) {
                const pricing = service.pricing_types[0];
                price = pricing.max_price || price;
                if (pricing.type === 'Hourly') unit = 'EGP/hr';
                else if (pricing.type === 'Fixed') unit = 'EGP';
                else if (pricing.type === 'Negotiable') unit = 'EGP (est)';
            }
            
            const providerName = activeProviders.length > 0 
                ? activeProviders[service.service_id % activeProviders.length].name 
                : 'Verified Expert';

            const statusLower = (service.status || '').toLowerCase();
            let availabilityKey = 'not_available';
            if (statusLower === 'active' || statusLower === 'available') {
                availabilityKey = 'available';
            } else if (statusLower === 'booked') {
                availabilityKey = 'booked';
            }

            return {
                id: String(service.service_id),
                name: service.name,
                description: service.description || '', 
                categoryId: String(service.category_id),
                categoryName: service.category_name,
                subCategoryId: String(service.sub_category_id),
                subCategoryName: service.sub_category_name,
                price: parseFloat(price),
                unit,
                rating: (service.rate && service.rate > 0) ? parseFloat(service.rate) : 4.8,
                image: getServiceImage(service.image),
                availability: availabilityKey,
                provider: providerName, 
                distance: parseFloat((Math.random() * 5 + 1).toFixed(1)),
                completedJobs: Math.floor(Math.random() * 100) + 10,
                pricingTypes: service.pricing_types
            };
        });
    } catch (error) {
        console.error("Error fetching services:", error);
        throw error;
    }
};

/**
 * Fetch a specific service by ID
 */
export const fetchServiceById = async (id) => {
    try {
        const response = await apiClient.get(`/services/${id}`);
        const service = response.data.data;
        if (!service) return null;
        
        let activeProviders = [];
        try {
            activeProviders = await fetchAllProviders();
        } catch(e) {}

        const providerName = activeProviders.length > 0 
            ? activeProviders[service.service_id % activeProviders.length].name 
            : 'Verified Expert';

        let price = service.discount ? (100 - service.discount) : 50; 
        let unit = 'EGP';
        if (service.pricing_types && service.pricing_types.length > 0) {
            const pricing = service.pricing_types[0];
            price = pricing.max_price || price;
            if (pricing.type === 'Hourly') unit = 'EGP/hr';
            else if (pricing.type === 'Fixed') unit = 'EGP';
        }
        
        const statusLower = (service.status || '').toLowerCase();
        let availabilityKey = 'not_available';
        if (statusLower === 'active' || statusLower === 'available') {
            availabilityKey = 'available';
        } else if (statusLower === 'booked') {
            availabilityKey = 'booked';
        }

        return {
            id: String(service.service_id),
            name: service.name,
            description: service.description || service.category_description || '',
            categoryId: String(service.category_id),
            categoryName: service.category_name,
            subCategoryId: String(service.sub_category_id),
            subCategoryName: service.sub_category_name,
            price: parseFloat(price),
            unit,
            rating: (service.rate && service.rate > 0) ? parseFloat(service.rate) : 4.8,
            image: getServiceImage(service.image),
            gallery: (service.gallery || []).map(img => getServiceImage(img)),
            availability: availabilityKey,
            provider: providerName, 
            distance: 2.5,
            completedJobs: 45,
            pricingTypes: service.pricing_types
        };
    } catch (error) {
        console.error(`Error fetching service ${id}:`, error);
        throw error;
    }
};
