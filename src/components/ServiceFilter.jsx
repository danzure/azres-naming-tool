import React, { useRef, useEffect, useState } from 'react';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * ServiceFilter Component
 * 
 * A horizontal scrollable list of category filters for the service grid.
 * Adheres to Fluent UI design principles with generous touch targets and clear active states.
 * Includes desktop-friendly scroll navigation buttons.
 * 
 * @param {Object} props
 * @param {string} props.activeCategory - The name of the currently selected category filter.
 * @param {Function} props.onCategoryChange - Callback fired when a new category is selected.
 * @param {Array<string>} props.categories - List of all available category names.
 * @returns {JSX.Element}
 */
const ServiceFilter = ({ activeCategory, onCategoryChange, categories }) => {
    const scrollContainerRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const checkScrollRef = useRef(false);
    const checkScroll = () => {
        if (checkScrollRef.current) return;
        checkScrollRef.current = true;
        requestAnimationFrame(() => {
            if (scrollContainerRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
                setCanScrollLeft(scrollLeft > 0);
                setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
            }
            checkScrollRef.current = false;
        });
    };

    // Correctly initialize scroll state and attach listeners
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            checkScroll();
            container.addEventListener('scroll', checkScroll);
            window.addEventListener('resize', checkScroll);

            return () => {
                container.removeEventListener('scroll', checkScroll);
                window.removeEventListener('resize', checkScroll);
            };
        }
    }, [categories]);

    // Update scroll state when categories change or active category changes (in case of auto-scroll)
    useEffect(() => {
        checkScroll();
    }, [activeCategory, categories]);

    // Scroll active category into view on mount or change
    useEffect(() => {
        if (activeCategory && scrollContainerRef.current) {
            const activeBtn = scrollContainerRef.current.querySelector(`[data-category="${activeCategory}"]`);
            if (activeBtn) {
                // Use a timeout to ensure layout is complete before scrolling
                setTimeout(() => {
                    activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                    // Re-check scroll buttons after auto-scroll animation (approx 300ms)
                    setTimeout(checkScroll, 350);
                }, 100);
            }
        }
    }, [activeCategory]);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 200;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="flex items-center w-full relative group">
            {/* Filter Icon Indicator */}
            <div className="shrink-0 mr-3 pl-1 text-[#605e5c] dark:text-[#c8c6c4]">
                <Filter className="w-5 h-5" />
            </div>

            {/* Scroll Left Button */}
            {canScrollLeft && (
                <div className="absolute left-8 z-10 h-full flex items-center pr-4 bg-gradient-to-r from-transparent to-transparent">
                    <button
                        onClick={() => scroll('left')}
                        className="p-1.5 rounded-full shadow-md border focus:outline-none transition-all bg-white dark:bg-[#252423] border-[#edebe9] dark:border-[#484644] text-[#605e5c] dark:text-white hover:bg-[#f3f2f1] dark:hover:bg-[#323130]"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Scrollable Container */}
            <div
                ref={scrollContainerRef}
                className="flex items-center bg-transparent overflow-x-auto gap-3 py-2 px-1 w-full scrollbar-none mask-fade-sides transition-all"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    // Dynamic mask to show scroll hint only when needed
                    maskImage: `linear-gradient(to right, ${canScrollLeft ? 'transparent' : 'black'} 0%, black 40px, black calc(100% - 40px), ${canScrollRight ? 'transparent' : 'black'} 100%)`,
                    WebkitMaskImage: `linear-gradient(to right, ${canScrollLeft ? 'transparent' : 'black'} 0%, black 40px, black calc(100% - 40px), ${canScrollRight ? 'transparent' : 'black'} 100%)`
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
                                ? 'bg-primary-gradient border-transparent text-white shadow-md'
                                : 'bg-transparent border-[#edebe9] dark:border-[#484644] text-[#605e5c] dark:text-[#c8c6c4] hover:bg-[#f3f2f1] dark:hover:bg-[#323130] hover:border-[#8a8886] dark:hover:border-[#8a8886]'
                            }
                        `}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Scroll Right Button */}
            {canScrollRight && (
                <div className="absolute right-0 z-10 h-full flex items-center pl-4 bg-gradient-to-l from-transparent to-transparent">
                    <button
                        onClick={() => scroll('right')}
                        className="p-1.5 rounded-full shadow-md border focus:outline-none transition-all bg-white dark:bg-[#252423] border-[#edebe9] dark:border-[#484644] text-[#605e5c] dark:text-white hover:bg-[#f3f2f1] dark:hover:bg-[#323130]"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
};

ServiceFilter.propTypes = {
    activeCategory: PropTypes.string.isRequired,
    onCategoryChange: PropTypes.func.isRequired,
    categories: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default ServiceFilter;
