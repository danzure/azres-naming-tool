import { memo, useMemo, useState } from 'react';
import { Copy, Check, Info, ChevronDown, ShieldCheck, ShieldAlert, AlertTriangle, Code2 } from 'lucide-react';
import PropTypes from 'prop-types';

import { VNET_TOPOLOGIES, AVD_TOPOLOGIES, AKS_TOPOLOGIES, SQL_TOPOLOGIES, WEB_TOPOLOGIES, ML_TOPOLOGIES } from '../data/constants';
import ValidationHighlight from './ValidationHighlight';
import { validateName } from '../utils/nameValidator';
import { generateBicepTemplate, generateTerraformTemplate, generateBundleTemplates } from '../utils/templateGenerator';

// ── Static constants (module-level, never re-created) ──────────────────────────

const SCOPE_DESCRIPTIONS = {
    'Resource group': 'Unique within the Resource Group.',
    'Subscription': 'Unique within the Subscription.',
    'Tenant': 'Unique within the Tenant.',
    'Global': 'Unique across all of Azure (globally).',
    'Region': 'Unique within the Azure Region.',
    'VNet': 'Unique within the Virtual Network.',
    'Namespace': 'Unique within the Namespace.',
    'Storage account': 'Unique across all of Azure (globally).',
    'Server': 'Unique within the Server.',
    'Environment': 'Unique within the Environment.',
    'Workspace': 'Unique within the Workspace.',
    'vWAN': 'Unique within the Virtual WAN.',
    'ANF account': 'Unique within the NetApp Account.',
    'Capacity pool': 'Unique within the Capacity Pool.',
    'Scope': 'Scope depends on context.',
};

const SUBNET_OVERRIDES = {
    afw: {
        desc: "Dedicated subnet for Azure Firewall. The name 'AzureFirewallSubnet' is mandatory.",
        bestPractice: "Must be named exactly 'AzureFirewallSubnet'. Recommended size is /26.",
    },
    bas: {
        desc: "Dedicated subnet for Azure Bastion. The name 'AzureBastionSubnet' is mandatory.",
        bestPractice: "Must be named exactly 'AzureBastionSubnet'. Minimum size is /26. Must be in the same VNet as the VMs it connects to.",
    },
    gw: {
        desc: "Dedicated subnet for Virtual Network Gateways (VPN/ExpressRoute). The name 'GatewaySubnet' is mandatory.",
        bestPractice: "Must be named exactly 'GatewaySubnet'. Recommended size is /27 or larger.",
    },
    afwm: {
        desc: "Dedicated management subnet for Azure Firewall (Basic SKU or forced tunneling). The name 'AzureFirewallManagementSubnet' is mandatory.",
        bestPractice: "Must be named exactly 'AzureFirewallManagementSubnet'. Minimum size is /26.",
    },
    rs: {
        desc: "Dedicated subnet for Azure Route Server. The name 'RouteServerSubnet' is mandatory.",
        bestPractice: "Must be named exactly 'RouteServerSubnet'. Minimum size is /27.",
    },
};

const TOPOLOGY_MAP = {
    'Virtual network': VNET_TOPOLOGIES,
    'Kubernetes (AKS)': AKS_TOPOLOGIES,
    'SQL server': SQL_TOPOLOGIES,
    'App Service': WEB_TOPOLOGIES,
    'Machine Learning workspace': ML_TOPOLOGIES,
};

const NAME_PATTERN_RE = /^Name pattern:\s*([^.]+)\.\s*/;

// ── Reusable sub-components (defined at module level to avoid re-creation) ─────

