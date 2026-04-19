/**
 * Category Color Definitions
 * 
 * Defines the standard color palette mapping for each Azure resource category.
 * Each category provides specific Tailwind background and text color classes 
 * that automatically handle both light and dark mode themes.
 * Designed to align with Fluent UI design principles.
 */
export const CATEGORY_COLORS = {
    'General': { bgClass: 'bg-[#e5dfec] dark:bg-[#3b2d5c]', textClass: 'text-[#7c3aed] dark:text-[#a78bfa]' },      // Purple
    'Compute': { bgClass: 'bg-[#dbeafe] dark:bg-[#1e3a5f]', textClass: 'text-[#2563eb] dark:text-[#60a5fa]' },      // Blue
    'Networking': { bgClass: 'bg-[#d1fae5] dark:bg-[#064e3b]', textClass: 'text-[#059669] dark:text-[#34d399]' },      // Green
    'Storage': { bgClass: 'bg-[#fef3c7] dark:bg-[#78350f]', textClass: 'text-[#d97706] dark:text-[#fbbf24]' },      // Amber
    'Web': { bgClass: 'bg-[#fce7f3] dark:bg-[#831843]', textClass: 'text-[#db2777] dark:text-[#f472b6]' },      // Pink
    'Databases': { bgClass: 'bg-[#e0e7ff] dark:bg-[#312e81]', textClass: 'text-[#4f46e5] dark:text-[#818cf8]' },      // Indigo
    'Containers': { bgClass: 'bg-[#cffafe] dark:bg-[#164e63]', textClass: 'text-[#0891b2] dark:text-[#22d3ee]' },      // Cyan
    'Security': { bgClass: 'bg-[#fee2e2] dark:bg-[#7f1d1d]', textClass: 'text-[#dc2626] dark:text-[#f87171]' },      // Red
    'Integration': { bgClass: 'bg-[#fbcfe8] dark:bg-[#701a75]', textClass: 'text-[#c026d3] dark:text-[#e879f9]' },      // Fuchsia
    'Analytics': { bgClass: 'bg-[#fed7aa] dark:bg-[#7c2d12]', textClass: 'text-[#ea580c] dark:text-[#fb923c]' },      // Orange
    'AI + ML': { bgClass: 'bg-[#d9f99d] dark:bg-[#365314]', textClass: 'text-[#65a30d] dark:text-[#a3e635]' },      // Lime
    'Management + Governance': { bgClass: 'bg-[#e2e8f0] dark:bg-[#334155]', textClass: 'text-[#475569] dark:text-[#94a3b8]' },      // Slate
    'IoT': { bgClass: 'bg-[#ccfbf1] dark:bg-[#134e4a]', textClass: 'text-[#0d9488] dark:text-[#2dd4bf]' },      // Teal
    'DevOps': { bgClass: 'bg-[#fef9c3] dark:bg-[#713f12]', textClass: 'text-[#ca8a04] dark:text-[#facc15]' }       // Yellow
};

// Helper function to get classes for a category
export function getCategoryColors(category) {
    return CATEGORY_COLORS[category] || CATEGORY_COLORS['General'];
}
