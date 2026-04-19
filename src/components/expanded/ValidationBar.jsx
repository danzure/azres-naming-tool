import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * ValidationBar Component
 * 
 * Displays the current validation status of the generated resource name.
 * Renders a green success bar if all rules pass, or an amber/red warning/error
 * bar listing specific validation issues (e.g., too long, invalid characters).
 * 
 * @param {Object} props
 * @param {Array<{type: 'error'|'warning', message: string}>} props.validationIssues - Array of validation failures.
 * @returns {JSX.Element}
 */
export default function ValidationBar({ validationIssues }) {
    const { bg, accent } = React.useMemo(() => {
        if (validationIssues.length === 0) {
            return {
                bg: 'bg-[#f1faf1] dark:bg-[#1b2b1b] border-[#c6ebc9] dark:border-[#1e4620]',
                accent: 'bg-[#107c10]',
            };
        }
        const hasError = validationIssues.some(i => i.type === 'error');
        return {
            bg: hasError
                ? 'bg-[#fdf3f4] dark:bg-[#2c1515] border-[#eeacb2] dark:border-[#442726]'
                : 'bg-[#fff8f0] dark:bg-[#2c2412] border-[#f5d9a8] dark:border-[#4a3c1e]',
            accent: hasError ? 'bg-[#c50f1f]' : 'bg-[#f7941d]',
        };
    }, [validationIssues]);

    return (
        <div className={`mb-3 rounded-sm overflow-hidden flex border ${bg}`}>
            <div className={`w-[3px] shrink-0 ${accent}`} />
            <div className="flex-1 px-3 py-2">
                {validationIssues.length === 0 ? (
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#107c10] shrink-0" />
                        <span className="text-[13px] font-medium text-[#0e700e] dark:text-[#a3d4a3]">Name passes all validation checks</span>
                    </div>
                ) : (
                    <div className="flex flex-col gap-1">
                        {validationIssues.map((issue, i) => (
                            <div key={i} className="flex items-center gap-2">
                                {issue.type === 'error'
                                    ? <ShieldAlert className="w-3 h-3 shrink-0 text-[#c50f1f]" />
                                    : <AlertTriangle className="w-3 h-3 shrink-0 text-[#f7941d]" />
                                }
                                <span className="text-[13px] text-[#242424] dark:text-[#e1dfdd]">{issue.message}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

ValidationBar.propTypes = {
    validationIssues: PropTypes.array.isRequired,
};
