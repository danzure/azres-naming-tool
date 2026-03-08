/**
 * Generates a compliant Azure resource name based on configuration and resource-specific rules.
 *
 * @param {Object} resource - The resource definition object from constants.js
 * @param {Object} config - Naming configuration
 * @param {string} config.workload - Workload name
 * @param {string} config.orgPrefix - Organisation prefix
 * @param {string} config.regionAbbrev - Region abbreviation (e.g., 'uks')
 * @param {string} config.instance - Instance number (padded to 3 digits)
 * @param {string} config.envValue - Environment abbreviation (e.g., 'prod')
 * @param {string[]} config.namingOrder - Array defining segment order
 * @param {boolean} config.showOrg - Whether to include org prefix
 * @param {string} [selectedSubResource=null] - Optional suffix for sub-resources
 * @returns {string} The generated resource name
 */
export function generateName(resource, config, selectedSubResource = null) {
    const { workload, orgPrefix, regionAbbrev, instance, envValue, namingOrder, showOrg } = config;

    let resAbbrev = resource.abbrev || "res";

    // If resource has subResources and one is selected, append the suffix
    if (resource.subResources && selectedSubResource) {
        resAbbrev = `${resAbbrev}-${selectedSubResource}`;
    }

    // Special handling for Azure Firewall and Bastion subnets (must be exact names)
    if (resource.name === 'Subnet') {
        if (selectedSubResource === 'afw') return 'AzureFirewallSubnet';
        if (selectedSubResource === 'bas') return 'AzureBastionSubnet';
        if (selectedSubResource === 'gw') return 'GatewaySubnet';
        if (selectedSubResource === 'afwm') return 'AzureFirewallManagementSubnet';
        if (selectedSubResource === 'rs') return 'RouteServerSubnet';
    }

    const cleanWorkload = workload.toLowerCase().replace(/[^a-z0-9]/g, '') || 'workload';
    const cleanOrg = orgPrefix.toLowerCase().replace(/[^a-z0-9]/g, '');
    const regAbbrev = regionAbbrev || 'uks';
    const suffix = (instance || '001').padStart(3, '0');

    // Check if resource allows hyphens based on chars field
    const charsList = resource.chars ? resource.chars.split(',').map(c => c.trim()) : [];
    const allowsHyphens = charsList.includes('-');

    // Special handling for Windows VM (15 char limit)
    if (resAbbrev === 'vmw') {
        const maxWorkload = 15 - 3 - 1 - 3 - 3;
        return `${resAbbrev}${cleanWorkload.substring(0, maxWorkload)}${envValue.substring(0, 1)}${regAbbrev.substring(0, 3)}${suffix}`.toLowerCase();
    }

    // Build parts based on naming order
    let parts = [];
    namingOrder.forEach(part => {
        if (part === 'Org' && showOrg && cleanOrg) parts.push(cleanOrg);
        if (part === 'Resource') parts.push(resAbbrev);
        if (part === 'Workload') parts.push(cleanWorkload);
        if (part === 'Environment') parts.push(envValue);
        if (part === 'Region') {
            if (resource.name !== 'Subscription' && resource.name !== 'Management group') {
                parts.push(regAbbrev);
            }
        }
        if (part === 'Instance') parts.push(suffix);
    });

    const separator = allowsHyphens ? '-' : '';
    let result = parts.join(separator);

    return result.toLowerCase();
}
