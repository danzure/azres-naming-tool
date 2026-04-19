import React from 'react';
import { Copy } from 'lucide-react';
import ValidationHighlight from '../ValidationHighlight';
import PropTypes from 'prop-types';

/**
 * BundleList Component
 * 
 * Displays a list of associated resources generated alongside the primary resource.
 * This is used when a topology or bundle is selected (e.g., Hub & Spoke VNet, 
 * or an ML Workspace with its required storage and key vault dependencies).
 * Provides inline validation highlighting and copy actions for each grouped resource.
 * 
 * @param {Object} props
 * @param {Array<Object>} props.bundle - Array of resource definitions in the current topology/bundle.
 * @param {Function} props.getBundleName - Function to generate the name for a specific bundle item.
 * @param {Object} props.resource - The primary resource definition.
 * @param {boolean} props.isCopied - Global flag indicating if a copy action recently occurred.
 * @param {Function} props.onCopy - Click handler for copying a specific resource name.
 * @param {Object} props.t - Shared tailwind class tokens for consistent themeing.
 * @returns {JSX.Element|null} Returns null if no bundle is active.
 */
export default function BundleList({ bundle, getBundleName, resource, isCopied, onCopy, t }) {
    if (!bundle || bundle.length === 0) return null;

    return (
        <div className={`mb-3 px-3 py-2 rounded-md border ${t.card}`}>
            <span className={`text-[12px] font-semibold mb-1.5 block ${t.caption}`}>Generated Resources</span>
            <div className="flex flex-col">
                {bundle.map((item, idx) => {
                    const itemName = getBundleName(item);
                    return (
                        <div key={idx} className={`flex items-center justify-between py-1 gap-2 ${idx > 0 ? `border-t ${t.divider}` : ''}`}>
                            <span className={`text-[12px] font-medium shrink-0 w-32 truncate ${t.muted}`}>{item.name}</span>
                            <div className={`text-[13px] font-mono truncate flex-1 ${t.strong}`}>
                                <ValidationHighlight name={itemName} allowedCharsPattern={item.chars || resource.chars} />
                            </div>
                            <button
                                onClick={(e) => { e.stopPropagation(); onCopy(e, itemName); }}
                                className={`h-[22px] px-2 rounded-sm text-[12px] font-medium transition-all flex items-center gap-1 shrink-0 text-white ${isCopied ? 'bg-[#107c10]' : 'bg-[#0078d4] hover:bg-[#106ebe]'}`}
                            >
                                <Copy className="w-3 h-3" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

BundleList.propTypes = {
    bundle: PropTypes.array,
    getBundleName: PropTypes.func.isRequired,
    resource: PropTypes.object.isRequired,
    isCopied: PropTypes.bool.isRequired,
    onCopy: PropTypes.func.isRequired,
    t: PropTypes.object.isRequired,
};
