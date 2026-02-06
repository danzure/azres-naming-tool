import { ChevronDown, ChevronUp, Edit3, Eye, EyeOff, ArrowLeft, ArrowRight, Copy, Check, Layers, Info } from 'lucide-react';
import SearchableSelect from './SearchableSelect';
import Tooltip from './Tooltip';
import { AZURE_REGIONS, ENVIRONMENTS } from '../data/constants';

export default function ConfigPanel({
    isDarkMode, isMinimized, onToggleMinimize,
    workload, setWorkload, envValue, setEnvValue, regionValue, setRegionValue,
    instance, onInstanceChange, orgPrefix, setOrgPrefix, showOrg, setShowOrg,
    namingOrder, onMoveItem, liveSchemaStr, copiedId, onCopy
}) {
    return (
        <nav className={`mt-[48px] shadow-sm transition-all border-b ${isDarkMode ? 'bg-[#252423] border-[#484644]' : 'bg-white border-[#edebe9]'}`}>
            <div className="max-w-[1600px] mx-auto px-4 py-3">
                {/* Header row */}
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h2 className={`text-[16px] font-semibold ${isDarkMode ? 'text-white' : 'text-[#201f1e]'}`}>Configuration</h2>
                        <p className={`text-[12px] ${isDarkMode ? 'text-[#a19f9d]' : 'text-[#605e5c]'}`}>Define naming parameters</p>
                    </div>
                    <button onClick={onToggleMinimize} className="text-[13px] font-medium text-[#0078d4] hover:underline flex items-center gap-1">
                        {isMinimized ? 'Show' : 'Hide'}
                        {isMinimized ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                    </button>
                </div>

                {!isMinimized && (
                    <div className="animate-in slide-in-from-top-2 duration-200">
                        {/* Two-column grid: Parameters + About */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                            {/* Left: Parameters */}
                            <div className={`p-3 rounded border ${isDarkMode ? 'bg-[#1b1a19] border-[#484644]' : 'bg-white border-[#edebe9] shadow-sm'}`}>
                                <div className="flex items-center gap-2 mb-3">
                                    <Edit3 className="w-3.5 h-3.5 text-[#0078d4]" />
                                    <h3 className={`text-[13px] font-semibold ${isDarkMode ? 'text-white' : 'text-[#201f1e]'}`}>Parameters</h3>
                                </div>
                                {/* Form grid - label left, input right */}
                                <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 items-center">
                                    {/* Workload */}
                                    <Tooltip content="Application or workload name" isDarkMode={isDarkMode}>
                                        <label className={`text-[12px] font-medium text-right ${isDarkMode ? 'text-[#c8c6c4]' : 'text-[#605e5c]'}`}>Workload</label>
                                    </Tooltip>
                                    <input
                                        type="text"
                                        value={workload}
                                        onChange={(e) => setWorkload(e.target.value)}
                                        placeholder="app"
                                        className={`px-2.5 h-[28px] border rounded outline-none text-[13px] transition-colors focus:border-[#0078d4] ${isDarkMode ? 'bg-[#252423] text-white border-[#605e5c] placeholder:text-[#605e5c]' : 'bg-white text-[#201f1e] border-[#8a8886] placeholder:text-[#a19f9d]'}`}
                                    />
                                    {/* Environment */}
                                    <Tooltip content="Lifecycle stage" isDarkMode={isDarkMode}>
                                        <label className={`text-[12px] font-medium text-right ${isDarkMode ? 'text-[#c8c6c4]' : 'text-[#605e5c]'}`}>Environment</label>
                                    </Tooltip>
                                    <SearchableSelect items={ENVIRONMENTS} value={envValue} onChange={setEnvValue} isDarkMode={isDarkMode} compact />
                                    {/* Region */}
                                    <Tooltip content="Azure region" isDarkMode={isDarkMode}>
                                        <label className={`text-[12px] font-medium text-right ${isDarkMode ? 'text-[#c8c6c4]' : 'text-[#605e5c]'}`}>Region</label>
                                    </Tooltip>
                                    <SearchableSelect items={AZURE_REGIONS} value={regionValue} onChange={setRegionValue} isDarkMode={isDarkMode} placeholder="Select..." compact />
                                    {/* Instance */}
                                    <Tooltip content="Instance number (001-999)" isDarkMode={isDarkMode}>
                                        <label className={`text-[12px] font-medium text-right ${isDarkMode ? 'text-[#c8c6c4]' : 'text-[#605e5c]'}`}>Instance</label>
                                    </Tooltip>
                                    <input
                                        type="text"
                                        value={instance}
                                        onChange={onInstanceChange}
                                        maxLength={3}
                                        placeholder="001"
                                        className={`px-2.5 h-[28px] border rounded outline-none text-[13px] transition-colors focus:border-[#0078d4] ${isDarkMode ? 'bg-[#252423] text-white border-[#605e5c] placeholder:text-[#605e5c]' : 'bg-white text-[#201f1e] border-[#8a8886] placeholder:text-[#a19f9d]'}`}
                                    />
                                    {/* Org Prefix */}
                                    <Tooltip content="Optional org prefix" isDarkMode={isDarkMode}>
                                        <label className={`text-[12px] font-medium text-right ${!showOrg ? 'opacity-50' : ''} ${isDarkMode ? 'text-[#c8c6c4]' : 'text-[#605e5c]'}`}>Org</label>
                                    </Tooltip>
                                    <div className="flex items-center gap-1.5">
                                        <input
                                            type="text"
                                            value={orgPrefix}
                                            onChange={(e) => setOrgPrefix(e.target.value)}
                                            placeholder="cts"
                                            disabled={!showOrg}
                                            className={`flex-1 px-2.5 h-[28px] border rounded outline-none text-[13px] transition-colors focus:border-[#0078d4] disabled:opacity-40 ${isDarkMode ? 'bg-[#252423] text-white border-[#605e5c] placeholder:text-[#605e5c]' : 'bg-white text-[#201f1e] border-[#8a8886] placeholder:text-[#a19f9d]'}`}
                                        />
                                        <button
                                            onClick={() => setShowOrg(!showOrg)}
                                            className={`h-[28px] w-[28px] flex items-center justify-center rounded border transition-colors shrink-0 ${showOrg ? 'bg-[#0078d4] border-[#0078d4] text-white' : (isDarkMode ? 'bg-transparent border-[#605e5c] text-[#8a8886] hover:border-[#8a8886]' : 'bg-white border-[#8a8886] text-[#605e5c] hover:border-[#323130]')}`}
                                            title={showOrg ? 'Disable Org' : 'Enable Org'}
                                        >
                                            {showOrg ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right: About / CAF Introduction */}
                            <div className={`p-3 rounded border ${isDarkMode ? 'bg-[#1b1a19] border-[#484644]' : 'bg-white border-[#edebe9] shadow-sm'}`}>
                                <div className="flex items-center gap-2 mb-3">
                                    <Info className="w-3.5 h-3.5 text-[#0078d4]" />
                                    <h3 className={`text-[13px] font-semibold ${isDarkMode ? 'text-white' : 'text-[#201f1e]'}`}>About This Tool</h3>
                                </div>
                                <div className={`text-[12px] leading-relaxed space-y-2 ${isDarkMode ? 'text-[#c8c6c4]' : 'text-[#605e5c]'}`}>
                                    <p>
                                        This tool generates consistent Azure resource names following Microsoft's{' '}
                                        <a href="https://learn.microsoft.com/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming" target="_blank" rel="noopener noreferrer" className="text-[#0078d4] hover:underline font-medium">
                                            Cloud Adoption Framework (CAF)
                                        </a>{' '}
                                        naming convention.
                                    </p>
                                    <p>
                                        The Purpose of this tool is to help organize Azure resources with predictable, standardized names that include key context like environment, region, and workload identifiers.
                                    </p>
                                    <p>
                                        Define your naming schema using the pameters and pattern builder, then browse the resource catalog below to copy correctly formatted names for your deployments.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Pattern Builder - full width */}
                        <div className={`mt-3 p-3 rounded border ${isDarkMode ? 'bg-[#1b1a19] border-[#484644]' : 'bg-white border-[#edebe9] shadow-sm'}`}>
                            <div className="flex items-center gap-2 mb-2">
                                <Layers className="w-3.5 h-3.5 text-[#0078d4]" />
                                <h3 className={`text-[13px] font-semibold ${isDarkMode ? 'text-white' : 'text-[#201f1e]'}`}>Pattern Builder</h3>
                                <span className={`text-[11px] ${isDarkMode ? 'text-[#a19f9d]' : 'text-[#605e5c]'}`}>
                                    — Customize segment order for your naming convention
                                </span>
                            </div>
                            {/* Horizontal sequence */}
                            <div className="flex flex-wrap gap-1.5">
                                {namingOrder.map((item, index) => (
                                    <div
                                        key={item}
                                        className={`flex items-center gap-1 px-2 h-[28px] rounded border ${item === 'Org' && !showOrg ? 'opacity-40' : ''} ${isDarkMode ? 'bg-[#252423] border-[#484644]' : 'bg-[#faf9f8] border-[#edebe9]'}`}
                                    >
                                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${isDarkMode ? 'bg-[#0078d4]/30 text-[#60cdff]' : 'bg-[#deecf9] text-[#0078d4]'}`}>
                                            {index + 1}
                                        </span>
                                        <span className={`text-[12px] font-medium ${isDarkMode ? 'text-white' : 'text-[#201f1e]'}`}>{item}</span>
                                        <div className="flex items-center -mr-1">
                                            <button
                                                onClick={() => onMoveItem(index, -1)}
                                                disabled={index === 0}
                                                className={`p-0.5 rounded transition-colors disabled:opacity-20 ${isDarkMode ? 'text-[#a19f9d] hover:bg-[#484644]' : 'text-[#605e5c] hover:bg-[#edebe9]'}`}
                                                title="Move left"
                                            >
                                                <ArrowLeft className="w-3 h-3" />
                                            </button>
                                            <button
                                                onClick={() => onMoveItem(index, 1)}
                                                disabled={index === namingOrder.length - 1}
                                                className={`p-0.5 rounded transition-colors disabled:opacity-20 ${isDarkMode ? 'text-[#a19f9d] hover:bg-[#484644]' : 'text-[#605e5c] hover:bg-[#edebe9]'}`}
                                                title="Move right"
                                            >
                                                <ArrowRight className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Live Preview - compact bar */}
                        <div className={`mt-3 px-3 py-2 rounded border flex items-center gap-3 ${isDarkMode ? 'bg-[#1b1a19] border-[#484644]' : 'bg-[#faf9f8] border-[#edebe9]'}`}>
                            <div className="flex items-center gap-2 shrink-0">
                                <Eye className="w-3.5 h-3.5 text-[#0078d4]" />
                                <span className={`text-[12px] font-medium ${isDarkMode ? 'text-[#a19f9d]' : 'text-[#605e5c]'}`}>Preview</span>
                            </div>
                            <div className={`flex-1 px-3 py-1.5 rounded font-mono text-[14px] font-semibold tracking-wide ${isDarkMode ? 'bg-[#252423] text-[#60cdff]' : 'bg-white text-[#0078d4] border border-[#edebe9]'}`}>
                                {liveSchemaStr}
                            </div>
                            <button
                                onClick={onCopy}
                                className={`shrink-0 px-3 py-1.5 rounded text-[12px] font-semibold transition-all flex items-center gap-1.5 ${copiedId === 'live-pill'
                                    ? 'bg-[#107c10] text-white'
                                    : 'bg-[#0078d4] text-white hover:bg-[#106ebe]'
                                    }`}
                            >
                                {copiedId === 'live-pill' ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
