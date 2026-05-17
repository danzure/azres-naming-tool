const fs = require('fs');

const policies = [
    { name: 'CA-AllUsers-AllApps-AnyPlatform-RequireMFA', settings: [ { label: 'Users', value: 'All users (Exclude emergency access accounts)' }, { label: 'Target resources', value: 'All cloud apps' }, { label: 'Conditions', value: 'Any device' }, { label: 'Grant', value: 'Require multifactor authentication' } ] },
    { name: 'CA-Admins-AllApps-AnyPlatform-RequireMFA', settings: [ { label: 'Users', value: 'Select directory roles (Global Administrator, Security Administrator, etc.) (Exclude emergency access accounts)' }, { label: 'Target resources', value: 'All cloud apps' }, { label: 'Grant', value: 'Require multifactor authentication' } ] },
    { name: 'CA-Admins-MsAdminPortals-AnyPlatform-RequireMFA', settings: [ { label: 'Users', value: 'Select directory roles (Global Administrator, Security Administrator, etc.) (Exclude emergency access accounts)' }, { label: 'Target resources', value: 'Microsoft Admin Portals' }, { label: 'Grant', value: 'Require multifactor authentication' } ] },
    { name: 'CA-AllUsers-AzurePortal-AnyPlatform-RequireMFA', settings: [ { label: 'Users', value: 'All users (Exclude emergency access accounts)' }, { label: 'Target resources', value: 'Microsoft Azure Management' }, { label: 'Grant', value: 'Require multifactor authentication' } ] },
    { name: 'CA-AllUsers-AllApps-AnyPlatform-BlockLegacyAuth', settings: [ { label: 'Users', value: 'All users' }, { label: 'Target resources', value: 'All cloud apps' }, { label: 'Conditions', value: 'Client apps: Exchange ActiveSync clients, Other clients' }, { label: 'Grant', value: 'Block access' } ] },
    { name: 'CA-AllUsers-SecurityInfo-AnyPlatform-RequireMFA', settings: [ { label: 'Users', value: 'All users' }, { label: 'Target resources', value: 'User actions: Register security information' }, { label: 'Grant', value: 'Require multifactor authentication' } ] },
    { name: 'CA-AllUsers-AllApps-AnyPlatform-RequireCompliant', settings: [ { label: 'Users', value: 'All users (Exclude emergency access accounts)' }, { label: 'Target resources', value: 'All cloud apps' }, { label: 'Grant', value: 'Require device to be marked as compliant' } ] },
    { name: 'CA-Guests-AllApps-AnyPlatform-RequireMFA', settings: [ { label: 'Users', value: 'All guest and external users' }, { label: 'Target resources', value: 'All cloud apps' }, { label: 'Grant', value: 'Require multifactor authentication' } ] },
    { name: 'CA-AllUsers-AllApps-AnyPlatform-RequireMfaForRisk', settings: [ { label: 'Users', value: 'All users (Exclude emergency access accounts)' }, { label: 'Target resources', value: 'All cloud apps' }, { label: 'Conditions', value: 'Sign-in risk: High, Medium' }, { label: 'Grant', value: 'Require multifactor authentication' } ] },
    { name: 'CA-AllUsers-AllApps-AnyPlatform-RequirePasswordChange', settings: [ { label: 'Users', value: 'All users (Exclude emergency access accounts)' }, { label: 'Target resources', value: 'All cloud apps' }, { label: 'Conditions', value: 'User risk: High' }, { label: 'Grant', value: 'Require password change, Require multifactor authentication' } ] },
    { name: 'CA-AllUsers-AllApps-UnknownPlatform-Block', settings: [ { label: 'Users', value: 'All users (Exclude emergency access accounts)' }, { label: 'Target resources', value: 'All cloud apps' }, { label: 'Conditions', value: 'Device platforms: Include Any device, Exclude Android, iOS, Windows, macOS, Linux' }, { label: 'Grant', value: 'Block access' } ] },
    { name: 'CA-AllUsers-AllApps-AnyPlatform-SessionControl', settings: [ { label: 'Users', value: 'All users' }, { label: 'Target resources', value: 'All cloud apps' }, { label: 'Session', value: 'Sign-in frequency: 1 hour OR Persistent browser session: Never persistent' } ] },
    { name: 'CA-AllUsers-AllApps-AnyPlatform-AppProtection', settings: [ { label: 'Users', value: 'All users' }, { label: 'Target resources', value: 'All cloud apps' }, { label: 'Conditions', value: 'Device platforms: Android, iOS' }, { label: 'Grant', value: 'Require approved client app OR Require app protection policy' } ] },
    { name: 'CA-AllUsers-AllApps-AnyPlatform-BlockInsiderRisk', settings: [ { label: 'Users', value: 'All users (Exclude emergency access accounts)' }, { label: 'Target resources', value: 'All cloud apps' }, { label: 'Conditions', value: 'Insider risk: High' }, { label: 'Grant', value: 'Block access' } ] },
    { name: 'CA-Admins-AzurePortal-AnyPlatform-RequirePhishResist', settings: [ { label: 'Users', value: 'Select directory roles (Global Administrator, Security Administrator, etc.)' }, { label: 'Target resources', value: 'Microsoft Azure Management' }, { label: 'Grant', value: 'Require authentication strength: Phishing-resistant MFA' } ] },
    { name: 'CA-Admins-AllApps-AnyPlatform-RequireCompliant', settings: [ { label: 'Users', value: 'Select directory roles (Global Administrator, Security Administrator, etc.)' }, { label: 'Target resources', value: 'All cloud apps' }, { label: 'Grant', value: 'Require device to be marked as compliant OR Require Hybrid Microsoft Entra joined device' } ] },
    { name: 'CA-AllUsers-AllApps-AnyPlatform-AppEnforced', settings: [ { label: 'Users', value: 'All users' }, { label: 'Target resources', value: 'Office 365, SharePoint Online, Exchange Online' }, { label: 'Session', value: 'Use app enforced restrictions' } ] },
    { name: 'CA-AIAgents-AllApps-AnyPlatform-BlockHighRisk', settings: [ { label: 'Workload identities', value: 'All owned service principals' }, { label: 'Target resources', value: 'All cloud apps' }, { label: 'Conditions', value: 'Service principal risk: High' }, { label: 'Grant', value: 'Block access' } ] }
];

let file = fs.readFileSync('src/data/conditionalAccessData.js', 'utf8');

policies.forEach(p => {
    const settingsStr = JSON.stringify(p.settings).replace(/"label"/g, 'label').replace(/"value"/g, 'value').replace(/},\{/g, '}, {');
    const regex = new RegExp(`({ name: '${p.name}', categories: \\[.*\\], desc: '.*', link: '.*') }`, 'g');
    file = file.replace(regex, `$1, settings: ${settingsStr} }`);
});

fs.writeFileSync('src/data/conditionalAccessData.js', file);
