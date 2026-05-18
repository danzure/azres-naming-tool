import React, { useState } from 'react';
import { Info, Lightbulb, Copy, Check } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * AboutCard Component
 * 
 * Renders the descriptive information panel for a specific Azure resource.
 * Displays the resource's purpose, a direct link to the Microsoft documentation,
 * and standard CAF (Cloud Adoption Framework) naming guidance/patterns if available.
 * 
 * @param {Object} props
 * @param {Object} props.resource - Resource definition containing learnUrl and longDesc.
 * @param {string} props.displayDesc - Primary description text (can optionally be overridden).
 * @param {string} props.namingPattern - Optional explicit naming pattern (e.g., '[rg]-[name]-[env]').
 * @param {string} props.namingGuidanceText - Optional verbose naming guidance text.
 * @param {Object} props.t - Shared tailwind class tokens for consistent themeing.
 * @returns {JSX.Element}
 */
export default function AboutCard({ resource, displayDesc, namingPattern, namingGuidanceText, t }) {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(namingPattern);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className={`rounded-md border overflow-hidden ${t.card}`}>
            {/* About this Service */}
            <div className="px-4 pt-3 pb-2">
                <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                        <Info className={`w-3 h-3 ${t.muted}`} />
                        <span className={`text-[12px] font-semibold ${t.caption}`}>About this service</span>
                    </div>
                </div>
                <p className={`text-[13px] leading-[1.6] ${t.text}`}>
                    {resource.longDesc || displayDesc}
                </p>
                {resource.learnUrl && (
                    <div className="mt-3 mb-1">
                        <a
                            href={resource.learnUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-[26px] px-2.5 rounded-sm text-[12px] font-medium transition-all items-center gap-1.5 border bg-white dark:bg-[#323130] border-[#e1dfdd] dark:border-[#484644] text-[#605e5c] dark:text-[#c8c6c4] hover:border-[#c8c6c4] dark:hover:border-[#605e5c] hover:text-[#323130] dark:hover:text-[#e1dfdd]"
                        >
                            Microsoft Learn
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </a>
                    </div>
                )}
            </div>

            {/* Naming Guidance — divider-separated */}
            {(namingPattern || namingGuidanceText) && (
                <div className={`border-t px-4 pt-2 pb-3 ${t.divider}`}>
                    <div className="flex items-center gap-1.5 mb-1.5">
                        <Lightbulb className={`w-3 h-3 ${t.muted}`} />
                        <span className={`text-[12px] font-semibold ${t.caption}`}>Naming guidance</span>
                    </div>
                    {namingPattern && (
                        <div className={`mb-1.5 px-2.5 py-1.5 rounded-sm font-mono text-[12px] flex items-center justify-between gap-2 ${t.codeBlock}`}>
                            <span className="break-all">{namingPattern}</span>
                            <button
                                onClick={handleCopy}
                                className={`shrink-0 flex items-center justify-center p-1 rounded-sm transition-colors hover:bg-black/5 dark:hover:bg-white/10 ${isCopied ? 'text-[#107c10] dark:text-[#a3d4a3]' : t.muted}`}
                                title="Copy naming guidance"
                            >
                                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                        </div>
                    )}
                    {namingGuidanceText && (
                        <p className={`text-[13px] leading-[1.6] ${t.text}`}>
                            {namingGuidanceText}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

AboutCard.propTypes = {
    resource: PropTypes.object.isRequired,
    displayDesc: PropTypes.string,
    namingPattern: PropTypes.string,
    namingGuidanceText: PropTypes.string,
    t: PropTypes.object.isRequired,
};
