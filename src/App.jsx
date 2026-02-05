import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
    Search, Copy, CheckCircle2, Settings, ChevronDown, ChevronUp,
    Moon, Sun, Plus, X, Info, Check, User, Clock,
    ArrowLeft, ArrowRight, Eye, EyeOff,
    Layers, CreditCard, AppWindow as AppWindowIcon, MapPin,
    Tags, BookOpen, ShieldAlert, BarChart3, ShieldCheck,
    GanttChart, Scale, Box, LayoutGrid, List as ListIcon, Edit3, HelpCircle, Filter
} from 'lucide-react';

const fluentTokens = {
    light: { bg: '#faf9f8', surface: '#ffffff', border: '#edebe9', borderInput: '#8a8886', textPrimary: '#201f1e', textSecondary: '#605e5c', brand: '#0078d4', brandHover: '#106ebe', error: '#a80000', success: '#107c10' },
    dark: { bg: '#1b1a19', surface: '#252423', border: '#484644', borderInput: '#605e5c', textPrimary: '#ffffff', textSecondary: '#c8c6c4', brand: '#2899f5', brandHover: '#4cb0f9', error: '#f1707b', success: '#92c353' }
};

const AZURE_REGIONS = [
    { label: 'Europe', type: 'header' },
    { label: 'UK South', value: 'uksouth', abbrev: 'uks' },
    { label: 'UK West', value: 'ukwest', abbrev: 'ukw' },
    { label: 'North Europe', value: 'northeurope', abbrev: 'neu' },
    { label: 'West Europe', value: 'westeurope', abbrev: 'weu' },
    { label: 'France Central', value: 'francecentral', abbrev: 'frc' },
    { label: 'Germany West Central', value: 'germanywestcentral', abbrev: 'gwc' },
    { label: 'Norway East', value: 'norwayeast', abbrev: 'nwe' },
    { label: 'Sweden Central', value: 'swedencentral', abbrev: 'sdc' },
    { label: 'Switzerland North', value: 'switzerlandnorth', abbrev: 'swn' },
    { label: 'Americas', type: 'header' },
    { label: 'East US', value: 'eastus', abbrev: 'eus' },
    { label: 'East US 2', value: 'eastus2', abbrev: 'eus2' },
    { label: 'West US', value: 'westus', abbrev: 'wus' },
    { label: 'West US 2', value: 'westus2', abbrev: 'wus2' },
    { label: 'West US 3', value: 'westus3', abbrev: 'wus3' },
    { label: 'Central US', value: 'centralus', abbrev: 'cus' },
    { label: 'Canada Central', value: 'canadacentral', abbrev: 'cac' },
    { label: 'Brazil South', value: 'brazilsouth', abbrev: 'brs' },
    { label: 'Asia Pacific', type: 'header' },
    { label: 'East Asia', value: 'eastasia', abbrev: 'ea' },
    { label: 'Southeast Asia', value: 'southeastasia', abbrev: 'sea' },
    { label: 'Australia East', value: 'australiaeast', abbrev: 'aue' },
    { label: 'Japan East', value: 'japaneast', abbrev: 'jpe' },
    { label: 'Central India', value: 'centralindia', abbrev: 'inc' },
    { label: 'Korea Central', value: 'koreacentral', abbrev: 'krc' },
    { label: 'Middle East & Africa', type: 'header' },
    { label: 'UAE North', value: 'uaenorth', abbrev: 'uan' },
    { label: 'South Africa North', value: 'southafricanorth', abbrev: 'san' },
];

const ENVIRONMENTS = [
    { label: 'Production', value: 'prod' },
    { label: 'Development', value: 'dev' },
    { label: 'Staging', value: 'uat' },
    { label: 'Test', value: 'test' },
    { label: 'Shared', value: 'shrd' },
    { label: 'Sandbox', value: 'sbx' },
];

const CAF_PHASES = [
    { title: 'Strategy', icon: BarChart3, desc: 'Define business justification and expected outcomes.', url: 'https://learn.microsoft.com/en-gb/azure/cloud-adoption-framework/strategy/' },
    { title: 'Plan', icon: GanttChart, desc: 'Align actionable adoption plans to business outcomes.', url: 'https://learn.microsoft.com/en-gb/azure/cloud-adoption-framework/plan/' },
    { title: 'Ready', icon: Layers, desc: 'Prepare the cloud environment for planned changes.', url: 'https://learn.microsoft.com/en-gb/azure/cloud-adoption-framework/ready/' },
    { title: 'Adopt', icon: Box, desc: 'Migrate and modernize your workloads.', url: 'https://learn.microsoft.com/en-gb/azure/cloud-adoption-framework/migrate/' },
    { title: 'Govern', icon: Scale, desc: 'Benchmark and enforce governance standards.', url: 'https://learn.microsoft.com/en-gb/azure/cloud-adoption-framework/govern/' },
    { title: 'Manage', icon: Settings, desc: 'Ensure operational compliance and resilience.', url: 'https://learn.microsoft.com/en-gb/azure/cloud-adoption-framework/manage/' }
];

