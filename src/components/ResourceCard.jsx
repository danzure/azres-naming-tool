import { memo, useState, useMemo } from 'react';
import { Box, Copy, Check, ShieldAlert, AlertTriangle, LayoutGrid, Cpu, Network, Database, Globe, DatabaseZap, ShieldCheck, Workflow, BarChart3, BrainCircuit, Settings2, Wifi, GitBranch } from 'lucide-react';
import ValidationHighlight from './ValidationHighlight';
import ExpandedPanel from './ExpandedPanel';
import { getCategoryColors } from '../data/categoryColors';
import { getBundleResources } from '../utils/bundleGenerator';
import { validateName } from '../utils/nameValidator';
import PropTypes from 'prop-types';

const CATEGORY_ICONS = {
    'General': LayoutGrid,
    'Compute': Cpu,
    'Networking': Network,
    'Storage': Database,
    'Web': Globe,
    'Databases': DatabaseZap,
    'Containers': Box,
    'Security': ShieldCheck,
    'Integration': Workflow,
    'Analytics': BarChart3,
    'AI + ML': BrainCircuit,
    'Management + Governance': Settings2,
    'IoT': Wifi,
    'DevOps': GitBranch,
};

function ResourceCard({ id, resource, genName, isCopied, isExpanded, onCopy, onToggle, selectedSubResource, onSubResourceChange, generateName }) {
    const categoryColors = getCategoryColors(resource.category);
    const CategoryIcon = CATEGORY_ICONS[resource.category] || Box;

    const [topology, setTopology] = useState('single');
    const [spokeCount, setSpokeCount] = useState(1);
    const [spokeStartValue, setSpokeStartValue] = useState(1);

    const bundle = useMemo(() => getBundleResources(resource, topology, { spokeCount, spokeStartValue }), [resource, topology, spokeCount, spokeStartValue]);
    const hasBundle = bundle && bundle.length > 0;

    // Helper to generate name - utilizing the passed generateName function with modified resource context
    const getGeneratedName = (resItem) => generateName(resItem, null, resItem.instanceOverride);

    // Validation
    const validationIssues = useMemo(() => validateName(genName, resource), [genName, resource]);
    const hasErrors = validationIssues.some(i => i.type === 'error');
    const hasWarnings = validationIssues.some(i => i.type === 'warning');
    const isTooLong = validationIssues.some(i => i.code === 'TOO_LONG');


    return (
        <div
            id={id}
            onClick={() => onToggle(resource.name, isExpanded)}
            className={`group relative flex flex-col rounded-lg border cursor-pointer transition-all duration-300 h-full ${isExpanded ? 'ring-2 ring-[#0078d4] shadow-depth' : 'hover:-translate-y-1 hover:shadow-depth shadow-soft'} bg-white dark:bg-[#252423] border-[#edebe9] dark:border-[#484644] ${hasErrors ? 'border-l-4 border-l-[#a80000]' : hasWarnings ? 'border-l-4 border-l-[#ffaa44]' : ''}`}
        >
            <div className="p-4 flex flex-col h-full gap-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div
                            className={`p-2 rounded shrink-0 ${categoryColors.bgClass} ${categoryColors.textClass}`}
                        >
                            <CategoryIcon className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <h3 className="text-[14px] font-semibold truncate text-[#242424] dark:text-white">{resource.name}</h3>
                            <div className="flex items-center gap-1.5 mt-1">
                                <span
                                    className={`text-[11px] px-1.5 py-0.5 rounded font-medium ${categoryColors.bgClass} ${categoryColors.textClass}`}
                                >{resource.category}</span>
                                <span className="text-[11px] font-mono opacity-60 text-[#616161] dark:text-[#d2d2d2]">{resource.abbrev}</span>
                            </div>
                        </div>
                    </div>
                    {validationIssues.length > 0 && (
                        <div className="relative group/validation shrink-0">
                            {hasErrors
                                ? <ShieldAlert className="w-4 h-4 text-[#a80000]" aria-label={`${validationIssues.length} validation issue(s)`} />
                                : <AlertTriangle className="w-4 h-4 text-[#ffaa44]" aria-label={`${validationIssues.length} validation warning(s)`} />
                            }
                            <div className="absolute right-0 top-6 z-50 w-56 p-2.5 rounded shadow-lg border text-[11px] leading-relaxed hidden group-hover/validation:block bg-white dark:bg-[#323130] border-[#edebe9] dark:border-[#605e5c] text-[#323130] dark:text-[#e1dfdd]">
                                {validationIssues.map((issue, i) => (
                                    <div key={i} className={`flex items-start gap-1.5 ${i > 0 ? 'mt-1.5 pt-1.5 border-t' : ''} border-[#edebe9] dark:border-[#484644]`}>
                                        <span className={`shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full ${issue.type === 'error' ? 'bg-[#a80000]' : 'bg-[#ffaa44]'}`} />
                                        <span>{issue.message}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <p className="text-[13px] leading-relaxed line-clamp-2 text-[#605e5c] dark:text-[#d2d0ce]">
                    {resource.desc}
                </p>

                <div className="mt-auto pt-2">
                    <div className="relative rounded px-3 border flex flex-col justify-center h-[32px] bg-[#faf9f8] dark:bg-[#1b1a19] border-[#edebe9] dark:border-[#484644]">
                        <div className={`text-[13px] font-medium font-mono truncate w-full pr-8 flex items-center gap-2 ${isTooLong ? 'text-[#a80000]' : 'text-[#242424] dark:text-[#ffffff]'}`}>
                            <ValidationHighlight name={hasBundle ? getGeneratedName(bundle[0]) : genName} allowedCharsPattern={hasBundle ? bundle[0].chars : resource.chars} />
                            {hasBundle && (
                                <span className="text-[11px] px-1.5 py-0.5 rounded font-bold bg-[#f3f2f1] dark:bg-[#323130] text-[#0078d4] dark:text-[#60cdff]">
                                    +{bundle.length - 1}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (hasBundle) {
                                    const allNames = bundle.map(item => `${item.name}: ${getGeneratedName(item)}`).join('\n');
                                    onCopy(allNames, resource.name, e);
                                } else {
                                    onCopy(genName, resource.name, e);
                                }
                            }}
                            aria-label={isCopied ? 'Copied' : 'Copy name'}
                            className={`absolute right-1 top-1 h-[24px] px-2 rounded text-[11px] font-semibold transition-all flex items-center gap-1 z-10 ${isCopied
                                ? 'bg-[#107c10] text-white'
                                : 'bg-[#0078d4] text-white hover:bg-[#106ebe]'
                                }`}
                        >
                            {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            {/* Mobile visual optimization: hide text on very small screens if needed, but keeping separate for now */}
                        </button>
                    </div>
                    <div className="flex justify-between items-center text-[11px] mt-2 px-0.5 opacity-70 shrink-0">
                        <span className="text-[#605e5c] dark:text-[#c8c6c4]">Max: {resource.maxLength || 64}</span>
                        <span className={`font-bold ${isTooLong ? 'text-[#a80000]' : 'text-[#201f1e] dark:text-white'}`}>{genName.length} chars</span>
                    </div>
                </div>
            </div>




            {isExpanded && (
                <div className="animate-fade-in">
                    <ExpandedPanel
                        resource={resource}
                        genName={genName}
                        isCopied={isCopied}
                        onCopy={onCopy}
                        selectedSubResource={selectedSubResource}
                        onSubResourceChange={(suffix) => onSubResourceChange(resource.name, suffix)}
                        topology={topology}
                        setTopology={setTopology}
                        spokeCount={spokeCount}
                        setSpokeCount={setSpokeCount}
                        spokeStartValue={spokeStartValue}
                        setSpokeStartValue={setSpokeStartValue}
                        bundle={bundle}
                        getBundleName={getGeneratedName}
                    />
                </div>
            )}
        </div>
    );
}

ResourceCard.propTypes = {
    id: PropTypes.string.isRequired,
    resource: PropTypes.shape({
        name: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        abbrev: PropTypes.string.isRequired,
        maxLength: PropTypes.number,
        chars: PropTypes.string,
        subResources: PropTypes.array,
    }).isRequired,
    genName: PropTypes.string.isRequired,
    isCopied: PropTypes.bool.isRequired,
    isExpanded: PropTypes.bool.isRequired,
    onCopy: PropTypes.func.isRequired,
    onToggle: PropTypes.func.isRequired,
    selectedSubResource: PropTypes.string,
    onSubResourceChange: PropTypes.func,
    generateName: PropTypes.func,
};

export default memo(ResourceCard);
