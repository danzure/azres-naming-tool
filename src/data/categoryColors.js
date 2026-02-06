// Category color theme based on Azure/Fluent UI design palette
// Each category has a light mode and dark mode variant for the icon container
export const CATEGORY_COLORS = {
    'General': {
        light: { bg: '#e5dfec', icon: '#7c3aed' },      // Purple
        dark: { bg: '#3b2d5c', icon: '#a78bfa' }
    },
    'Compute': {
        light: { bg: '#dbeafe', icon: '#2563eb' },      // Blue
        dark: { bg: '#1e3a5f', icon: '#60a5fa' }
    },
    'Networking': {
        light: { bg: '#d1fae5', icon: '#059669' },      // Green
        dark: { bg: '#064e3b', icon: '#34d399' }
    },
    'Storage': {
        light: { bg: '#fef3c7', icon: '#d97706' },      // Amber
        dark: { bg: '#78350f', icon: '#fbbf24' }
    },
    'Web': {
        light: { bg: '#fce7f3', icon: '#db2777' },      // Pink
        dark: { bg: '#831843', icon: '#f472b6' }
    },
    'Databases': {
        light: { bg: '#e0e7ff', icon: '#4f46e5' },      // Indigo
        dark: { bg: '#312e81', icon: '#818cf8' }
    },
    'Containers': {
        light: { bg: '#cffafe', icon: '#0891b2' },      // Cyan
        dark: { bg: '#164e63', icon: '#22d3ee' }
    },
    'Security': {
        light: { bg: '#fee2e2', icon: '#dc2626' },      // Red
        dark: { bg: '#7f1d1d', icon: '#f87171' }
    },
    'Integration': {
        light: { bg: '#fbcfe8', icon: '#c026d3' },      // Fuchsia
        dark: { bg: '#701a75', icon: '#e879f9' }
    },
    'Analytics': {
        light: { bg: '#fed7aa', icon: '#ea580c' },      // Orange
        dark: { bg: '#7c2d12', icon: '#fb923c' }
    },
    'AI + ML': {
        light: { bg: '#d9f99d', icon: '#65a30d' },      // Lime
        dark: { bg: '#365314', icon: '#a3e635' }
    },
    'Management + Governance': {
        light: { bg: '#e2e8f0', icon: '#475569' },      // Slate
        dark: { bg: '#334155', icon: '#94a3b8' }
    },
    'IoT': {
        light: { bg: '#ccfbf1', icon: '#0d9488' },      // Teal
        dark: { bg: '#134e4a', icon: '#2dd4bf' }
    },
    'DevOps': {
        light: { bg: '#fef9c3', icon: '#ca8a04' },      // Yellow
        dark: { bg: '#713f12', icon: '#facc15' }
    }
};

// Helper function to get colors for a category
export function getCategoryColors(category, isDarkMode) {
    const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS['General'];
    return isDarkMode ? colors.dark : colors.light;
}