const RESOURCE_DATA_RAW = [
    { category: 'General', name: 'Resource group', abbrev: 'rg', maxLength: 90, scope: 'Subscription', chars: 'a-z, A-Z, 0-9, -, _, (), .', pattern: 'rg-[workload]-[env]-[region]-[instance]', desc: 'Logical container for related resources.', bestPractice: 'Align to workload lifecycles.', learnUrl: 'https://learn.microsoft.com/en-gb/azure/azure-resource-manager/management/overview' },
    { category: 'General', name: 'Management group', abbrev: 'mg', maxLength: 90, scope: 'Tenant', chars: 'a-z, A-Z, 0-9, -, _, (), .', pattern: 'mg-[workload]', desc: 'Hierarchical governance scope.', bestPractice: 'Limit depth to 6 levels.', learnUrl: 'https://learn.microsoft.com/en-gb/azure/governance/management-groups/overview' },
    { category: 'General', name: 'Subscription', abbrev: 'sub', maxLength: 64, scope: 'Tenant', chars: 'a-z, A-Z, 0-9, -, .', pattern: 'sub-[workload]-[env]', desc: 'Primary billing and identity boundary.', bestPractice: 'Separate Production and Non-Production.', learnUrl: 'https://learn.microsoft.com/en-gb/azure/azure-resource-manager/management/overview' },
    { category: 'Compute', name: 'Virtual machine (Windows)', abbrev: 'vmw', maxLength: 15, scope: 'Resource group', chars: 'a-z, A-Z, 0-9, -', pattern: 'vmw[workload][env][region][instance]', desc: 'IaaS Windows compute resource.', bestPractice: 'Keep <15 chars for NetBIOS.', learnUrl: 'https://learn.microsoft.com/en-gb/azure/virtual-machines/windows/overview' },
    { category: 'Compute', name: 'Virtual machine (Linux)', abbrev: 'vml', maxLength: 64, scope: 'Resource group', chars: 'a-z, A-Z, 0-9, -', pattern: 'vml-[workload]-[env]-[region]-[instance]', desc: 'IaaS Linux compute resource.', bestPractice: 'Use SSH keys, disable passwords.', learnUrl: 'https://learn.microsoft.com/en-gb/azure/virtual-machines/linux/overview' },
    { category: 'Compute', name: 'Function app', abbrev: 'func', maxLength: 60, scope: 'Global', chars: 'a-z, A-Z, 0-9, -', pattern: 'func-[workload]-[env]-[region]-[instance]', desc: 'Serverless compute platform.', bestPractice: 'Use Premium plan for VNet integration.', learnUrl: 'https://learn.microsoft.com/en-gb/azure/azure-functions/functions-overview' },
    { category: 'Networking', name: 'Virtual network', abbrev: 'vnet', maxLength: 64, scope: 'Resource group', chars: 'a-z, A-Z, 0-9, -, _, .', pattern: 'vnet-[workload]-[env]-[region]-[instance]', desc: 'Private cloud network boundary.', bestPractice: 'Use Hub-and-Spoke topology.', learnUrl: 'https://learn.microsoft.com/en-gb/azure/virtual-network/virtual-networks-overview' },
    { category: 'Networking', name: 'Subnet', abbrev: 'snet', maxLength: 80, scope: 'VNet', chars: 'a-z, A-Z, 0-9, -, _, .', pattern: 'snet-[workload]-[env]-[region]-[instance]', desc: 'VNet segmentation for security.', bestPractice: 'Align to application tiers.', learnUrl: 'https://learn.microsoft.com/en-gb/azure/virtual-network/virtual-network-manage-subnet' },
    { category: 'Networking', name: 'Network security group', abbrev: 'nsg', maxLength: 80, scope: 'Resource group', chars: 'a-z, A-Z, 0-9, -, _, .', pattern: 'nsg-[workload]-[env]-[region]-[instance]', desc: 'Layer 4 firewall rules.', bestPractice: 'Associate at Subnet level.', learnUrl: 'https://learn.microsoft.com/en-gb/azure/virtual-network/network-security-groups-overview' },
    { category: 'Networking', name: 'Public IP', abbrev: 'pip', maxLength: 80, scope: 'Resource group', chars: 'a-z, A-Z, 0-9, -, _, .', pattern: 'pip-[workload]-[env]-[region]-[instance]', desc: 'Internet-facing IP address.', bestPractice: 'Use Standard SKU for zones.', learnUrl: 'https://learn.microsoft.com/en-gb/azure/virtual-network/ip-services/public-ip-addresses' },
    { category: 'Storage', name: 'Storage account', abbrev: 'st', maxLength: 24, scope: 'Global', chars: 'a-z, 0-9', pattern: 'st[workload][env][region][instance]', desc: 'Blob, File, Queue, Table storage.', bestPractice: 'Disable public blob access.', learnUrl: 'https://learn.microsoft.com/en-gb/azure/storage/common/storage-account-overview' },
    { category: 'Web', name: 'App Service', abbrev: 'app', maxLength: 60, scope: 'Global', chars: 'a-z, A-Z, 0-9, -', pattern: 'app-[workload]-[env]-[region]-[instance]', desc: 'PaaS web hosting.', bestPractice: 'Use Deployment Slots.', learnUrl: 'https://learn.microsoft.com/en-gb/azure/app-service/overview' },
    { category: 'Web', name: 'Static Web App', abbrev: 'stapp', maxLength: 60, scope: 'Global', chars: 'a-z, A-Z, 0-9, -', pattern: 'stapp-[workload]-[env]-[region]-[instance]', desc: 'Static frontend hosting.', bestPractice: 'Use Standard tier for auth.', learnUrl: 'https://learn.microsoft.com/en-gb/azure/static-web-apps/overview' },
    { category: 'Databases', name: 'SQL server', abbrev: 'sql', maxLength: 63, scope: 'Global', chars: 'a-z, 0-9, -', pattern: 'sql-[workload]-[env]-[region]-[instance]', desc: 'Logical SQL container.', bestPractice: 'Enforce Azure AD auth only.', learnUrl: 'https://learn.microsoft.com/en-gb/azure/azure-sql/database/sql-database-paas-overview' },
    { category: 'Databases', name: 'SQL database', abbrev: 'sqldb', maxLength: 128, scope: 'Server', chars: 'a-z, A-Z, 0-9, -, _, .', pattern: 'sqldb-[workload]-[env]-[region]-[instance]', desc: 'Managed relational database.', bestPractice: 'Enable Zone Redundancy.', learnUrl: 'https://learn.microsoft.com/en-gb/azure/azure-sql/database/sql-database-paas-overview' },
    { category: 'Databases', name: 'Cosmos DB account', abbrev: 'cosmos', maxLength: 44, scope: 'Global', chars: 'a-z, 0-9, -', pattern: 'cosmos-[workload]-[env]-[region]-[instance]', desc: 'Global NoSQL database.', bestPractice: 'Choose correct Partition Key.', learnUrl: 'https://learn.microsoft.com/en-gb/azure/cosmos-db/introduction' },
    { category: 'Containers', name: 'Kubernetes (AKS)', abbrev: 'aks', maxLength: 63, scope: 'Resource group', chars: 'a-z, A-Z, 0-9, -, _', pattern: 'aks-[workload]-[env]-[region]-[instance]', desc: 'Managed Kubernetes.', bestPractice: 'Separate System/User node pools.', learnUrl: 'https://learn.microsoft.com/en-gb/azure/aks/intro-kubernetes' },
    { category: 'Containers', name: 'Container registry', abbrev: 'cr', maxLength: 50, scope: 'Global', chars: 'a-z, A-Z, 0-9', pattern: 'cr[workload][env][region][instance]', desc: 'Private Docker registry.', bestPractice: 'Disable Admin User.', learnUrl: 'https://learn.microsoft.com/en-gb/azure/container-registry/container-registry-intro' },
    { category: 'Security', name: 'Key vault', abbrev: 'kv', maxLength: 24, scope: 'Global', chars: 'a-z, A-Z, 0-9, -', pattern: 'kv-[workload]-[env]-[region]-[instance]', desc: 'Secrets and keys store.', bestPractice: 'Enable Purge Protection.', learnUrl: 'https://learn.microsoft.com/en-gb/azure/key-vault/general/overview' },
    { category: 'Management + Governance', name: 'Log Analytics workspace', abbrev: 'log', maxLength: 63, scope: 'Resource group', chars: 'a-z, A-Z, 0-9, -', pattern: 'log-[workload]-[env]-[region]-[instance]', desc: 'Centralized log repository.', bestPractice: 'Centralize per region.', learnUrl: 'https://learn.microsoft.com/en-gb/azure/azure-monitor/logs/log-analytics-overview' },
];

