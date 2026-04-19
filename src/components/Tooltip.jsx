import PropTypes from 'prop-types';

/**
 * Tooltip Component
 * 
 * A simple wrapper component that displays an absolute-positioned tooltip box
 * when hovering over its children. The tooltip appears directly below the target.
 * 
 * @param {Object} props
 * @param {string} props.content - Text to display inside the tooltip.
 * @param {React.ReactNode} props.children - Element the tooltip is attached to.
 * @returns {JSX.Element}
 */
export default function Tooltip({ content, children }) {
    if (!content) return children;

    return (
        <div className="relative group">
            {children}
            <div className="absolute left-0 top-full mt-1 px-2 py-1 text-[11px] rounded shadow-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 bg-[#242424] dark:bg-[#323130] text-white">
                {content}
            </div>
        </div>
    );
}

Tooltip.propTypes = {
    content: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};
