export const CATEGORIES = ["Cleaning", "Plumbing", "Electrical", "Painting", "Carpentry"];

export const SUB_CATEGORIES = {
  Cleaning: ["Home Cleaning", "Office Cleaning"],
  Plumbing: ["Pipe Fix", "Installation"],
  Electrical: ["Wiring", "Lighting"],
  Painting: ["Interior", "Exterior"],
  Carpentry: ["Furniture", "Doors"],
};

export const SERVICES = ["Basic", "Premium", "Standard"];

export const PRICING_TYPES = ["Fixed", "Hourly", "Per Item"];

export const NAV_ITEMS = [
  { label: "Main", icon: "⊞", hasChildren: true },
  { label: "Category Management", icon: "⊙", hasChildren: true },
  {
    label: "Service Management",
    icon: "⚙",
    hasChildren: true,
    active: true,
    children: ["Services List", "Add new Service"],
  },
  { label: "Booking Management", icon: "📋", hasChildren: true },
  { label: "Providers Management", icon: "👥", hasChildren: true },
  { label: "Payout", icon: "💳", hasChildren: true },
  { label: "Customer Management", icon: "👤", hasChildren: true },
  { label: "System Users", icon: "🔧", hasChildren: true },
  { label: "Points & Cashback\nManagement", icon: "⭐", hasChildren: true },
];