const RESOURCE_DATA_SORTED = [...RESOURCE_DATA_RAW].sort((a, b) => String(a.name).localeCompare(String(b.name)));
const CATEGORIES = ['All', ...[...new Set(RESOURCE_DATA_RAW.map(r => r.category))].sort()];

const ValidationHighlight = ({ name, allowedCharsPattern, isDarkMode }) => {
    const validator = useMemo(() => {
        if (!allowedCharsPattern) return () => true;
        const allowedParts = allowedCharsPattern.split(',').map(s => s.trim());
        let regexStr = '^[';
        allowedParts.forEach(p => {
            if (p === 'a-z') regexStr += 'a-z';
            else if (p === 'A-Z') regexStr += 'A-Z';
            else if (p === '0-9') regexStr += '0-9';
            else if (p === '-') regexStr += '\\-';
            else if (p === '_') regexStr += '_';
            else if (p === '.') regexStr += '\\.';
            else if (p === '()') regexStr += '\\(\\)';
        });
        regexStr += ']$';
        const regex = new RegExp(regexStr);
        return (char) => regex.test(char);
    }, [allowedCharsPattern]);

    return (
        <span className="font-mono">
            {name.split('').map((char, i) => {
                const isValid = validator(char);
                return (
                    <span key={i} className={`${isValid ? '' : 'text-[#a80000] dark:text-[#f1707b] font-bold underline decoration-wavy'}`} title={isValid ? '' : `Invalid: '${char}'`}>
                        {char}
                    </span>
                );
            })}
        </span>
    );
};

const Tooltip = ({ content, children, isDarkMode }) => (
    <div className="relative group/tooltip w-full flex flex-col gap-1">
        {children}
        <div className={`absolute bottom-full left-0 mb-2 hidden group-hover/tooltip:block w-56 p-2 text-[12px] rounded-sm shadow-xl z-50 pointer-events-none border ${isDarkMode ? 'bg-[#252423] text-white border-[#484644]' : 'bg-white text-[#201f1e] border-[#edebe9]'}`}>
            {content}
        </div>
    </div>
);

