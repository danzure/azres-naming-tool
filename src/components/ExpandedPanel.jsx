import { memo, useMemo } from 'react';
import { ChevronDown, X } from 'lucide-react';
import PropTypes from 'prop-types';

import { VNET_TOPOLOGIES, AVD_TOPOLOGIES, AKS_TOPOLOGIES, SQL_TOPOLOGIES, WEB_TOPOLOGIES, ML_TOPOLOGIES } from '../data/constants';
import { validateName } from '../utils/nameValidator';

import ValidationBar from './expanded/ValidationBar';
import BundleList from './expanded/BundleList';
import AboutCard from './expanded/AboutCard';
import NamingRulesCard from './expanded/NamingRulesCard';
import ResourceTemplateCard from './expanded/ResourceTemplateCard';

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
    bundle, getBundleName, onClose
}) {
    // ── Derived state ──────────────────────────────────────────────────────────
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

    // ── Render ─────────────────────────────────────────────────────────────────

    return (
        <div onClick={(e) => e.stopPropagation()} className="px-5 py-4 border-t cursor-default bg-[#faf9f8] dark:bg-[#1b1a19] border-[#edebe9] dark:border-[#484644]">
            {/* Header — compact inline row */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 flex-wrap">
                    <span className={`text-[13px] font-semibold ${t.caption}`}>Resource guidance</span>

                    {/* Topology inline */}
                    {showTopology && (
                        <div className="flex items-center gap-2">
                            <span className={`text-[12px] ${t.muted}`}>{isVNet ? 'Topology:' : 'Bundle:'}</span>
                            <div className="relative">
                                <select
                                    value={topology}
                                    onChange={(e) => setTopology?.(e.target.value)}
                                    className="h-[26px] pl-2.5 pr-7 rounded-sm border appearance-none cursor-pointer text-[13px] focus:outline-none focus:border-[#0078d4] transition-colors bg-white dark:bg-[#1b1a19] border-[#8a8886] dark:border-[#605e5c] text-[#323130] dark:text-white"
                                >
                                    {topologyOptions.map(opt => <option key={opt.value ?? opt.suffix} value={opt.value ?? opt.suffix}>{opt.label}</option>)}
                                </select>
                                <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none text-[#605e5c] dark:text-[#c8c6c4]" />
                            </div>
                            {isHubSpoke && (
                                <>
                                    <span className={`text-[12px] ${t.muted}`}>Spokes:</span>
                                    <input type="number" min="0" max="20" value={spokeCount}
                                        onChange={(e) => setSpokeCount?.(Math.max(0, Math.min(20, parseInt(e.target.value) || 0)))}
                                        className="w-[56px] h-[26px] px-2 rounded-sm border text-[13px] focus:outline-none focus:border-[#0078d4] transition-colors bg-white dark:bg-[#1b1a19] border-[#8a8886] dark:border-[#605e5c] text-[#323130] dark:text-white"
                                    />
                                    <span className={`text-[12px] ${t.muted}`}>from:</span>
                                    <input type="number" min="0" max="999" value={spokeStartValue}
                                        onChange={(e) => setSpokeStartValue?.(Math.max(0, parseInt(e.target.value) || 0))}
                                        className="w-[56px] h-[26px] px-2 rounded-sm border text-[13px] focus:outline-none focus:border-[#0078d4] transition-colors bg-white dark:bg-[#1b1a19] border-[#8a8886] dark:border-[#605e5c] text-[#323130] dark:text-white"
                                    />
                                </>
                            )}
                        </div>
                    )}

                    {/* Sub-resource inline */}
                    {resource.subResources?.length > 0 && (
                        <div className="flex items-center gap-2">
                            <span className={`text-[12px] ${t.muted}`}>Target:</span>
                            <div className="relative">
                                <select
                                    value={selectedSubResource || ''}
                                    onChange={(e) => onSubResourceChange?.(e.target.value)}
                                    className="h-[26px] pl-2.5 pr-7 rounded-sm border appearance-none cursor-pointer text-[13px] focus:outline-none focus:border-[#0078d4] transition-colors bg-white dark:bg-[#1b1a19] border-[#8a8886] dark:border-[#605e5c] text-[#323130] dark:text-white"
                                >
                                    {resource.subResources.map(opt => <option key={opt.suffix} value={opt.suffix}>{opt.label}</option>)}
                                </select>
                                <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none text-[#605e5c] dark:text-[#c8c6c4]" />
                            </div>
                            {currentSubResource?.dnsZone && (
                                <code className={`px-1.5 py-0.5 rounded-sm font-mono text-[12px] ${t.code}`}>{currentSubResource.dnsZone}</code>
                            )}
                        </div>
                    )}
                </div>
            </div>


            <BundleList 
                bundle={bundle} 
                getBundleName={getBundleName} 
                resource={resource} 
                isCopied={isCopied} 
                onCopy={onCopy} 
                t={t} 
            />

            <ValidationBar validationIssues={validationIssues} />

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-3">
                <AboutCard 
                    resource={resource} 
                    displayDesc={displayDesc} 
                    namingPattern={namingPattern} 
                    namingGuidanceText={namingGuidanceText} 
                    t={t} 
                />

                <div className="flex flex-col gap-4 min-w-0">
                    <NamingRulesCard 
                        resource={resource} 
                        scopeDesc={scopeDesc} 
                        selectedSubResource={selectedSubResource} 
                        t={t} 
                    />

                    <ResourceTemplateCard 
                        resource={resource} 
                        genName={genName} 
                        bundle={bundle} 
                        getBundleName={getBundleName} 
                        t={t} 
                    />
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
    onClose: PropTypes.func,
};

export default memo(ExpandedPanel);
