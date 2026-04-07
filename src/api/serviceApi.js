import axios from 'axios';
import { fetchAllProviders } from './providerApi';

const BASE_URL = 'https://joker-hm0k.onrender.com/api';



const ZERO_STATE_SVG = `data:image/svg+xml,%3Csvg width='800' height='600' viewBox='0 0 800 600' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='800' height='600' fill='%23FEFAF6'/%3E%3Cpath d='M0 0l800 600M800 0L0 600' stroke='%23EADBC8' stroke-width='2' opacity='0.3'/%3E%3Crect x='300' y='200' width='200' height='200' rx='40' fill='%23102C57' opacity='0.05'/%3E%3Ctext x='400' y='310' font-family='Arial, sans-serif' font-size='24' font-weight='900' fill='%23102C57' opacity='0.2' text-anchor='middle' text-transform='uppercase' letter-spacing='4'%3ENO IMAGE%3C/text%3E%3C/svg%3E`;

const getServiceImage = (existingImage) => {
    if (!existingImage || String(existingImage).trim() === '') return ZERO_STATE_SVG;

    const img = String(existingImage).trim();

    // Already a full URL
    if (img.startsWith('http://') || img.startsWith('https://')) return img;

    // Server-relative path
    if (img.startsWith('/')) return `https://joker-hm0k.onrender.com${img}`;

    // Filename or relative path with extension
    if (img.includes('.')) return `/uploads/${img}`;

    return ZERO_STATE_SVG;
};

// Resolve a gallery entry which may be a string URL or an object with an image field
const resolveGalleryImage = (entry) => {
    if (!entry) return ZERO_STATE_SVG;
    if (typeof entry === 'string') return getServiceImage(entry);
    // Object from backend e.g. { image_url: '...', image: '...' }
    const raw = entry.image_url || entry.image || entry.url || entry.path || '';
    return getServiceImage(raw);
};

/**
 * Fetch all active services from the backend API.
 */
export const fetchAllServices = async () => {
    try {
        const response = await axios.get(`/uploads/services.json?v=${new Date().getTime()}`);
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
            
            const providerData = activeProviders.length > 0 ? activeProviders[service.service_id % activeProviders.length] : null;
            const providerName = providerData ? providerData.name : 'Verified Expert';
            const providerAvatar = providerData ? providerData.avatar : null;

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
                providerAvatar,
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
        const response = await axios.get(`/uploads/services.json?v=${new Date().getTime()}`);
        const data = response.data.data || [];
        const service = data.find(s => String(s.service_id) === String(id)) || data.find(s => String(s.id) === String(id));
        if (!service) return null;
        
        let activeProviders = [];
        try {
            activeProviders = await fetchAllProviders();
        } catch(e) {}

        const providerData = activeProviders.length > 0 ? activeProviders[service.service_id % activeProviders.length] : null;
        const providerName = providerData ? providerData.name : 'Verified Expert';
        const providerAvatar = providerData ? providerData.avatar : null;

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
            gallery: (service.gallery || service.service_images || []).map(entry => resolveGalleryImage(entry)),
            availability: availabilityKey,
            provider: providerName, 
            providerAvatar,
            distance: 2.5,
            completedJobs: 45,
            pricingTypes: service.pricing_types
        };
    } catch (error) {
        console.error(`Error fetching service ${id}:`, error);
        throw error;
    }
};