const SearchableSelect = ({ items, value, onChange, label, isDarkMode, placeholder = "Select...", description }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const wrapperRef = useRef(null);

    const selectedItem = items.find(i => i.value === value && !i.type) || items.find(i => !i.type);
    const filteredItems = items.filter(i => {
        if (i.type === 'header') return true;
        return String(i.label).toLowerCase().includes(search.toLowerCase());
    });

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setIsOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={wrapperRef} className="relative flex-1 group min-w-[200px] flex flex-col gap-2">
            <Tooltip content={description} isDarkMode={isDarkMode}>
                <div className="flex items-center gap-1">
                    <label className={`block text-[14px] font-semibold cursor-help ${isDarkMode ? 'text-[#ffffff]' : 'text-[#201f1e]'}`}>{label}</label>
                    <HelpCircle className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-50 transition-opacity ${isDarkMode ? 'text-[#c8c6c4]' : 'text-[#605e5c]'}`} />
                </div>
                <div onClick={() => setIsOpen(!isOpen)} className={`flex items-center justify-between px-3 h-[32px] cursor-pointer transition-all border rounded text-[14px] ${isDarkMode ? 'bg-[#252423]' : 'bg-white'} ${isOpen ? 'border-b-2 border-b-[#0078d4] border-x-transparent border-t-transparent' : isDarkMode ? 'border-[#605e5c] hover:border-[#8a8886]' : 'border-[#8a8886] hover:border-[#201f1e]'}`}>
                    <div className="flex items-center gap-2 truncate">
                        <span className={`${isDarkMode ? 'text-white' : 'text-[#201f1e]'}`}>{selectedItem?.label}</span>
                        {selectedItem?.abbrev && <span className={`text-[12px] ${isDarkMode ? 'text-[#c8c6c4]' : 'text-[#605e5c]'}`}>({selectedItem.abbrev})</span>}
                    </div>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </Tooltip>

            {isOpen && (
                <div className={`absolute top-[100%] left-0 right-0 z-[100] shadow-lg border rounded-b-sm overflow-hidden mt-1 ${isDarkMode ? 'bg-[#252423] border-[#484644]' : 'bg-white border-[#edebe9]'}`}>
                    <div className="p-2 border-b border-opacity-10 border-current">
                        <input autoFocus type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={placeholder} className={`w-full px-2 py-1 text-[14px] border-b outline-none bg-transparent ${isDarkMode ? 'text-white border-gray-600' : 'text-[#201f1e] border-gray-300'}`} />
                    </div>
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                        {filteredItems.map((item, idx) => {
                            if (item.type === 'header') {
                                const nextItem = filteredItems[idx + 1];
                                if (!nextItem || nextItem.type === 'header') return null;
                                return <div key={`header-${item.label}`} className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider sticky top-0 backdrop-blur-sm z-10 ${isDarkMode ? 'bg-[#1b1a19]/90 text-[#c8c6c4]' : 'bg-[#faf9f8]/90 text-[#605e5c]'}`}>{item.label}</div>;
                            }
                            return (
                                <div key={item.value} onClick={() => { onChange(item.value); setIsOpen(false); setSearch(''); }} className={`flex items-center justify-between px-3 py-2 text-[14px] cursor-pointer transition-colors ${value === item.value ? (isDarkMode ? 'bg-[#292827] text-white font-semibold' : 'bg-[#f3f2f1] text-[#201f1e] font-semibold') : (isDarkMode ? 'text-[#ffffff] hover:bg-[#323130]' : 'text-[#201f1e] hover:bg-[#edebe9]')}`}>
                                    <span>{item.label}</span>
                                    {value === item.value && <Check className="w-4 h-4 text-[#0078d4]" />}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default function App() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isConfigMinimized, setIsConfigMinimized] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [workload, setWorkload] = useState('webapp');
    const [envValue, setEnvValue] = useState('prod');
    const [regionValue, setRegionValue] = useState('uksouth');
    const [instance, setInstance] = useState('001');
    const [orgPrefix, setOrgPrefix] = useState('');
    const [namingOrder, setNamingOrder] = useState(['Org', 'Resource', 'Workload', 'Environment', 'Region', 'Instance']);
    const [showOrg, setShowOrg] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [copiedId, setCopiedId] = useState(null);
    const [expandedCard, setExpandedCard] = useState(null);

    useEffect(() => {
        const styleId = 'fluent-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `
        @import url('https://fonts.cdnfonts.com/css/segoe-ui-4');
        body { font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif; }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #8a8886; border-radius: 4px; }
      `;
            document.head.appendChild(style);
        }
    }, []);

    const currentRegion = useMemo(() => AZURE_REGIONS.find(r => r.value === regionValue) || AZURE_REGIONS.find(r => !r.type), [regionValue]);
    const formattedInstance = useMemo(() => (instance || '001').padStart(3, '0'), [instance]);

    const moveItem = (index, direction) => {
        const newOrder = [...namingOrder];
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= newOrder.length) return;
        [newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]];
        setNamingOrder(newOrder);
    };

    const handleInstanceChange = (e) => {
        const val = e.target.value.replace(/[^0-9]/g, '');
        if (val.length <= 3) setInstance(val);
    };

    const generateName = (resource) => {
        const resAbbrev = resource.abbrev || "res";
        const cleanWorkload = workload.toLowerCase().replace(/[^a-z0-9]/g, '');
        const cleanOrg = orgPrefix.toLowerCase().replace(/[^a-z0-9]/g, '');
        const regAbbrev = currentRegion?.abbrev || 'uks';
        const suffix = formattedInstance;

        if (['st', 'cr', 'as'].includes(resAbbrev)) {
            let parts = [];
            namingOrder.forEach(part => {
                if (part === 'Org' && showOrg && cleanOrg) parts.push(cleanOrg);
                if (part === 'Resource') parts.push(resAbbrev);
                if (part === 'Workload') parts.push(cleanWorkload);
                if (part === 'Environment') parts.push(envValue);
                if (part === 'Region') parts.push(regAbbrev);
                if (part === 'Instance') parts.push(suffix);
            });
            return parts.join('').toLowerCase();
        }

        if (resAbbrev === 'vmw') {
            const maxWorkload = 15 - 3 - 1 - 3 - 3;
            return `${resAbbrev}${cleanWorkload.substring(0, maxWorkload)}${envValue.substring(0, 1)}${regAbbrev.substring(0, 3)}${suffix}`.toLowerCase();
        }

        let parts = [];
        namingOrder.forEach(part => {
            if (part === 'Org' && showOrg && cleanOrg) parts.push(cleanOrg);
            if (part === 'Resource') parts.push(resAbbrev);
            if (part === 'Workload') parts.push(cleanWorkload);
            if (part === 'Environment') parts.push(envValue);
            if (part === 'Region') parts.push(regAbbrev);
            if (part === 'Instance') parts.push(suffix);
        });
        return parts.join('-').toLowerCase();
    };

    const filteredResources = useMemo(() => {
        return RESOURCE_DATA_SORTED.filter(rt => {
            const matchesSearch = String(rt.name).toLowerCase().includes(searchTerm.toLowerCase()) || String(rt.abbrev).toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = activeCategory === 'All' || rt.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, activeCategory]);

    const copyToClipboard = (text, id, e) => {
        if (e) { e.stopPropagation(); e.preventDefault(); }
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.cssText = "position:fixed;top:0;left:0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) { console.error('Copy failed', err); }
        document.body.removeChild(textArea);
    };

    const liveSchemaStr = generateName({ abbrev: 'res' });

    return (
        <div className={`min-h-screen font-sans pb-24 transition-colors duration-200 ${isDarkMode ? 'bg-[#111009] text-white' : 'bg-[#faf9f8] text-[#201f1e]'}`}>
            <header className={`h-[48px] flex items-center justify-between px-5 border-b z-50 fixed top-0 w-full ${isDarkMode ? 'bg-[#1b1a19] border-[#323130]' : 'bg-[#0078d4] border-transparent text-white'}`}>
                <span className="font-semibold text-[16px] text-white tracking-tight">Resource Naming Tool</span>
                <button onClick={() => setIsDarkMode(!isDarkMode)} className={`flex items-center gap-2 px-3 h-[32px] rounded-sm border transition-all text-[13px] font-semibold ${isDarkMode ? 'bg-[#323130] border-[#484644] text-white hover:bg-[#484644]' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}>
                    {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    <span className="hidden sm:inline">{isDarkMode ? 'Light' : 'Dark'}</span>
                </button>
            </header>

            <nav className={`mt-[48px] shadow-sm transition-all border-b ${isDarkMode ? 'bg-[#252423] border-[#484644]' : 'bg-white border-[#edebe9]'}`}>
                <div className="max-w-[1600px] mx-auto px-4 py-3 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className={`text-[18px] font-semibold ${isDarkMode ? 'text-white' : 'text-[#201f1e]'}`}>Configuration</h2>
                            <p className={`text-[12px] ${isDarkMode ? 'text-[#c8c6c4]' : 'text-[#605e5c]'}`}>Define global parameters for resource names.</p>
                        </div>
                        <button onClick={() => setIsConfigMinimized(!isConfigMinimized)} className="text-[14px] font-semibold text-[#0078d4] hover:underline flex items-center gap-1">
                            {isConfigMinimized ? 'Show' : 'Hide'}
                            {isConfigMinimized ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                        </button>
                    </div>

                    {!isConfigMinimized && (
                        <div className="animate-in slide-in-from-top-4 duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-start mb-3">
                                <div className="relative group flex-1 min-w-[200px] flex flex-col gap-1">
                                    <Tooltip content="Identifies the application or workload." isDarkMode={isDarkMode}>
                                        <label className={`block text-[14px] font-semibold ${isDarkMode ? 'text-[#ffffff]' : 'text-[#201f1e]'}`}>Workload</label>
                                        <input type="text" value={workload} onChange={(e) => setWorkload(e.target.value)} className={`w-full px-3 h-[32px] border rounded-sm outline-none text-[14px] ${isDarkMode ? 'bg-[#252423] text-white border-[#605e5c] focus:border-[#0078d4]' : 'bg-white text-[#201f1e] border-[#8a8886] focus:border-[#0078d4]'}`} />
                                    </Tooltip>
                                </div>
                                <SearchableSelect label="Environment" items={ENVIRONMENTS} value={envValue} onChange={setEnvValue} isDarkMode={isDarkMode} description="Development lifecycle stage." />
                                <SearchableSelect label="Region" items={AZURE_REGIONS} value={regionValue} onChange={setRegionValue} isDarkMode={isDarkMode} placeholder="Select region..." description="Azure deployment location." />
                                <div className="relative group min-w-[120px] flex flex-col gap-1">
                                    <Tooltip content="Three-digit sequence number." isDarkMode={isDarkMode}>
                                        <label className={`block text-[14px] font-semibold ${isDarkMode ? 'text-[#ffffff]' : 'text-[#201f1e]'}`}>Instance</label>
                                        <input type="text" value={instance} onChange={handleInstanceChange} maxLength={3} className={`w-full px-3 h-[32px] border rounded-sm outline-none text-[14px] ${isDarkMode ? 'bg-[#252423] text-white border-[#605e5c] focus:border-[#0078d4]' : 'bg-white text-[#201f1e] border-[#8a8886] focus:border-[#0078d4]'}`} />
                                    </Tooltip>
                                </div>
                            </div>

                            <div className={`mb-3 p-3 rounded-sm border flex flex-col gap-3 ${isDarkMode ? 'bg-[#1b1a19] border-[#484644]' : 'bg-white border-[#edebe9]'}`}>
                                <div className="flex items-center gap-2 border-b pb-2" style={{ borderColor: isDarkMode ? '#484644' : '#edebe9' }}>
                                    <Edit3 className="w-4 h-4 text-[#0078d4]" />
                                    <h3 className={`text-[14px] font-semibold ${isDarkMode ? 'text-white' : 'text-[#201f1e]'}`}>Pattern Builder</h3>
                                </div>
                                <div className="flex flex-col lg:flex-row gap-4 items-start">
                                    <div className="w-full lg:w-64 shrink-0 flex flex-col gap-2">
                                        <label className={`block text-[14px] font-semibold ${isDarkMode ? 'text-white' : 'text-[#201f1e]'}`}>Org Prefix</label>
                                        <div className="flex items-center gap-2">
                                            <input type="text" value={orgPrefix} onChange={(e) => setOrgPrefix(e.target.value)} placeholder="e.g. cts" disabled={!showOrg} className={`flex-1 px-3 h-[32px] border rounded-sm outline-none text-[14px] disabled:opacity-50 ${isDarkMode ? 'bg-[#1b1a19] border-[#605e5c] text-white' : 'bg-white border-[#8a8886] text-[#201f1e]'}`} />
                                            <button onClick={() => setShowOrg(!showOrg)} className={`h-[32px] w-[32px] flex items-center justify-center rounded-sm border ${showOrg ? (isDarkMode ? 'bg-[#323130] border-[#484644] text-[#0078d4]' : 'bg-[#f3f2f1] border-[#edebe9] text-[#0078d4]') : (isDarkMode ? 'bg-transparent border-[#605e5c] text-[#797775]' : 'bg-white border-[#8a8886] text-[#605e5c]')}`}>
                                                {showOrg ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex-1 w-full overflow-hidden">
                                        <label className={`block text-[14px] font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-[#201f1e]'}`}>Sequence</label>
                                        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
                                            {namingOrder.map((item, index) => (
                                                <div key={item} className={`flex items-center gap-3 px-3 py-2 rounded-sm border min-w-max h-[32px] ${item === 'Org' && !showOrg ? 'opacity-50 border-dashed' : ''} ${isDarkMode ? 'bg-[#323130] border-[#484644]' : 'bg-[#f3f2f1] border-[#edebe9]'}`}>
                                                    <span className={`text-[13px] font-semibold ${isDarkMode ? 'text-white' : 'text-[#201f1e]'}`}>{item}</span>
                                                    <div className="flex items-center gap-1 border-l pl-2" style={{ borderColor: isDarkMode ? '#484644' : '#d2d0ce' }}>
                                                        <button onClick={() => moveItem(index, -1)} disabled={index === 0} className={`p-1 hover:bg-black/5 rounded disabled:opacity-20 ${isDarkMode ? 'text-[#c8c6c4]' : 'text-[#605e5c]'}`}><ArrowLeft className="w-3.5 h-3.5" /></button>
                                                        <button onClick={() => moveItem(index, 1)} disabled={index === namingOrder.length - 1} className={`p-1 hover:bg-black/5 rounded disabled:opacity-20 ${isDarkMode ? 'text-[#c8c6c4]' : 'text-[#605e5c]'}`}><ArrowRight className="w-3.5 h-3.5" /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={`flex flex-col p-3 rounded border shadow-sm ${isDarkMode ? 'bg-[#1b1a19] border-[#484644]' : 'bg-[#f3f2f1] border-transparent'}`}>
                                <span className={`text-[12px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-[#c8c6c4]' : 'text-[#605e5c]'}`}>Preview Schema</span>
                                <div className="flex items-center gap-3 mt-2">
                                    <code className={`flex-1 font-mono text-[16px] font-semibold truncate lowercase ${isDarkMode ? 'text-white' : 'text-[#201f1e]'}`}>{liveSchemaStr}</code>
                                    <button onClick={(e) => copyToClipboard(liveSchemaStr, 'live-pill', e)} className={`px-3 h-[32px] rounded-sm text-[13px] font-semibold ${isDarkMode ? 'bg-[#323130] text-white hover:bg-[#484644]' : 'bg-white text-[#0078d4] shadow-sm'}`}>
                                        {copiedId === 'live-pill' ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            <div className="max-w-[1600px] mx-auto px-6 pt-8 space-y-8">
                <div className={`p-5 rounded shadow-sm border flex flex-col gap-4 ${isDarkMode ? 'bg-[#252423] border-[#484644]' : 'bg-white border-[#edebe9]'}`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className={`text-[18px] font-semibold ${isDarkMode ? 'text-white' : 'text-[#201f1e]'}`}>Services</h2>
                            <p className={`text-[12px] ${isDarkMode ? 'text-[#c8c6c4]' : 'text-[#605e5c]'}`}>Azure Resource Inventory</p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:max-w-xl">
                            <div className={`relative flex-1 w-full flex items-center px-2 h-[32px] border rounded ${isDarkMode ? 'bg-[#1b1a19] border-[#605e5c]' : 'bg-white border-[#8a8886]'}`}>
                                <Search className="w-4 h-4 mr-2 text-[#0078d4]" />
                                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Filter services..." className={`w-full bg-transparent border-none outline-none text-[14px] ${isDarkMode ? 'text-white placeholder-[#c8c6c4]' : 'text-[#201f1e] placeholder-[#605e5c]'}`} />
                                {searchTerm && <button onClick={() => setSearchTerm('')} className="p-0.5 hover:bg-black/10 rounded-full"><X className={`w-3 h-3 ${isDarkMode ? 'text-white' : 'text-black'}`} /></button>}
                            </div>
                            <div className={`flex rounded overflow-hidden border ${isDarkMode ? 'border-[#605e5c]' : 'border-[#8a8886]'}`}>
                                <button onClick={() => setViewMode('grid')} className={`p-1.5 px-3 ${viewMode === 'grid' ? (isDarkMode ? 'bg-[#323130] text-white' : 'bg-[#f3f2f1] text-[#201f1e]') : (isDarkMode ? 'bg-transparent text-[#c8c6c4]' : 'bg-transparent text-[#605e5c]')}`}><LayoutGrid className="w-4 h-4" /></button>
                                <div className={`w-px ${isDarkMode ? 'bg-[#605e5c]' : 'bg-[#8a8886]'}`}></div>
                                <button onClick={() => setViewMode('list')} className={`p-1.5 px-3 ${viewMode === 'list' ? (isDarkMode ? 'bg-[#323130] text-white' : 'bg-[#f3f2f1] text-[#201f1e]') : (isDarkMode ? 'bg-transparent text-[#c8c6c4]' : 'bg-transparent text-[#605e5c]')}`}><ListIcon className="w-4 h-4" /></button>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t pt-3 custom-scrollbar" style={{ borderColor: isDarkMode ? '#484644' : '#edebe9' }}>
                        <Filter className={`w-3.5 h-3.5 mr-2 shrink-0 ${isDarkMode ? 'text-[#c8c6c4]' : 'text-[#605e5c]'}`} />
                        {CATEGORIES.map(cat => (
                            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-3 py-1 text-[13px] rounded-full whitespace-nowrap border ${activeCategory === cat ? (isDarkMode ? 'bg-[#323130] border-[#323130] text-white font-semibold' : 'bg-[#f3f2f1] border-[#f3f2f1] text-[#201f1e] font-semibold') : (isDarkMode ? 'bg-transparent border-transparent text-[#c8c6c4] hover:bg-[#323130]' : 'bg-transparent border-transparent text-[#605e5c] hover:bg-[#f3f2f1]')}`}>{cat}</button>
                        ))}
                    </div>
                </div>

                <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "flex flex-col gap-2"}>
                    {filteredResources.map((resource) => {
                        const genName = generateName(resource);
                        const isCopied = copiedId === resource.name;
                        const isExpanded = expandedCard === resource.name;
                        const isTooLong = resource.maxLength && genName.length > resource.maxLength;

                        if (viewMode === 'list') {
                            return (
                                <div key={resource.name} onClick={() => setExpandedCard(isExpanded ? null : resource.name)} className={`group flex items-center gap-4 px-4 py-3 rounded-sm border cursor-pointer transition-all ${isExpanded ? `border-[#0078d4] ring-1 ring-[#0078d4] ${isDarkMode ? 'bg-[#252423]' : 'bg-white'}` : isDarkMode ? 'bg-[#252423] border-[#484644] hover:bg-[#323130]' : 'bg-white border-[#edebe9] hover:bg-[#f3f2f1]'}`}>
                                    <div className={`p-2 rounded-sm shrink-0 ${isDarkMode ? 'bg-[#323130] text-[#0078d4]' : 'bg-[#f3f2f1] text-[#0078d4]'}`}><Box className="w-5 h-5" /></div>
                                    <div className="flex flex-col w-[180px] shrink-0">
                                        <span className={`font-semibold text-[14px] truncate ${isDarkMode ? 'text-white' : 'text-[#201f1e]'}`}>{resource.name}</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-[11px] px-1.5 rounded-sm ${isDarkMode ? 'bg-[#323130] text-[#c8c6c4]' : 'bg-[#f3f2f1] text-[#605e5c]'}`}>{resource.category}</span>
                                            <span className={`text-[11px] font-mono opacity-60 ${isDarkMode ? 'text-[#c8c6c4]' : 'text-[#605e5c]'}`}>({resource.abbrev})</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className={`relative flex items-center px-3 h-[32px] border rounded-sm ${isDarkMode ? 'bg-[#1b1a19] border-[#484644]' : 'bg-[#f3f2f1] border-transparent'}`}>
                                            <div className={`text-[13px] font-medium font-mono truncate w-full pr-8 ${isTooLong ? 'text-[#a80000]' : isDarkMode ? 'text-[#ffffff]' : 'text-[#201f1e]'}`}>
                                                <ValidationHighlight name={genName} allowedCharsPattern={resource.chars} isDarkMode={isDarkMode} />
                                            </div>
                                            <button onClick={(e) => copyToClipboard(genName, resource.name, e)} className={`absolute right-1 p-1 rounded-sm ${isCopied ? 'text-[#107c10]' : 'text-[#605e5c] hover:text-[#0078d4]'}`}>
                                                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="w-[80px] flex flex-col items-end shrink-0">
                                        <div className={`text-[11px] font-bold ${isTooLong ? 'text-[#a80000]' : 'text-[#107c10]'}`}>{genName.length} / {resource.maxLength || 64}</div>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div key={resource.name} onClick={() => setExpandedCard(isExpanded ? null : resource.name)} className={`group relative flex flex-col rounded-sm border shadow-sm cursor-pointer transition-all duration-200 ${isExpanded ? 'col-span-full ring-2 ring-[#0078d4] z-10' : 'hover:shadow-md'} ${isDarkMode ? 'bg-[#252423] border-[#484644]' : 'bg-white border-[#edebe9]'} ${isTooLong ? 'border-l-4 border-l-[#a80000]' : ''}`}>
                                <div className="p-4 flex flex-col h-full gap-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className={`p-2 rounded-sm shrink-0 ${isDarkMode ? 'bg-[#323130] text-[#0078d4]' : 'bg-[#f3f2f1] text-[#0078d4]'}`}><Box className="w-5 h-5" /></div>
                                            <div className="flex flex-col min-w-0">
                                                <h3 className={`text-[14px] font-semibold truncate ${isDarkMode ? 'text-white' : 'text-[#201f1e]'}`}>{resource.name}</h3>
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-sm font-medium ${isDarkMode ? 'bg-[#323130] text-[#c8c6c4]' : 'bg-[#f3f2f1] text-[#605e5c]'}`}>{resource.category}</span>
                                                    <span className={`text-[10px] font-mono opacity-60 ${isDarkMode ? 'text-[#c8c6c4]' : 'text-[#605e5c]'}`}>{resource.abbrev}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {isTooLong && <ShieldAlert className="w-4 h-4 text-[#a80000] shrink-0" />}
                                    </div>
                                    <div className="mt-auto pt-2">
                                        <div className={`relative rounded px-3 h-[32px] border flex items-center ${isDarkMode ? 'bg-[#1b1a19] border-[#484644]' : 'bg-[#f3f2f1] border-transparent'}`}>
                                            <div className={`text-[13px] font-medium font-mono truncate w-full pr-8 ${isTooLong ? 'text-[#a80000]' : isDarkMode ? 'text-[#ffffff]' : 'text-[#201f1e]'}`}>
                                                <ValidationHighlight name={genName} allowedCharsPattern={resource.chars} isDarkMode={isDarkMode} />
                                            </div>
                                            <button onClick={(e) => copyToClipboard(genName, resource.name, e)} className={`absolute right-1 p-1 rounded-sm ${isCopied ? 'text-[#107c10]' : 'text-[#605e5c] hover:text-[#0078d4]'}`}>
                                                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                            </button>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] mt-2 px-0.5 opacity-70">
                                            <span className={isDarkMode ? 'text-[#c8c6c4]' : 'text-[#605e5c]'}>Max: {resource.maxLength || 64}</span>
                                            <span className={`font-bold ${isTooLong ? 'text-[#a80000]' : isDarkMode ? 'text-white' : 'text-[#201f1e]'}`}>{genName.length} chars</span>
                                        </div>
                                    </div>
                                </div>
                                {isExpanded && (
                                    <div className={`p-6 border-t cursor-default ${isDarkMode ? 'bg-[#252423] border-[#484644]' : 'bg-[#faf9f8] border-[#edebe9]'}`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="w-4 h-4 text-[#0078d4]" />
                                                <h4 className={`text-[14px] font-bold ${isDarkMode ? 'text-white' : 'text-[#201f1e]'}`}>Resource Guidance</h4>
                                            </div>
                                            <a href={resource.learnUrl} target="_blank" rel="noopener noreferrer" className="text-[13px] flex items-center gap-1.5 text-[#0078d4] hover:underline">View Docs</a>
                                        </div>
                                        <p className={`text-[13px] mb-4 ${isDarkMode ? 'text-[#ffffff]' : 'text-[#201f1e]'}`}>{resource.desc}</p>
                                        <div className={`p-3 rounded-sm border-l-4 ${isDarkMode ? 'bg-[#323130] border-[#4cb0f9]' : 'bg-white border-[#0078d4]'}`}>
                                            <div className="flex gap-3">
                                                <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#0078d4]" />
                                                <p className={`text-[13px] ${isDarkMode ? 'text-[#f3f2f1]' : 'text-[#201f1e]'}`}>{resource.bestPractice}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
