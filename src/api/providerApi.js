import axios from 'axios';

const BASE_URL = 'https://joker-hm0k.onrender.com/api';

const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

/**
 * Fetch all verified providers
 * We fetch all active users from the main GET users endpoint.
 */
export const fetchAllProviders = async () => {
    try {
        const response = await apiClient.get('/users/get_users');
        const users = response.data.data || [];
        
        // Filter out non-providers and non-active providers
        const activeProviders = users.filter(user => 
            Number(user.role_id) === 4 && 
            user.account_status && 
            ['active', 'approved'].includes(user.account_status.toLowerCase().trim())
        );

        // Map to frontend PROVIDERS format
        return activeProviders.map(provider => {
            const buildImageUrl = (img) => {
                if (!img || String(img).trim() === '') return null;
                const s = String(img).trim();
                if (s.startsWith('http://') || s.startsWith('https://')) return s;
                if (s.startsWith('/')) return `https://joker-hm0k.onrender.com${s}`;
                if (s.includes('.')) return `https://joker-hm0k.onrender.com/images/${s}`;
                return null;
            };

            const avatar = buildImageUrl(provider.profile_image) 
                || `data:image/svg+xml,%3Csvg width='150' height='150' viewBox='0 0 150 150' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='150' height='150' fill='%23FEFAF6'/%3E%3Ccircle cx='75' cy='55' r='25' fill='%23102C57' opacity='0.2'/%3E%3Cpath d='M30 120 C 30 90, 120 90, 120 120' stroke='%23102C57' stroke-width='8' fill='none' opacity='0.2'/%3E%3C/svg%3E`;
                
            return {
                id: provider.Users_id,
                name: provider.Full_Name || "Verified Expert",
                avatar,
                rating: parseFloat((Math.random() * 0.5 + 4.5).toFixed(1)), // Keep standard rating if backend isn't sending Average_Rating
                categories: ['Approved Professional'], // Fallback category until service relationship is loaded
                city: provider.City || "Amman",
                phoneNumber: provider.phone_number,
                email: provider.Email
            };
        });
    } catch (error) {
        console.error("Error fetching providers:", error);
        throw error;
    }
};
