/**
 * Category Color Definitions
 * 
 * Defines the standard color palette mapping for each Azure resource category.
 * Each category provides specific Tailwind background and text color classes 
 * that automatically handle both light and dark mode themes.
 * Designed to align with the official Microsoft Fluent UI semantic color palette.
 */
export const CATEGORY_COLORS = {
    'General': { bgClass: 'bg-[#EFF6FC] dark:bg-[#00245B]', textClass: 'text-[#0078D4] dark:text-[#2899F5]' }, // MS Blue
    'Compute': { bgClass: 'bg-[#EFF6FC] dark:bg-[#00245B]', textClass: 'text-[#0078D4] dark:text-[#2899F5]' }, // MS Blue
    'Networking': { bgClass: 'bg-[#FDF6F3] dark:bg-[#4A1600]', textClass: 'text-[#D83B01] dark:text-[#F36F38]' }, // MS Orange
    'Storage': { bgClass: 'bg-[#F3F9F1] dark:bg-[#062906]', textClass: 'text-[#107C10] dark:text-[#42A142]' }, // MS Green
    'Web': { bgClass: 'bg-[#F6F3F9] dark:bg-[#200D3B]', textClass: 'text-[#5C2D91] dark:text-[#8D64C5]' }, // MS Purple
    'Databases': { bgClass: 'bg-[#EAF8FC] dark:bg-[#00384B]', textClass: 'text-[#00BCF2] dark:text-[#3ED1F6]' }, // MS Cyan
    'Containers': { bgClass: 'bg-[#EBF7F7] dark:bg-[#002A2B]', textClass: 'text-[#038387] dark:text-[#32B4B8]' }, // MS Teal
    'Security': { bgClass: 'bg-[#FDF3F4] dark:bg-[#43020A]', textClass: 'text-[#D13438] dark:text-[#F46B70]' }, // MS Red
    'Integration': { bgClass: 'bg-[#FCF0F6] dark:bg-[#3D0026]', textClass: 'text-[#B4009E] dark:text-[#D13FB8]' }, // MS Magenta
    'Analytics': { bgClass: 'bg-[#FFF9E6] dark:bg-[#4C3B00]', textClass: 'text-[#FFB900] dark:text-[#FFCE40]' }, // MS Yellow
    'AI + ML': { bgClass: 'bg-[#EAF8FC] dark:bg-[#00384B]', textClass: 'text-[#00BCF2] dark:text-[#3ED1F6]' }, // MS Cyan
    'Management + Governance': { bgClass: 'bg-[#F3F2F1] dark:bg-[#323130]', textClass: 'text-[#605E5C] dark:text-[#C8C6C4]' }, // MS Neutral
    'IoT': { bgClass: 'bg-[#EBF7F7] dark:bg-[#002A2B]', textClass: 'text-[#038387] dark:text-[#32B4B8]' }, // MS Teal
    'Desktop Virtualization': { bgClass: 'bg-[#EFF6FC] dark:bg-[#00245B]', textClass: 'text-[#0078D4] dark:text-[#2899F5]' }, // MS Blue
    'DevOps': { bgClass: 'bg-[#F6F3F9] dark:bg-[#200D3B]', textClass: 'text-[#5C2D91] dark:text-[#8D64C5]' } // MS Purple
};

// Helper function to get classes for a category
export function getCategoryColors(category) {
    return CATEGORY_COLORS[category] || CATEGORY_COLORS['General'];
}
