import React, { useRef, useEffect } from 'react';
import { Filter } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * ServiceFilter Component
 * 
 * A horizontal scrollable list of category filters for the service grid.
 * Adheres to Fluent UI design principles with generous touch targets and clear active states.
 */
const ServiceFilter = ({ activeCategory, onCategoryChange, categories, isDarkMode }) => {
    const scrollContainerRef = useRef(null);

    // Scroll active category into view on mount or change
    useEffect(() => {
        if (activeCategory && scrollContainerRef.current) {
            const activeBtn = scrollContainerRef.current.querySelector(`[data-category="${activeCategory}"]`);
            if (activeBtn) {
                activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }
    }, [activeCategory]);

    return (
        <div className="flex items-center w-full">
            {/* Filter Icon Indicator */}
            <div className={`shrink-0 mr-3 pl-1 ${isDarkMode ? 'text-[#c8c6c4]' : 'text-[#605e5c]'}`}>
                <Filter className="w-5 h-5" />
            </div>

            {/* Scrollable Container */}
            <div
                ref={scrollContainerRef}
                className="flex items-center bg-transparent overflow-x-auto gap-3 py-2 px-1 w-full scrollbar-none mask-fade-sides"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    // Optional: Mask to show scroll hint
                    maskImage: 'linear-gradient(to right, transparent, black 10px, black 90%, transparent)'
                }}
            >
                {categories.map(cat => (
                    <button
                        key={cat}
                        data-category={cat}
                        onClick={() => onCategoryChange(cat)}
                        className={`
                            shrink-0 px-4 py-1.5 text-[14px] font-medium rounded-full transition-all duration-200 border
                            focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#0078d4]
                            ${activeCategory === cat
                                ? (isDarkMode
                                    ? 'bg-primary-gradient border-transparent text-white shadow-md'
                                    : 'bg-primary-gradient border-transparent text-white shadow-md'
                                )
                                : (isDarkMode
                                    ? 'bg-transparent border-[#484644] text-[#c8c6c4] hover:bg-[#323130] hover:border-[#8a8886]'
                                    : 'bg-transparent border-[#edebe9] text-[#605e5c] hover:bg-[#f3f2f1] hover:border-[#8a8886]'
                                )
                            }
                        `}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
    );
};

ServiceFilter.propTypes = {
    activeCategory: PropTypes.string.isRequired,
    onCategoryChange: PropTypes.func.isRequired,
    categories: PropTypes.arrayOf(PropTypes.string).isRequired,
    isDarkMode: PropTypes.bool.isRequired
};

export default ServiceFilter;
