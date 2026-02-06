import { ChevronDown, ChevronUp, Edit3, Eye, EyeOff, ArrowLeft, ArrowRight, Copy, Check } from 'lucide-react';
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
            <div className="max-w-[1600px] mx-auto px-4 py-3 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className={`text-[18px] font-semibold ${isDarkMode ? 'text-white' : 'text-[#201f1e]'}`}>Configuration</h2>
                        <p className={`text-[12px] ${isDarkMode ? 'text-[#c8c6c4]' : 'text-[#605e5c]'}`}>Define global parameters for resource names.</p>
                    </div>
                    <button onClick={onToggleMinimize} className="text-[14px] font-semibold text-[#0078d4] hover:underline flex items-center gap-1">
                        {isMinimized ? 'Show' : 'Hide'}
                        {isMinimized ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                    </button>
                </div>

                {!isMinimized && (
                    <div className="animate-in slide-in-from-top-4 duration-300">
                        {/* Two-column grid layout for larger screens */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Left Column: Basic Configuration Inputs */}
                            <div className={`p-4 rounded border ${isDarkMode ? 'bg-[#1b1a19] border-[#484644]' : 'bg-white border-[#edebe9] shadow-sm'}`}>
                                <div className="flex items-center gap-2 border-b pb-2 mb-4" style={{ borderColor: isDarkMode ? '#484644' : '#edebe9' }}>
                                    <Edit3 className="w-4 h-4 text-[#0078d4]" />
                                    <h3 className={`text-[14px] font-semibold ${isDarkMode ? 'text-white' : 'text-[#201f1e]'}`}>Parameters</h3>
                                </div>
                                {/* Clean Fluent UI form layout */}
                                <div className="space-y-3">
                                    {/* Workload */}
                                    <div className="flex items-center gap-3">
                                        <Tooltip content="Identifies the application or workload." isDarkMode={isDarkMode}>
                                            <label className={`w-24 shrink-0 text-[13px] font-medium text-right ${isDarkMode ? 'text-[#c8c6c4]' : 'text-[#323130]'}`}>Workload</label>
                                        </Tooltip>
                                        <input
                                            type="text"
                                            value={workload}
                                            onChange={(e) => setWorkload(e.target.value)}
                                            placeholder="e.g. app"
                                            className={`flex-1 px-3 h-[32px] border rounded outline-none text-[14px] transition-colors focus:border-b-2 focus:border-b-[#0078d4] ${isDarkMode ? 'bg-[#1b1a19] text-white border-[#605e5c] placeholder:text-[#605e5c]' : 'bg-white text-[#201f1e] border-[#8a8886] placeholder:text-[#a19f9d]'}`}
                                        />
                                    </div>
                                    {/* Environment */}
                                    <div className="flex items-center gap-3">
                                        <Tooltip content="Development lifecycle stage." isDarkMode={isDarkMode}>
                                            <label className={`w-24 shrink-0 text-[13px] font-medium text-right ${isDarkMode ? 'text-[#c8c6c4]' : 'text-[#323130]'}`}>Environment</label>
                                        </Tooltip>
                                        <div className="flex-1">
                                            <SearchableSelect items={ENVIRONMENTS} value={envValue} onChange={setEnvValue} isDarkMode={isDarkMode} compact />
                                        </div>
                                    </div>
                                    {/* Region */}
                                    <div className="flex items-center gap-3">
                                        <Tooltip content="Azure deployment location." isDarkMode={isDarkMode}>
                                            <label className={`w-24 shrink-0 text-[13px] font-medium text-right ${isDarkMode ? 'text-[#c8c6c4]' : 'text-[#323130]'}`}>Region</label>
                                        </Tooltip>
                                        <div className="flex-1">
                                            <SearchableSelect items={AZURE_REGIONS} value={regionValue} onChange={setRegionValue} isDarkMode={isDarkMode} placeholder="Select..." compact />
                                        </div>
                                    </div>
                                    {/* Instance */}
                                    <div className="flex items-center gap-3">
                                        <Tooltip content="Three-digit sequence number." isDarkMode={isDarkMode}>
                                            <label className={`w-24 shrink-0 text-[13px] font-medium text-right ${isDarkMode ? 'text-[#c8c6c4]' : 'text-[#323130]'}`}>Instance</label>
                                        </Tooltip>
                                        <input
                                            type="text"
                                            value={instance}
                                            onChange={onInstanceChange}
                                            maxLength={3}
                                            placeholder="001"
                                            className={`flex-1 px-3 h-[32px] border rounded outline-none text-[14px] transition-colors focus:border-b-2 focus:border-b-[#0078d4] ${isDarkMode ? 'bg-[#1b1a19] text-white border-[#605e5c] placeholder:text-[#605e5c]' : 'bg-white text-[#201f1e] border-[#8a8886] placeholder:text-[#a19f9d]'}`}
                                        />
                                    </div>
                                    {/* Org Prefix - with toggle */}
                                    <div className={`flex items-center gap-3 pt-3 mt-1 border-t ${isDarkMode ? 'border-[#484644]' : 'border-[#edebe9]'}`}>
                                        <Tooltip content="Optional organization prefix." isDarkMode={isDarkMode}>
                                            <label className={`w-24 shrink-0 text-[13px] font-medium text-right ${!showOrg ? 'opacity-50' : ''} ${isDarkMode ? 'text-[#c8c6c4]' : 'text-[#323130]'}`}>Org Prefix</label>
                                        </Tooltip>
                                        <div className="flex-1 flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={orgPrefix}
                                                onChange={(e) => setOrgPrefix(e.target.value)}
                                                placeholder="e.g. cts"
                                                disabled={!showOrg}
                                                className={`flex-1 px-3 h-[32px] border rounded outline-none text-[14px] transition-colors focus:border-b-2 focus:border-b-[#0078d4] disabled:opacity-50 disabled:cursor-not-allowed ${isDarkMode ? 'bg-[#1b1a19] text-white border-[#605e5c] placeholder:text-[#605e5c]' : 'bg-white text-[#201f1e] border-[#8a8886] placeholder:text-[#a19f9d]'}`}
                                            />
                                            <button
                                                onClick={() => setShowOrg(!showOrg)}
                                                className={`h-[32px] px-3 flex items-center justify-center gap-1.5 rounded border text-[12px] font-medium transition-colors shrink-0 ${showOrg ? (isDarkMode ? 'bg-[#0078d4] border-[#0078d4] text-white' : 'bg-[#0078d4] border-[#0078d4] text-white') : (isDarkMode ? 'bg-transparent border-[#605e5c] text-[#c8c6c4] hover:border-[#8a8886]' : 'bg-white border-[#8a8886] text-[#605e5c] hover:border-[#323130]')}`}
                                                title={showOrg ? 'Disable Org Prefix' : 'Enable Org Prefix'}
                                            >
                                                {showOrg ? <><Eye className="w-3.5 h-3.5" /> On</> : <><EyeOff className="w-3.5 h-3.5" /> Off</>}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Right Column: Pattern Sequence */}
                            <div className={`p-4 rounded border ${isDarkMode ? 'bg-[#1b1a19] border-[#484644]' : 'bg-white border-[#edebe9] shadow-sm'}`}>
                                <div className="flex items-center gap-2 border-b pb-2 mb-4" style={{ borderColor: isDarkMode ? '#484644' : '#edebe9' }}>
                                    <Edit3 className="w-4 h-4 text-[#0078d4]" />
                                    <h3 className={`text-[14px] font-semibold ${isDarkMode ? 'text-white' : 'text-[#201f1e]'}`}>Pattern Sequence</h3>
                                </div>
                                {/* Sequence list - matching Parameters row heights */}
                                <div className="space-y-3">
                                    {namingOrder.map((item, index) => (
                                        <div
                                            key={item}
                                            className={`flex items-center gap-3 ${item === 'Org' && !showOrg ? 'opacity-40' : ''}`}
                                        >
                                            {/* Position number as label */}
                                            <span className={`w-24 shrink-0 text-[13px] font-medium text-right flex items-center justify-end gap-2 ${isDarkMode ? 'text-[#c8c6c4]' : 'text-[#323130]'}`}>
                                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${isDarkMode ? 'bg-[#0078d4]/20 text-[#60cdff]' : 'bg-[#deecf9] text-[#0078d4]'}`}>
                                                    {index + 1}
                                                </span>
                                            </span>
                                            {/* Item name in input-like box */}
                                            <div className={`flex-1 flex items-center justify-between px-3 h-[32px] border rounded ${isDarkMode ? 'bg-[#1b1a19] border-[#605e5c]' : 'bg-white border-[#8a8886]'}`}>
                                                <span className={`text-[14px] font-medium ${isDarkMode ? 'text-white' : 'text-[#201f1e]'}`}>
                                                    {item}
                                                    {item === 'Org' && !showOrg && <span className={`ml-2 text-[12px] ${isDarkMode ? 'text-[#8a8886]' : 'text-[#a19f9d]'}`}>(disabled)</span>}
                                                </span>
                                                {/* Move buttons */}
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => onMoveItem(index, -1)}
                                                        disabled={index === 0}
                                                        className={`p-1 rounded transition-colors disabled:opacity-20 disabled:cursor-not-allowed ${isDarkMode ? 'text-[#c8c6c4] hover:bg-[#484644]' : 'text-[#605e5c] hover:bg-[#edebe9]'}`}
                                                        title="Move up"
                                                    >
                                                        <ArrowLeft className="w-3.5 h-3.5 rotate-90" />
                                                    </button>
                                                    <button
                                                        onClick={() => onMoveItem(index, 1)}
                                                        disabled={index === namingOrder.length - 1}
                                                        className={`p-1 rounded transition-colors disabled:opacity-20 disabled:cursor-not-allowed ${isDarkMode ? 'text-[#c8c6c4] hover:bg-[#484644]' : 'text-[#605e5c] hover:bg-[#edebe9]'}`}
                                                        title="Move down"
                                                    >
                                                        <ArrowRight className="w-3.5 h-3.5 rotate-90" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <p className={`text-[11px] leading-relaxed mt-3 pt-3 border-t ${isDarkMode ? 'text-[#a19f9d] border-[#484644]' : 'text-[#605e5c] border-[#edebe9]'}`}>
                                    Based on <a href="https://learn.microsoft.com/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming" target="_blank" rel="noopener noreferrer" className="text-[#0078d4] hover:underline">CAF</a> naming conventions.
                                </p>
                            </div>
                        </div>
                        {/* Live Preview - Full width below the grid */}
                        <div className={`mt-4 p-4 rounded border ${isDarkMode ? 'bg-[#1b1a19] border-[#484644]' : 'bg-[#f3f2f1] border-[#edebe9]'}`}>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                {/* Label with icon */}
                                <div className="flex items-center gap-2 shrink-0">
                                    <div className={`p-1.5 rounded ${isDarkMode ? 'bg-[#0078d4]/20' : 'bg-[#deecf9]'}`}>
                                        <Eye className="w-4 h-4 text-[#0078d4]" />
                                    </div>
                                    <span className={`text-[13px] font-semibold ${isDarkMode ? 'text-[#a19f9d]' : 'text-[#605e5c]'}`}>Live Preview</span>
                                </div>
                                {/* Schema output */}
                                <div className={`flex-1 px-4 py-2.5 rounded font-mono text-[15px] font-semibold tracking-wide ${isDarkMode ? 'bg-[#323130] text-[#60cdff]' : 'bg-white text-[#0078d4] border border-[#edebe9]'}`}>
                                    {liveSchemaStr}
                                </div>
                                {/* Copy button */}
                                <button
                                    onClick={onCopy}
                                    className={`shrink-0 px-4 py-2.5 rounded text-[13px] font-semibold transition-all duration-150 flex items-center justify-center gap-2 ${copiedId === 'live-pill'
                                        ? 'bg-[#107c10] text-white'
                                        : 'bg-[#0078d4] text-white hover:bg-[#106ebe] active:bg-[#005a9e]'
                                        }`}
                                >
                                    {copiedId === 'live-pill' ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy</>}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
