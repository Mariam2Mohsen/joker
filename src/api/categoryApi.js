import axios from "axios";
const BASE_URL = "https://joker-hm0k.onrender.com/api";
const IMAGE_BASE_URL = "https://joker-hm0k.onrender.com/images";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
};

const getSuitableImage = (existingImage) => {
  const ZERO_STATE_SVG = `data:image/svg+xml,%3Csvg width='800' height='600' viewBox='0 0 800 600' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='800' height='600' fill='%23FEFAF6'/%3E%3Cpath d='M0 0l800 600M800 0L0 600' stroke='%23EADBC8' stroke-width='2' opacity='0.3'/%3E%3Crect x='300' y='200' width='200' height='200' rx='40' fill='%23102C57' opacity='0.05'/%3E%3Ctext x='400' y='310' font-family='Arial, sans-serif' font-size='24' font-weight='900' fill='%23102C57' opacity='0.2' text-anchor='middle' text-transform='uppercase' letter-spacing='4'%3ENO IMAGE%3C/text%3E%3C/svg%3E`;

  if (!existingImage || String(existingImage).trim() === '') return ZERO_STATE_SVG;

  const s = String(existingImage).trim();
  const publicUrl = process.env.PUBLIC_URL || '';
  
  if (s.startsWith('http')) return s;
  if (s.startsWith('/uploads/')) return `${publicUrl}${s}`;

  const filename = s.split('/').pop();

  if (filename && filename.includes('.')) {
    const lowerName = filename.toLowerCase();
    
    // Check for our known premium localized assets first
    const IMAGE_PATH_MAP = {
        '1775509998749-cleaning.png': '/uploads/services/',
        '1775510029153-plumbing.jpeg': '/uploads/services/',
        '1775510050327-electrical.jpeg': '/uploads/services/',
        '1775510116879-delivery.jpeg': '/uploads/gallery/',
        '1775510137541-tutoring.jpeg': '/uploads/gallery/',
    };
    
    const path = IMAGE_PATH_MAP[lowerName];
    if (path) return `${publicUrl}${path}${filename}`;

    // Common names that stay in root uploads
    if (lowerName.includes('beauty') || lowerName.includes('health') || lowerName.includes('carwash') || lowerName.includes('repair') || lowerName.includes('it')) {
        return `${publicUrl}/uploads/${filename}`;
    }

    // Default to backend server for anything else from database
    return `https://joker-hm0k.onrender.com/images/${filename}`;
  }

  return ZERO_STATE_SVG;
};

export const fetchCategoriesWithSubcategories = async () => {
  const [categoriesRes, subcategoriesRes] = await Promise.all([
    apiClient.get("/categories?status=Active"),
    apiClient.get("/subcategories"),
  ]);

  const categories = Array.isArray(categoriesRes.data.data)
    ? categoriesRes.data.data
    : [];
  const subcategories = Array.isArray(subcategoriesRes.data.data)
    ? subcategoriesRes.data.data
    : [];

  return categories.map((cat) => ({
    ...cat,
    id: String(cat.category_id),
    slug: cat.slug || slugify(cat.name),
    image: getSuitableImage(cat.image),
    avgRating: Number(cat.rate) <= 5 && Number(cat.rate) > 0 ? cat.rate : "4.8",
    rate: "$25/hr",
    subCategories: (subcategories || [])
      .filter((sub) => String(sub.category_id) === String(cat.category_id))
      .map((sub) => ({
        id: String(sub.id),
        name: sub.name,
        description: sub.description,
        rating: 5.0,
      })),
  }));
};

export const fetchCategoryBySlug = async (slug) => {
  const categories = await fetchCategoriesWithSubcategories();
  return categories.find((c) => c.slug === slug) || null;
};

export const fetchTopCategories = async (limit = 6) => {
  const categories = await fetchCategoriesWithSubcategories();
  return categories.slice(0, limit);
};
