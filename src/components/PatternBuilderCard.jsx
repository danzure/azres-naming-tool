import { useState, useMemo } from 'react';
import { Copy, Check, Edit3, Eye, Info } from 'lucide-react';

const ALPHANUMERIC_REGEX = /[^a-zA-Z0-9-]/g;
const selectClasses = "px-2.5 h-[32px] flex-1 min-w-[120px] border rounded outline-none text-[13px] transition-all bg-white dark:bg-[#1b1a19] text-[#201f1e] dark:text-white border-[#8a8886] dark:border-[#605e5c] hover:border-[#323130] dark:hover:border-[#8a8886] focus:border-[#0078d4] focus:ring-1 focus:ring-[#0078d4] cursor-pointer text-ellipsis";

export default function PatternBuilderCard({ copiedId, handleCopy }) {
    // Policy naming parts
    const [prefix, setPrefix] = useState('CA');
    const [persona, setPersona] = useState('AllUsers');
    const [action, setAction] = useState('RequireMFA');
    const [customAction, setCustomAction] = useState('');
    const [resource, setResource] = useState('AllApps');
    const [customResource, setCustomResource] = useState('');
    const [platform, setPlatform] = useState('AnyPlatform');

    /**
     * Memoized generation of the final policy name string.
     * Incorporates custom action values if 'Custom' is selected.
     */
    const generatedName = useMemo(() => {
        const finalAction = action === 'Custom' ? (customAction || 'Custom') : action;
        const finalResource = resource === 'Custom' ? (customResource || 'Custom') : resource;
        return `${prefix}-${persona}-${finalResource}-${platform}-${finalAction}`;
    }, [prefix, persona, action, customAction, resource, customResource, platform]);

    return (
        <div className="animate-slide-up flex flex-col gap-3">
            {/* About / Introduction */}
            <div className="p-3.5 rounded-lg border shadow-soft bg-[#F0F6FF] dark:bg-[#0078d4]/10 border-[#C7E0F4] dark:border-[#0078d4]/30 flex gap-3 items-start">
                <Info className="w-4 h-4 text-[#0078d4] mt-0.5 shrink-0" />
                <div className="text-[13px] leading-relaxed text-[#004578] dark:text-[#c7e0f4]">
                    Conditional Access policies are logic-driven <strong>If-Then</strong> statements. Use the Pattern Builder below to construct a standardized name describing who it applies to, under what conditions, and what control is enforced.
                </div>
            </div>

            {/* Pattern Builder */}
            <div className="p-4 lg:p-5 rounded-lg border shadow-soft bg-white dark:bg-[#1b1a19] border-[#edebe9] dark:border-[#484644]">
                <div className="flex items-center gap-2 mb-5 pb-3 border-b border-[#edebe9] dark:border-[#323130]">
                    <Edit3 className="w-4 h-4 text-[#0078d4]" />
                    <h3 className="text-[14px] font-semibold text-[#201f1e] dark:text-white">Pattern Builder</h3>
                </div>
                
                <div className="flex flex-wrap items-center gap-y-3 gap-x-2 text-[14px] text-[#323130] dark:text-[#e1dfdd] leading-relaxed">
                    <span>Create a policy starting with</span>
                    <input
                        type="text"
                        value={prefix}
                        onChange={(e) => setPrefix(e.target.value)}
                        className="px-2 h-[32px] border rounded outline-none text-[13px] font-mono transition-all focus:border-[#0078d4] focus:ring-2 focus:ring-[#0078d4]/20 bg-white dark:bg-[#252423] border-[#8a8886] dark:border-[#605e5c] w-[60px] text-center"
                    />
                    
                    <span>that applies to</span>
                    <select
                        value={persona}
                        onChange={(e) => setPersona(e.target.value)}
                        className={selectClasses}
                    >
                        <option value="AllUsers">All Users</option>
                        <option value="Admins">Administrators</option>
                        <option value="Guests">Guests / Externals</option>
                        <option value="Internal">Internal Users</option>
                        <option value="ServiceAccts">Service Accounts</option>
                        <option value="AIAgents">AI Agents</option>
                        <option value="VIPs">VIPs / Executives</option>
                        <option value="Vendors">Vendors</option>
                        <option value="BreakGlass">Break Glass Accounts</option>
                    </select>
                    
                    <span>when they access</span>
                    {resource === 'Custom' ? (
                        <div className="relative flex items-center flex-1 min-w-[120px]">
                            <input
                                type="text"
                                value={customResource}
                                onChange={(e) => setCustomResource(e.target.value.replace(ALPHANUMERIC_REGEX, ''))}
                                placeholder="e.g. SalesApp"
                                className="px-2.5 h-[32px] pr-7 w-full border rounded outline-none text-[13px] font-mono transition-all focus:border-[#0078d4] focus:ring-2 focus:ring-[#0078d4]/20 bg-white dark:bg-[#252423] text-[#201f1e] dark:text-white border-[#0078d4]/40 dark:border-[#0078d4]/60 text-ellipsis"
                                maxLength={30}
                                autoFocus
                            />
                            <button 
                                onClick={() => { setResource('AllApps'); setCustomResource(''); }}
                                className="absolute right-1 w-5 h-5 flex items-center justify-center rounded-sm hover:bg-[#0078d4]/10 text-[#0078d4] dark:hover:bg-white/10"
                                title="Revert to list"
                            >
                                <span className="text-[16px] leading-none mb-[2px]">&times;</span>
                            </button>
                        </div>
                    ) : (
                        <select
                            value={resource}
                            onChange={(e) => setResource(e.target.value)}
                            className={selectClasses}
                        >
                            <option value="AllApps">All Cloud Apps</option>
                            <option value="O365">Office 365 Suite</option>
                            <option value="AzurePortal">Azure Management</option>
                            <option value="MsAdminPortals">MS Admin Portals</option>
                            <option value="Exo">Exchange Online</option>
                            <option value="Spo">SharePoint Online</option>
                            <option value="Teams">Microsoft Teams</option>
                            <option value="Intune">Microsoft Intune</option>
                            <option value="Avd">Azure Virtual Desktop</option>
                            <option value="Defender">Microsoft Defender</option>
                            <option value="HighRiskApps">High Risk Apps</option>
                            <option value="SecurityInfo">Security Info Registration</option>
                            <option value="Custom">Custom App...</option>
                        </select>
                    )}

                    <span>from</span>
                    <select
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value)}
                        className={selectClasses}
                    >
                        <option value="AnyPlatform">Any Platform</option>
                        <option value="UnknownPlatform">Unknown / Unsupported</option>
                        <option value="Windows">Windows</option>
                        <option value="macOS">macOS</option>
                        <option value="iOS">iOS</option>
                        <option value="Android">Android</option>
                        <option value="Linux">Linux</option>
                    </select>

                    <span>and enforces</span>
                    {action === 'Custom' ? (
                        <div className="relative flex items-center flex-1 min-w-[120px]">
                            <input
                                type="text"
                                value={customAction}
                                onChange={(e) => setCustomAction(e.target.value.replace(ALPHANUMERIC_REGEX, ''))}
                                placeholder="e.g. BlockNonCompliant"
                                className="px-2.5 h-[32px] pr-7 w-full border rounded outline-none text-[13px] font-mono transition-all focus:border-[#5C2D91] focus:ring-2 focus:ring-[#5C2D91]/20 bg-white dark:bg-[#252423] text-[#201f1e] dark:text-white border-[#5C2D91]/40 dark:border-[#5C2D91]/60 text-ellipsis"
                                maxLength={30}
                                autoFocus
                            />
                            <button 
                                onClick={() => { setAction('RequireMFA'); setCustomAction(''); }}
                                className="absolute right-1 w-5 h-5 flex items-center justify-center rounded-sm hover:bg-[#5C2D91]/10 text-[#5C2D91] dark:hover:bg-white/10"
                                title="Revert to list"
                            >
                                <span className="text-[16px] leading-none mb-[2px]">&times;</span>
                            </button>
                        </div>
                    ) : (
                        <select
                            value={action}
                            onChange={(e) => setAction(e.target.value)}
                            className={selectClasses}
                        >
                            <option value="RequireMFA">Require Multi-factor Authentication</option>
                            <option value="RequirePhishResist">Require Phishing-Resistant Multi-factor Authentication</option>
                            <option value="RequireMfaForRisk">Require Multi-factor Authentication for Risk</option>
                            <option value="RequirePasswordChange">Require Password Change</option>
                            <option value="RequireCompliant">Require Compliant Device</option>
                            <option value="AppProtection">Require App Protection</option>
                            <option value="AppEnforced">App Enforced Restrictions</option>
                            <option value="Block">Block Unknown Platforms</option>
                            <option value="BlockHighRisk">Block High Risk</option>
                            <option value="BlockInsiderRisk">Block Insider Risk</option>
                            <option value="BlockLegacyAuth">Block Legacy Auth</option>
                            <option value="BlockInteractive">Block Interactive Sign-in</option>
                            <option value="SessionControl">Session Control</option>
                            <option value="TermsOfUse">Terms of Use</option>
                            <option value="Custom">Custom Requirement...</option>
                        </select>
                    )}
                </div>
            </div>

            {/* Live Preview — streamlined card integrated footer */}
            <div className="mt-3 rounded-lg border bg-white dark:bg-[#1b1a19] border-[#edebe9] dark:border-[#484644] shadow-soft dark:shadow-none">
                <div className="px-3 py-2 flex items-center gap-3 border-[#edebe9] dark:border-[#484644] bg-[#faf9f8] dark:bg-[#1b1a19] rounded-lg">
                    <div className="flex items-center gap-2 shrink-0">
                        <Eye className="w-3.5 h-3.5 text-[#0078d4]" />
                        <span className="text-[12px] font-medium text-[#616161] dark:text-[#a19f9d]">Preview</span>
                    </div>
                    <div className="flex-1 px-3 py-1.5 rounded font-mono text-[14px] font-semibold tracking-wide bg-white dark:bg-[#252423] text-[#0078d4] dark:text-[#60cdff] border border-[#edebe9] dark:border-transparent truncate">
                        {generatedName}
                    </div>
                    <button
                        onClick={() => handleCopy(generatedName, 'live-pill')}
                        className={`shrink-0 h-[26px] px-2.5 rounded-sm text-[12px] font-medium transition-all flex items-center gap-1.5 border ${copiedId === 'live-pill'
                            ? 'bg-[#f1faf1] dark:bg-[#1b2b1b] border-[#c6ebc9] dark:border-[#1e4620] text-[#107c10] dark:text-[#a3d4a3]'
                            : 'bg-white dark:bg-[#323130] border-[#e1dfdd] dark:border-[#484644] text-[#605e5c] dark:text-[#c8c6c4] hover:border-[#c8c6c4] dark:hover:border-[#605e5c] hover:text-[#323130] dark:hover:text-[#e1dfdd]'
                            }`}
                    >
                        {copiedId === 'live-pill' ? <><Check className="w-3.5 h-3.5" /> <span>Copied</span></> : <><Copy className="w-3.5 h-3.5" /> <span>Copy</span></>}
                    </button>
                </div>
            </div>
        </div>
    );
}
