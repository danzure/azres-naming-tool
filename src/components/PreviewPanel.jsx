import { X, Copy, Check, Eye } from 'lucide-react';

export default function PreviewPanel({ isOpen, onClose, isDarkMode, liveSchemaStr, copiedId, onCopy }) {
    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Side Panel */}
            <aside
                className={`fixed top-[48px] right-0 h-[calc(100vh-48px)] w-[320px] z-50 transform transition-transform duration-300 ease-out shadow-2xl border-l flex flex-col
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                    ${isDarkMode ? 'bg-[#252423] border-[#484644]' : 'bg-white border-[#edebe9]'}
                `}
            >
                {/* Panel Header */}
                <div className={`flex items-center justify-between px-4 py-3 border-b shrink-0 ${isDarkMode ? 'border-[#484644]' : 'border-[#edebe9]'}`}>
                    <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-[#0078d4]" />
                        <h2 className={`text-[16px] font-semibold ${isDarkMode ? 'text-white' : 'text-[#201f1e]'}`}>Live Preview</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className={`p-1.5 rounded transition-colors ${isDarkMode ? 'hover:bg-[#323130] text-[#c8c6c4]' : 'hover:bg-[#f3f2f1] text-[#605e5c]'}`}
                        aria-label="Close panel"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Panel Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {/* Schema Preview Card */}
                    <div className={`p-4 rounded border ${isDarkMode ? 'bg-[#1b1a19] border-[#484644]' : 'bg-[#faf9f8] border-[#edebe9]'}`}>
                        <div className="flex items-center justify-between mb-3">
                            <span className={`text-[12px] font-semibold uppercase tracking-wide ${isDarkMode ? 'text-[#a19f9d]' : 'text-[#605e5c]'}`}>
                                Naming Schema
                            </span>
                        </div>
                        <div className={`px-4 py-3 rounded font-mono text-[16px] font-semibold tracking-wide break-all ${isDarkMode ? 'bg-[#323130] text-[#60cdff]' : 'bg-white text-[#0078d4] border border-[#edebe9]'}`}>
                            {liveSchemaStr}
                        </div>
                        <button
                            onClick={onCopy}
                            className={`mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 rounded text-[13px] font-semibold transition-all duration-150 ${copiedId === 'live-pill'
                                ? 'bg-[#107c10] text-white'
                                : isDarkMode
                                    ? 'bg-[#0078d4] text-white hover:bg-[#106ebe] active:bg-[#005a9e]'
                                    : 'bg-[#0078d4] text-white hover:bg-[#106ebe] active:bg-[#005a9e]'
                                }`}
                        >
                            {copiedId === 'live-pill' ? (
                                <><Check className="w-4 h-4" /> Copied!</>
                            ) : (
                                <><Copy className="w-4 h-4" /> Copy Schema</>
                            )}
                        </button>
                    </div>

                    {/* Info Section */}
                    <div className={`mt-4 p-3 rounded border ${isDarkMode ? 'bg-[#1b1a19] border-[#484644]' : 'bg-[#f3f2f1] border-[#edebe9]'}`}>
                        <p className={`text-[12px] leading-relaxed ${isDarkMode ? 'text-[#c8c6c4]' : 'text-[#605e5c]'}`}>
                            This schema updates live as you modify the configuration. The <code className={`px-1 py-0.5 rounded text-[11px] ${isDarkMode ? 'bg-[#323130]' : 'bg-[#e1dfdd]'}`}>{'{resource}'}</code> placeholder is replaced by each service's abbreviation.
                        </p>
                    </div>

                    {/* CAF Reference */}
                    <div className={`mt-4 p-3 rounded border ${isDarkMode ? 'bg-[#0078d4]/10 border-[#0078d4]/30' : 'bg-[#deecf9] border-[#0078d4]/20'}`}>
                        <p className={`text-[12px] ${isDarkMode ? 'text-[#60cdff]' : 'text-[#0078d4]'}`}>
                            <span className="font-semibold">CAF Reference:</span>{' '}
                            <a
                                href="https://learn.microsoft.com/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:no-underline"
                            >
                                Azure Naming Conventions
                            </a>
                        </p>
                    </div>
                </div>

                {/* Panel Footer */}
                <div className={`px-4 py-3 border-t shrink-0 ${isDarkMode ? 'border-[#484644] bg-[#1b1a19]' : 'border-[#edebe9] bg-[#faf9f8]'}`}>
                    <p className={`text-[11px] text-center ${isDarkMode ? 'text-[#8a8886]' : 'text-[#a19f9d]'}`}>
                        Pattern updates automatically
                    </p>
                </div>
            </aside>
        </>
    );
}