/** Fluent UI 2 themed select dropdown */
function FluentSelect({ value, onChange, options }) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={onChange}
                className="w-full h-[32px] px-3 pr-8 rounded-sm border appearance-none cursor-pointer text-[13px] focus:outline-none focus:border-[#0078d4] focus:ring-1 focus:ring-[#0078d4] transition-colors bg-white dark:bg-[#1b1a19] border-[#8a8886] dark:border-[#605e5c] text-[#323130] dark:text-white"
            >
                {options.map(opt => (
                    <option key={opt.value ?? opt.suffix} value={opt.value ?? opt.suffix}>{opt.label}</option>
                ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-[#605e5c] dark:text-[#c8c6c4]" />
        </div>
    );
}

/** Single row in the Naming Rules card */
function NamingRuleRow({ label, description, children, isLast = false }) {
    return (
        <div className={`flex items-center justify-between py-1.5 ${isLast ? '' : 'border-b border-[#e1dfdd] dark:border-[#3b3a39]'}`}>
            <div className="flex flex-col gap-0 min-w-0 mr-3">
                <span className="text-[12px] font-medium text-[#323130] dark:text-[#e1dfdd] leading-tight">{label}</span>
                <span className="text-[11px] text-[#a19f9d] leading-tight">{description}</span>
            </div>
            <div className="shrink-0">{children}</div>
        </div>
    );
}

// ── Main component ─────────────────────────────────────────────────────────────

/**
 * Expanded Resource Panel Component
 *
 * Displays detailed view for a selected resource, including:
 * - Topology selection (Single, Hub & Spoke, Bundle)
 * - Generated resource names with copy functionality
 * - Resource description and naming recommendations
 * - Naming rules visualization
 */
function ExpandedPanel({
    resource, genName, isCopied, onCopy,
    selectedSubResource, onSubResourceChange,
    topology, setTopology, spokeCount, setSpokeCount, spokeStartValue, setSpokeStartValue,
    bundle, getBundleName,
}) {
    // ── Derived state ──────────────────────────────────────────────────────────
    const [iacTab, setIacTab] = useState('bicep');
    const [isIacCopied, setIsIacCopied] = useState(false);

    const currentSubResource = resource.subResources?.find(sr => sr.suffix === selectedSubResource);
    const validationIssues = useMemo(() => validateName(genName, resource), [genName, resource]);

    const isVNet = resource.name === 'Virtual network';
    const isAVD = resource.category === 'Desktop Virtualization' && resource.name === 'Host Pool';

    const topologyOptions = useMemo(() => {
        if (isAVD) return AVD_TOPOLOGIES;
        return TOPOLOGY_MAP[resource.name] || [];
    }, [resource.name, isAVD]);

    const showTopology = topologyOptions.length > 0;
    const isHubSpoke = isVNet && topology === 'hub-spoke';
    const scopeDesc = SCOPE_DESCRIPTIONS[resource.scope] || `Name uniqueness scope: ${resource.scope}`;

    // Resolve subnet-specific description overrides
    const { displayDesc, displayBestPractice } = useMemo(() => {
        if (resource.name === 'Subnet' && selectedSubResource && SUBNET_OVERRIDES[selectedSubResource]) {
            return SUBNET_OVERRIDES[selectedSubResource];
        }
        return { desc: resource.desc, bestPractice: resource.bestPractice };
    }, [resource.name, resource.desc, resource.bestPractice, selectedSubResource]);

    // Parse the naming pattern from guidance text
    const { namingPattern, namingGuidanceText } = useMemo(() => {
        const raw = resource.namingGuidance || displayBestPractice || '';
        const match = raw.match(NAME_PATTERN_RE);
        return {
            namingPattern: match ? match[1].trim() : null,
            namingGuidanceText: match ? raw.slice(match[0].length).trim() : raw,
        };
    }, [resource.namingGuidance, displayBestPractice]);

    const iacTemplate = useMemo(() => {
        if (bundle && bundle.length > 0) {
            return generateBundleTemplates(bundle, iacTab, getBundleName);
        }
        return iacTab === 'bicep' 
            ? generateBicepTemplate(resource, genName)
            : generateTerraformTemplate(resource, genName);
    }, [bundle, iacTab, resource, genName, getBundleName]);

    const handleCopyIac = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(iacTemplate);
        setIsIacCopied(true);
        setTimeout(() => setIsIacCopied(false), 2000);
    };

    // ── Shared theme tokens (computed once per render) ──────────────────────────

    const t = useMemo(() => ({
        // Surface card
        card: 'bg-white dark:bg-[#292827] border-[#e1dfdd] dark:border-[#3b3a39]',
        // Primary body text
        text: 'text-[#323130] dark:text-[#d2d0ce]',
        // Strong text / headings
        strong: 'text-[#242424] dark:text-white',
        // Caption / label
        caption: 'text-[#605e5c] dark:text-[#c8c6c4]',
        // Muted / secondary text
        muted: 'text-[#605e5c] dark:text-[#a19f9d]',
        // Divider
        divider: 'border-[#e1dfdd] dark:border-[#3b3a39]',
        // Code badge
        code: 'bg-[#f3f2f1] dark:bg-[#323130] text-[#0078d4] dark:text-[#60cdff] border-[#e1dfdd] dark:border-[#484644]',
        // Code block (naming pattern)
        codeBlock: 'bg-[#f5f5f5] dark:bg-[#1b1a19] text-[#0078d4] dark:text-[#60cdff] border border-[#e1dfdd] dark:border-[#3b3a39]',
        // Char badge
        charBadge: 'bg-[#f3f2f1] dark:bg-[#323130] text-[#323130] dark:text-[#e1dfdd] border-[#e1dfdd] dark:border-[#484644]',
    }), []);

    // ── Validation bar styles ──────────────────────────────────────────────────

    const validationBar = useMemo(() => {
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

    // ── Render ─────────────────────────────────────────────────────────────────

    return (
        <div onClick={(e) => e.stopPropagation()} className="px-5 py-4 border-t cursor-default bg-[#faf9f8] dark:bg-[#1b1a19] border-[#edebe9] dark:border-[#484644]">
            {/* Header — compact inline row */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 flex-wrap">
                    <span className={`text-[12px] font-semibold ${t.caption}`}>Resource guidance</span>

                    {/* Topology inline */}
                    {showTopology && (
                        <div className="flex items-center gap-2">
                            <span className={`text-[11px] ${t.muted}`}>{isVNet ? 'Topology:' : 'Bundle:'}</span>
                            <div className="relative">
                                <select
                                    value={topology}
                                    onChange={(e) => setTopology?.(e.target.value)}
                                    className="h-[26px] pl-2.5 pr-7 rounded-sm border appearance-none cursor-pointer text-[12px] focus:outline-none focus:border-[#0078d4] transition-colors bg-white dark:bg-[#1b1a19] border-[#8a8886] dark:border-[#605e5c] text-[#323130] dark:text-white"
                                >
                                    {topologyOptions.map(opt => <option key={opt.value ?? opt.suffix} value={opt.value ?? opt.suffix}>{opt.label}</option>)}
                                </select>
                                <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none text-[#605e5c] dark:text-[#c8c6c4]" />
                            </div>
                            {isHubSpoke && (
                                <>
                                    <span className={`text-[11px] ${t.muted}`}>Spokes:</span>
                                    <input type="number" min="0" max="20" value={spokeCount}
                                        onChange={(e) => setSpokeCount?.(Math.max(0, Math.min(20, parseInt(e.target.value) || 0)))}
                                        className="w-[56px] h-[26px] px-2 rounded-sm border text-[12px] focus:outline-none focus:border-[#0078d4] transition-colors bg-white dark:bg-[#1b1a19] border-[#8a8886] dark:border-[#605e5c] text-[#323130] dark:text-white"
                                    />
                                    <span className={`text-[11px] ${t.muted}`}>from:</span>
                                    <input type="number" min="0" max="999" value={spokeStartValue}
                                        onChange={(e) => setSpokeStartValue?.(Math.max(0, parseInt(e.target.value) || 0))}
                                        className="w-[56px] h-[26px] px-2 rounded-sm border text-[12px] focus:outline-none focus:border-[#0078d4] transition-colors bg-white dark:bg-[#1b1a19] border-[#8a8886] dark:border-[#605e5c] text-[#323130] dark:text-white"
                                    />
                                </>
                            )}
                        </div>
                    )}

                    {/* Sub-resource inline */}
                    {resource.subResources?.length > 0 && (
                        <div className="flex items-center gap-2">
                            <span className={`text-[11px] ${t.muted}`}>Target:</span>
                            <div className="relative">
                                <select
                                    value={selectedSubResource || ''}
                                    onChange={(e) => onSubResourceChange?.(e.target.value)}
                                    className="h-[26px] pl-2.5 pr-7 rounded-sm border appearance-none cursor-pointer text-[12px] focus:outline-none focus:border-[#0078d4] transition-colors bg-white dark:bg-[#1b1a19] border-[#8a8886] dark:border-[#605e5c] text-[#323130] dark:text-white"
                                >
                                    {resource.subResources.map(opt => <option key={opt.suffix} value={opt.suffix}>{opt.label}</option>)}
                                </select>
                                <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none text-[#605e5c] dark:text-[#c8c6c4]" />
                            </div>
                            {currentSubResource?.dnsZone && (
                                <code className={`px-1.5 py-0.5 rounded-sm font-mono text-[11px] ${t.code}`}>{currentSubResource.dnsZone}</code>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Generated Bundle List */}
            {bundle?.length > 0 && (
                <div className={`mb-3 px-3 py-2 rounded-md border ${t.card}`}>
                    <span className={`text-[11px] font-semibold mb-1.5 block ${t.caption}`}>Generated Resources</span>
                    <div className="flex flex-col">
                        {bundle.map((item, idx) => {
                            const itemName = getBundleName(item);
                            return (
                                <div key={idx} className={`flex items-center justify-between py-1 gap-2 ${idx > 0 ? `border-t ${t.divider}` : ''}`}>
                                    <span className={`text-[11px] font-medium shrink-0 w-32 truncate ${t.muted}`}>{item.name}</span>
                                    <div className={`text-[12px] font-mono truncate flex-1 ${t.strong}`}>
                                        <ValidationHighlight name={itemName} allowedCharsPattern={item.chars || resource.chars} />
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onCopy(e, itemName); }}
                                        className={`h-[22px] px-2 rounded-sm text-[11px] font-medium transition-all flex items-center gap-1 shrink-0 text-white ${isCopied ? 'bg-[#107c10]' : 'bg-[#0078d4] hover:bg-[#106ebe]'}`}
                                    >
                                        <Copy className="w-3 h-3" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Validation Status */}
            <div className={`mb-3 rounded-sm overflow-hidden flex border ${validationBar.bg}`}>
                <div className={`w-[3px] shrink-0 ${validationBar.accent}`} />
                <div className="flex-1 px-3 py-2">
                    {validationIssues.length === 0 ? (
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#107c10] shrink-0" />
                            <span className="text-[12px] font-medium text-[#0e700e] dark:text-[#a3d4a3]">Name passes all validation checks</span>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1">
                            {validationIssues.map((issue, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    {issue.type === 'error'
                                        ? <ShieldAlert className="w-3 h-3 shrink-0 text-[#c50f1f]" />
                                        : <AlertTriangle className="w-3 h-3 shrink-0 text-[#f7941d]" />
                                    }
                                    <span className="text-[12px] text-[#242424] dark:text-[#e1dfdd]">{issue.message}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-3">
                {/* Left Column — About + Naming Guidance merged */}
                <div className={`rounded-md border overflow-hidden ${t.card}`}>
                    {/* About this Service */}
                    <div className="px-4 pt-3 pb-2">
                        <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-1.5">
                                <Info className={`w-3 h-3 ${t.muted}`} />
                                <span className={`text-[11px] font-semibold ${t.caption}`}>About this service</span>
                            </div>
                            {resource.learnUrl && (
                                <a
                                    href={resource.learnUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-[26px] px-2.5 rounded-sm text-[11px] font-medium transition-all flex items-center gap-1.5 border bg-white dark:bg-[#323130] border-[#e1dfdd] dark:border-[#484644] text-[#605e5c] dark:text-[#c8c6c4] hover:border-[#c8c6c4] dark:hover:border-[#605e5c] hover:text-[#323130] dark:hover:text-[#e1dfdd]"
                                >
                                    View docs
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                </a>
                            )}
                        </div>
                        <p className={`text-[12px] leading-[1.6] ${t.text}`}>
                            {resource.longDesc || displayDesc}
                        </p>
                    </div>

                    {/* Naming Guidance — divider-separated */}
                    {(namingPattern || namingGuidanceText) && (
                        <div className={`border-t px-4 pt-2 pb-3 ${t.divider}`}>
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <Check className="w-3 h-3 text-[#107c10]" />
                                <span className={`text-[11px] font-semibold ${t.caption}`}>Naming guidance</span>
                            </div>
                            {namingPattern && (
                                <div className={`mb-1.5 px-2.5 py-1.5 rounded-sm font-mono text-[11px] ${t.codeBlock}`}>
                                    {namingPattern}
                                </div>
                            )}
                            {namingGuidanceText && (
                                <p className={`text-[12px] leading-[1.6] ${t.text}`}>
                                    {namingGuidanceText}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Column — Naming Rules & IaC */}
                <div className="flex flex-col gap-4 min-w-0">
                    {/* Naming Rules */}
                    <div className={`rounded-md border overflow-hidden flex-shrink-0 ${t.card}`}>
                        <div className="p-4">
                            <span className={`text-[12px] font-semibold mb-4 block ${t.caption}`}>Naming rules</span>
                            <div className="flex flex-col">
                                <NamingRuleRow label="Uniqueness Scope" description="The level at which the name must be unique.">
                                    <div className="flex flex-col items-end gap-0.5 text-right">
                                        <span className={`text-[13px] font-semibold ${t.strong}`}>{resource.scope || 'Resource group'}</span>
                                        <span className="text-[11px] max-w-[200px] leading-tight text-[#a19f9d]">{scopeDesc}</span>
                                    </div>
                                </NamingRuleRow>

                                <NamingRuleRow label="Max Length" description="Maximum number of characters allowed.">
                                    <span className={`text-[13px] font-mono font-semibold ${t.strong}`}>
                                        {resource.maxLength} chars
                                    </span>
                                </NamingRuleRow>

                                <NamingRuleRow label="Recommended Abbrev" description="Common abbreviation for this resource type.">
                                    <code className={`text-[12px] px-2 py-0.5 rounded-sm font-mono font-medium border ${t.code}`}>
                                        {resource.abbrev}{selectedSubResource ? `-${selectedSubResource}` : ''}
                                    </code>
                                </NamingRuleRow>

                                <NamingRuleRow label="Allowed Characters" description="Only the characters shown here are permitted in the name." isLast>
                                    <div className="flex items-center gap-1 flex-wrap justify-end">
                                        {resource.chars?.split(',').map((char, i) => (
                                            <span key={i} className={`text-[11px] px-1.5 py-0.5 rounded-sm font-mono font-medium min-w-[22px] text-center border ${t.charBadge}`}>
                                                {char.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </NamingRuleRow>
                            </div>
                        </div>
                    </div>

                    {/* Infrastructure as Code */}
                    <div className={`rounded-md border overflow-hidden flex flex-col flex-1 ${t.card}`}>
                        <div className="flex items-center justify-between px-4 pt-3 pb-2 shrink-0">
                            <div className="flex items-center gap-1.5">
                                <Code2 className={`w-3 h-3 ${t.muted}`} />
                                <span className={`text-[11px] font-semibold ${t.caption}`}>Resource Template</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex bg-[#edebe9] dark:bg-[#323130] rounded-sm p-0.5">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setIacTab('bicep'); }}
                                        className={`text-[11px] px-3 py-1 font-medium rounded-sm transition-all ${iacTab === 'bicep' ? 'bg-white dark:bg-[#484644] text-[#0078d4] dark:text-[#60cdff] shadow-sm' : 'text-[#605e5c] dark:text-[#c8c6c4] hover:text-[#323130] dark:hover:text-[#e1dfdd]'}`}
                                    >
                                        Bicep
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setIacTab('terraform'); }}
                                        className={`text-[11px] px-3 py-1 font-medium rounded-sm transition-all ${iacTab === 'terraform' ? 'bg-white dark:bg-[#484644] text-[#0078d4] dark:text-[#60cdff] shadow-sm' : 'text-[#605e5c] dark:text-[#c8c6c4] hover:text-[#323130] dark:hover:text-[#e1dfdd]'}`}
                                    >
                                        Terraform
                                    </button>
                                </div>
                                <button
                                    onClick={handleCopyIac}
                                    className={`h-[26px] px-2.5 rounded-sm text-[11px] font-medium transition-all flex items-center gap-1.5 border ${isIacCopied ? 'bg-[#f1faf1] dark:bg-[#1b2b1b] border-[#c6ebc9] dark:border-[#1e4620] text-[#107c10] dark:text-[#a3d4a3]' : 'bg-white dark:bg-[#323130] border-[#e1dfdd] dark:border-[#484644] text-[#605e5c] dark:text-[#c8c6c4] hover:border-[#c8c6c4] dark:hover:border-[#605e5c] hover:text-[#323130] dark:hover:text-[#e1dfdd]'}`}
                                    title="Copy template"
                                >
                                    {isIacCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                    <span>{isIacCopied ? 'Copied' : 'Copy'}</span>
                                </button>
                            </div>
                        </div>
                        <div className="border-t border-[#e1dfdd] dark:border-[#3b3a39] bg-[#f3f2f1] dark:bg-[#1b1a19]">
                            <pre className={`text-[11px] font-mono whitespace-pre-wrap overflow-x-auto overflow-y-auto max-h-[14.5rem] p-4 ${t.text}`}>
                                {iacTemplate}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

ExpandedPanel.propTypes = {
    resource: PropTypes.shape({
        name: PropTypes.string.isRequired,
        abbrev: PropTypes.string.isRequired,
        category: PropTypes.string,
        maxLength: PropTypes.number,
        scope: PropTypes.string,
        chars: PropTypes.string,
        desc: PropTypes.string,
        longDesc: PropTypes.string,
        bestPractice: PropTypes.string,
        namingGuidance: PropTypes.string,
        learnUrl: PropTypes.string,
        subResources: PropTypes.arrayOf(PropTypes.shape({
            suffix: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            dnsZone: PropTypes.string,
        })),
    }).isRequired,
    genName: PropTypes.string.isRequired,
    isCopied: PropTypes.bool.isRequired,
    onCopy: PropTypes.func.isRequired,
    selectedSubResource: PropTypes.string,
    onSubResourceChange: PropTypes.func,
    topology: PropTypes.string,
    setTopology: PropTypes.func,
    spokeCount: PropTypes.number,
    setSpokeCount: PropTypes.func,
    spokeStartValue: PropTypes.number,
    setSpokeStartValue: PropTypes.func,
    bundle: PropTypes.array,
    getBundleName: PropTypes.func,
};

export default memo(ExpandedPanel);
