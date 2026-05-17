import { useState, memo } from 'react';
import { Copy, Shield, Check, ExternalLink, ChevronDown, ChevronUp, Settings, Users, Lock } from 'lucide-react';
import { getReadableTitle } from '../data/conditionalAccessData';

const PolicyGroupCard = ({ requirement, policies, copiedId, handleCopy }) => {
    const [selectedIdx, setSelectedIdx] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);

    // Clamp the index to ensure it's always valid when the policies array shrinks
    const activeIndex = selectedIdx < policies.length ? selectedIdx : 0;
    const activePolicy = policies[activeIndex];

    if (!activePolicy) return null;

    const readableTitle = getReadableTitle(requirement);

    const isCopied = copiedId === activePolicy.name;

    const formatTarget = (policyName) => {
        const parts = policyName.split('-');
        if (parts.length < 5) return policyName;
        
        const splitCamelCase = (str) => {
            return str
                .replace(/([a-z])([A-Z])/g, '$1 $2')
                .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
                .trim();
        };

        const persona = splitCamelCase(parts[1]);
        const resource = splitCamelCase(parts[2]);
        return `${persona} → ${resource}`;
    };

    return (
        <div className="group flex flex-col bg-white dark:bg-[#1b1a19] rounded-lg border border-[#edebe9] dark:border-[#323130] shadow-soft dark:shadow-none hover:shadow-md dark:hover:border-[#605e5c] transition-all duration-200">
            <div className="p-4 flex flex-col lg:flex-row gap-4 lg:gap-6 lg:items-center">

                {/* Left Side: Name, Target Dropdown, Badges */}
                <div className="flex flex-col gap-3 lg:w-[45%] shrink-0">
                    <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 bg-[#f3f2f1] dark:bg-[#252423] p-1.5 rounded shrink-0">
                            <Shield className="w-4 h-4 text-[#0078d4] dark:text-[#60cdff]" />
                        </div>
                        <div className="flex flex-col min-w-0 w-full">
                            <div className="flex items-center justify-between gap-2">
                                <h3 className="text-[14px] font-semibold text-[#242424] dark:text-white truncate" title={readableTitle}>
                                    {readableTitle}
                                </h3>
                            </div>

                            {/* Target Dropdown */}
                            {policies.length > 1 ? (
                                <select
                                    className="mt-2 w-full max-w-[300px] px-2 h-[28px] border rounded text-[12px] font-medium bg-[#faf9f8] dark:bg-[#252423] border-[#edebe9] dark:border-[#484644] text-[#242424] dark:text-white outline-none focus:border-[#0078d4] focus:ring-1 focus:ring-[#0078d4]/20 transition-all cursor-pointer"
                                    value={activeIndex}
                                    onChange={(e) => setSelectedIdx(Number(e.target.value))}
                                >
                                    {policies.map((p, idx) => (
                                        <option key={p.name} value={idx}>{formatTarget(p.name)}</option>
                                    ))}
                                </select>
                            ) : (
                                <div className="mt-2 text-[12px] font-medium text-[#605e5c] dark:text-[#a19f9d]">
                                    Target: <span className="text-[#242424] dark:text-[#e1dfdd]">{formatTarget(activePolicy.name)}</span>
                                </div>
                            )}

                            <div className="mt-3 flex items-center gap-2">
                                <span className="font-mono text-[12px] text-[#0078d4] dark:text-[#60cdff] bg-[#EFF6FC] dark:bg-[#0078d4]/15 px-1.5 py-0.5 rounded break-all border border-[#c7e0f4] dark:border-transparent">
                                    {activePolicy.name}
                                </span>
                                <button
                                    onClick={() => handleCopy(activePolicy.name, activePolicy.name)}
                                    className="shrink-0 p-1 rounded text-[#605e5c] dark:text-[#a19f9d] hover:bg-[#edebe9] dark:hover:bg-[#323130] transition-colors"
                                    title="Copy Name"
                                >
                                    {isCopied ? <Check className="w-4 h-4 text-[#107c10] dark:text-[#a3d4a3]" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-1.5 flex-wrap ml-[34px]">
                        {activePolicy.categories.map((cat, idx) => (
                            <span key={idx} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase bg-[#f3f2f1] text-[#605e5c] dark:bg-[#292827] dark:text-[#a19f9d] border border-transparent dark:border-[#484644]">
                                {cat}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Divider for desktop */}
                <div className="hidden lg:block w-px self-stretch bg-[#edebe9] dark:bg-[#323130] my-1"></div>

                {/* Right Side: Description */}
                <div className="flex flex-col gap-3 lg:w-[55%] flex-1">
                    <p className="text-[13px] leading-relaxed text-[#605e5c] dark:text-[#a19f9d]">
                        {activePolicy.desc}
                    </p>

                    <div className="flex items-center gap-4 mt-auto">
                        {activePolicy.settings && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="w-fit text-[#242424] dark:text-[#e1dfdd] hover:text-[#0078d4] dark:hover:text-[#60cdff] flex items-center gap-1.5 text-[12px] font-medium transition-colors"
                            >
                                <Settings className="w-3.5 h-3.5" />
                                {isExpanded ? 'Hide Settings' : 'View Settings'}
                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                        )}
                        {activePolicy.link && (
                            <a
                                href={activePolicy.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-fit text-[#0078d4] dark:text-[#60cdff] hover:underline flex items-center gap-1.5 text-[12px] font-medium"
                            >
                                Microsoft Learn
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Expanded Settings View */}
            {isExpanded && activePolicy.settings && (() => {
                const assignments = activePolicy.settings.filter(s => ['Users', 'Workload identities', 'Target resources', 'Conditions'].includes(s.label));
                const accessControls = activePolicy.settings.filter(s => ['Grant', 'Session'].includes(s.label));

                return (
                    <div className="border-t border-[#edebe9] dark:border-[#323130] bg-[#faf9f8] dark:bg-[#1b1a19] rounded-b-lg p-4 animate-slide-up">
                        <div className="flex flex-col md:flex-row gap-4">
                            
                            {/* Assignments Column */}
                            {assignments.length > 0 && (
                                <div className="flex-1 bg-white dark:bg-[#252423] border border-[#edebe9] dark:border-[#484644] rounded-md p-3.5 shadow-sm dark:shadow-none">
                                    <h4 className="text-[13px] font-bold text-[#242424] dark:text-white mb-3 flex items-center gap-2 border-b border-[#edebe9] dark:border-[#323130] pb-2">
                                        <Users className="w-4 h-4 text-[#0078d4] dark:text-[#60cdff]" />
                                        Assignments
                                    </h4>
                                    <div className="flex flex-col gap-4">
                                        {assignments.map((setting, idx) => (
                                            <div key={idx} className="flex flex-col gap-1">
                                                <span className="text-[11px] font-semibold text-[#605e5c] dark:text-[#a19f9d] uppercase tracking-wide">
                                                    {setting.label}
                                                </span>
                                                <span className="text-[13px] text-[#242424] dark:text-[#e1dfdd] whitespace-pre-wrap leading-relaxed">
                                                    {setting.value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Access Controls Column */}
                            {accessControls.length > 0 && (
                                <div className="flex-1 bg-white dark:bg-[#252423] border border-[#edebe9] dark:border-[#484644] rounded-md p-3.5 shadow-sm dark:shadow-none">
                                    <h4 className="text-[13px] font-bold text-[#242424] dark:text-white mb-3 flex items-center gap-2 border-b border-[#edebe9] dark:border-[#323130] pb-2">
                                        <Lock className="w-4 h-4 text-[#0078d4] dark:text-[#60cdff]" />
                                        Access controls
                                    </h4>
                                    <div className="flex flex-col gap-4">
                                        {accessControls.map((setting, idx) => (
                                            <div key={idx} className="flex flex-col gap-1">
                                                <span className="text-[11px] font-semibold text-[#605e5c] dark:text-[#a19f9d] uppercase tracking-wide">
                                                    {setting.label}
                                                </span>
                                                <span className="text-[13px] text-[#242424] dark:text-[#e1dfdd] whitespace-pre-wrap leading-relaxed">
                                                    {setting.value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                );
            })()}
        </div>
    );
};

export default memo(PolicyGroupCard);
