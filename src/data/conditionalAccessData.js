export const PREMADE_POLICIES = [
    { 
        name: 'CA-AllUsers-AllApps-AnyPlatform-RequireMFA', 
        categories: ['Secure foundation', 'Zero Trust', 'Remote work'], 
        desc: 'Establishes a foundational zero-trust security posture by mandating Multi-factor Authentication (MFA) for all users across all cloud applications. This policy acts as the critical baseline defense against identity-based attacks like credential theft, phishing, and password spraying. Implementing this policy significantly reduces the risk of account compromise and is considered a mandatory requirement for any modern security architecture.', 
        link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-all-users-mfa-strength',
        settings: [
            { label: "Users", value: "Include: All users.\nExclude: Break-glass / emergency access accounts." },
            { label: "Target resources", value: "Include: All cloud apps." },
            { label: "Conditions", value: "Client apps: Browser, Mobile apps and desktop clients." },
            { label: "Grant", value: "Grant access -> Require multifactor authentication." }
        ]
    },
    { 
        name: 'CA-Admins-AllApps-AnyPlatform-RequireMFA', 
        categories: ['Secure foundation', 'Zero Trust', 'Protect administrator'], 
        desc: 'Enforces strict Multi-factor Authentication for all privileged administrative roles (e.g., Global Administrator, Security Administrator) across all applications. Because administrative accounts hold the \'keys to the kingdom\', they are high-value targets for threat actors. This policy ensures that even if an administrator\'s credentials are compromised, unauthorized access to your tenant\'s infrastructure is prevented.', 
        link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-old-require-mfa-admin',
        settings: [
            { label: "Users", value: "Include: Select directory roles (Global Admin, Security Admin, Privileged Role Admin, etc.).\nExclude: Break-glass / emergency access accounts." },
            { label: "Target resources", value: "Include: All cloud apps." },
            { label: "Conditions", value: "Client apps: Browser, Mobile apps and desktop clients." },
            { label: "Grant", value: "Grant access -> Require multifactor authentication." }
        ]
    },
    { 
        name: 'CA-Admins-MsAdminPortals-AnyPlatform-RequireMFA', 
        categories: ['Secure foundation', 'Zero Trust', 'Protect administrator'], 
        desc: 'Requires Multi-factor Authentication whenever highly privileged users attempt to access Microsoft management portals (such as the Entra admin center, Azure portal, or Microsoft 365 admin center). This creates an isolated and secure control plane, specifically protecting the administrative interfaces where tenant-wide changes can be made.', 
        link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-old-require-mfa-admin-portals',
        settings: [
            { label: "Users", value: "Include: Select directory roles (Global Admin, Security Admin, Privileged Role Admin, etc.).\nExclude: Break-glass / emergency access accounts." },
            { label: "Target resources", value: "Include: Microsoft Admin Portals." },
            { label: "Conditions", value: "Client apps: Browser, Mobile apps and desktop clients." },
            { label: "Grant", value: "Grant access -> Require multifactor authentication." }
        ]
    },
    { 
        name: 'CA-AllUsers-AzurePortal-AnyPlatform-RequireMFA', 
        categories: ['Secure foundation', 'Zero Trust', 'Protect administrator'], 
        desc: 'Secures Azure infrastructure by mandating Multi-factor Authentication for any user attempting to access Azure management endpoints, such as the Azure Portal or Azure Resource Manager APIs. This is crucial for preventing unauthorized resource modification, deployment of malicious infrastructure, or access to sensitive data stored in Azure services.', 
        link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-old-require-mfa-azure-mgmt',
        settings: [
            { label: "Users", value: "Include: All users.\nExclude: Break-glass / emergency access accounts." },
            { label: "Target resources", value: "Include: Microsoft Azure Management." },
            { label: "Conditions", value: "Client apps: Browser, Mobile apps and desktop clients." },
            { label: "Grant", value: "Grant access -> Require multifactor authentication." }
        ]
    },
    { 
        name: 'CA-AllUsers-AllApps-AnyPlatform-BlockLegacyAuth', 
        categories: ['Secure foundation', 'Zero Trust', 'Remote work', 'Emerging threats'], 
        desc: 'Proactively blocks legacy authentication protocols (such as POP3, IMAP, SMTP, and older Office clients) that cannot natively enforce Multi-factor Authentication. Legacy protocols are heavily exploited by automated credential stuffing and password spray attacks. Blocking them significantly reduces your attack surface and forces users onto modern, secure authentication flows.', 
        link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-block-legacy-authentication',
        settings: [
            { label: "Users", value: "Include: All users." },
            { label: "Target resources", value: "Include: All cloud apps." },
            { label: "Conditions", value: "Client apps: Exchange ActiveSync clients, Other clients." },
            { label: "Grant", value: "Block access." }
        ]
    },
    { 
        name: 'CA-AllUsers-SecurityInfo-AnyPlatform-RequireMFA', 
        categories: ['Secure foundation', 'Zero Trust', 'Remote work'], 
        desc: 'Secures the credential enrollment process by requiring users to successfully perform Multi-factor Authentication before registering or modifying their security info (MFA methods or SSPR details). This prevents attackers who have compromised a password from independently registering their own MFA device and locking the legitimate user out of their account.', 
        link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-all-users-security-info-registration',
        settings: [
            { label: "Users", value: "Include: All users." },
            { label: "Target resources", value: "User actions: Register security information." },
            { label: "Grant", value: "Grant access -> Require multifactor authentication." }
        ]
    },
    { 
        name: 'CA-AllUsers-AllApps-AnyPlatform-RequireCompliant', 
        categories: ['Secure foundation', 'Zero Trust', 'Remote work'], 
        desc: 'Enforces device-level security trust by requiring endpoints to be either marked as compliant by Microsoft Intune or Hybrid Entra joined before accessing organizational data. This ensures that users can only access company resources from devices that meet your minimum security baselines (e.g., active antivirus, device encryption, latest OS patches).', 
        link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-all-users-device-compliance',
        settings: [
            { label: "Users", value: "Include: All users.\nExclude: Break-glass / emergency access accounts." },
            { label: "Target resources", value: "Include: All cloud apps." },
            { label: "Conditions", value: "Device platforms: Include any device.\nClient apps: Browser, Mobile apps and desktop clients." },
            { label: "Grant", value: "Grant access -> Require device to be marked as compliant." }
        ]
    },
    { 
        name: 'CA-Guests-AllApps-AnyPlatform-RequireMFA', 
        categories: ['Zero Trust', 'Remote work'], 
        desc: 'Secures B2B collaboration by ensuring that all external partners, vendors, and guest users must perform Multi-factor Authentication before accessing your tenant\'s resources. External identities are often outside your direct control, making this policy a critical layer of defense against compromised partner accounts infiltrating your environment.', 
        link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-old-require-mfa-guest',
        settings: [
            { label: "Users", value: "Include: All guest and external users." },
            { label: "Target resources", value: "Include: All cloud apps." },
            { label: "Conditions", value: "Client apps: Browser, Mobile apps and desktop clients." },
            { label: "Grant", value: "Grant access -> Require multifactor authentication." }
        ]
    },
    { 
        name: 'CA-AllUsers-AllApps-AnyPlatform-RequireMfaForRisk', 
        categories: ['Zero Trust', 'Remote work', 'Emerging threats'], 
        desc: 'Leverages the machine-learning capabilities of Microsoft Entra ID Protection to dynamically require Multi-factor Authentication when a medium or high sign-in risk is detected. This adaptive control provides real-time defense against anomalous login attempts, such as sign-ins from unfamiliar locations, anonymous IP addresses, or atypical travel, minimizing friction for normal logins.', 
        link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-risk-based-sign-in',
        settings: [
            { label: "Users", value: "Include: All users.\nExclude: Break-glass / emergency access accounts." },
            { label: "Target resources", value: "Include: All cloud apps." },
            { label: "Conditions", value: "Sign-in risk: High, Medium." },
            { label: "Grant", value: "Grant access -> Require multifactor authentication." }
        ]
    },
    { 
        name: 'CA-AllUsers-AllApps-AnyPlatform-RequirePasswordChange', 
        categories: ['Zero Trust', 'Remote work', 'Emerging threats'], 
        desc: 'Mitigates full account takeover by forcing an immediate, secure password change when Microsoft Entra ID Protection flags a user\'s overall identity risk as high. A high user risk indicates that the user\'s credentials have likely been compromised (e.g., found leaked on the dark web). This policy forces remediation before granting access.', 
        link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-risk-based-user',
        settings: [
            { label: "Users", value: "Include: All users.\nExclude: Break-glass / emergency access accounts." },
            { label: "Target resources", value: "Include: All cloud apps." },
            { label: "Conditions", value: "User risk: High." },
            { label: "Grant", value: "Grant access -> Require password change AND Require multifactor authentication." }
        ]
    },
    { 
        name: 'CA-AllUsers-AllApps-UnknownPlatform-Block', 
        categories: ['Zero Trust', 'Remote work', 'Emerging threats'], 
        desc: 'Prevents unauthorized data access by explicitly blocking sign-ins from device operating systems that are not officially supported, recognized, or managed by your organization\'s IT department. This mitigates the risk of access from insecure or rooted mobile devices, unsupported Linux distributions, or obscured platforms.', 
        link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-all-users-device-unknown-unsupported',
        settings: [
            { label: "Users", value: "Include: All users.\nExclude: Break-glass / emergency access accounts." },
            { label: "Target resources", value: "Include: All cloud apps." },
            { label: "Conditions", value: "Device platforms: Include any device. Exclude Android, iOS, Windows, macOS, Linux." },
            { label: "Grant", value: "Block access." }
        ]
    },
    { 
        name: 'CA-AllUsers-AllApps-AnyPlatform-SessionControl', 
        categories: ['Zero Trust', 'Remote work'], 
        desc: 'Enhances session security and data protection by preventing users from remaining persistently signed in. By enforcing non-persistent browser sessions or aggressive sign-in frequencies, users must re-authenticate after closing their browser. This is essential for protecting data when users access resources from shared, public, or unmanaged devices.', 
        link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-all-users-persistent-browser',
        settings: [
            { label: "Users", value: "Include: All users." },
            { label: "Target resources", value: "Include: All cloud apps." },
            { label: "Conditions", value: "Client apps: Browser." },
            { label: "Session", value: "Sign-in frequency: Periodic (e.g., 1 hour)\nOR Persistent browser session: Never persistent." }
        ]
    },
    { 
        name: 'CA-AllUsers-AllApps-AnyPlatform-AppProtection', 
        categories: ['Zero Trust', 'Remote work'], 
        desc: 'Safeguards corporate data on mobile devices by requiring users to access services via officially approved client apps or apps safeguarded by Intune App Protection Policies (MAM). This prevents data leakage by ensuring corporate data cannot be copied, pasted, or saved to unmanaged personal applications on BYOD devices.', 
        link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-all-users-device-compliance',
        settings: [
            { label: "Users", value: "Include: All users." },
            { label: "Target resources", value: "Include: All cloud apps." },
            { label: "Conditions", value: "Device platforms: Include Android, iOS." },
            { label: "Grant", value: "Grant access -> Require approved client app OR Require app protection policy." }
        ]
    },
    { 
        name: 'CA-AllUsers-AllApps-AnyPlatform-BlockInsiderRisk', 
        categories: ['Zero Trust', 'Emerging threats'], 
        desc: 'Integrates natively with Microsoft Purview Insider Risk Management to automatically block access for users flagged with a high insider risk severity. This provides immediate, automated containment to prevent potential data exfiltration, malicious sabotage, or intellectual property theft by internal threat actors.', 
        link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-risk-based-insider-block',
        settings: [
            { label: "Users", value: "Include: All users.\nExclude: Break-glass / emergency access accounts." },
            { label: "Target resources", value: "Include: All cloud apps." },
            { label: "Conditions", value: "Insider risk: High." },
            { label: "Grant", value: "Block access." }
        ]
    },
    { 
        name: 'CA-Admins-AzurePortal-AnyPlatform-RequirePhishResist', 
        categories: ['Protect administrator', 'Zero Trust'], 
        desc: 'Mandates the highest level of authentication strength (such as FIDO2 security keys, Passkeys, or Windows Hello for Business) for administrative access. Standard MFA can be bypassed using adversary-in-the-middle (AiTM) proxy attacks. This policy provides robust, hardware-backed protection against advanced phishing campaigns targeting privileged accounts.', 
        link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-admin-phish-resistant-mfa',
        settings: [
            { label: "Users", value: "Include: Select directory roles (Global Admin, Security Admin, Privileged Role Admin, etc.).\nExclude: Break-glass / emergency access accounts." },
            { label: "Target resources", value: "Include: Microsoft Azure Management." },
            { label: "Grant", value: "Grant access -> Require authentication strength: Phishing-resistant MFA." }
        ]
    },
    { 
        name: 'CA-Admins-AllApps-AnyPlatform-RequireCompliant', 
        categories: ['Protect administrator', 'Remote work'], 
        desc: 'Enforces strict endpoint requirements for highly privileged users, ensuring administrators can only access corporate applications and management portals from devices that are actively managed, compliant with stringent Intune policies, or Hybrid Entra joined. This prevents admins from managing the environment from insecure personal devices.', 
        link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-alt-admin-device-compliand-hybrid',
        settings: [
            { label: "Users", value: "Include: Select directory roles (Global Admin, Security Admin, Privileged Role Admin, etc.).\nExclude: Break-glass / emergency access accounts." },
            { label: "Target resources", value: "Include: All cloud apps." },
            { label: "Grant", value: "Grant access -> Require device to be marked as compliant OR Require Hybrid Microsoft Entra joined device." }
        ]
    },
    { 
        name: 'CA-AllUsers-AllApps-AnyPlatform-AppEnforced', 
        categories: ['Remote work'], 
        desc: 'Enables limited, web-only access to services like SharePoint or Exchange Online when accessed from unmanaged devices. By passing device state to the application, it uses application-enforced restrictions to prevent users from downloading, printing, or syncing sensitive data locally, allowing secure productivity from anywhere.', 
        link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-all-users-app-enforced-restrictions',
        settings: [
            { label: "Users", value: "Include: All users." },
            { label: "Target resources", value: "Include: Office 365, SharePoint Online, Exchange Online." },
            { label: "Session", value: "Use app enforced restrictions." }
        ]
    },
    { 
        name: 'CA-AIAgents-AllApps-AnyPlatform-BlockHighRiskAgentIdentities', 
        categories: ['AI Agents', 'Emerging threats'], 
        desc: 'Secures non-human identities by automatically blocking access for workload identities, service principals, and AI agents that exhibit anomalous or high-risk behavior. As automation increases, service accounts become prime targets. This policy ensures compromised automated accounts are immediately disabled before they can be exploited.', 
        link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-agent-block-high-risk',
        settings: [
            { label: "Workload identities", value: "Include: All owned service principals." },
            { label: "Target resources", value: "Include: All cloud apps." },
            { label: "Conditions", value: "Service principal risk: High." },
            { label: "Grant", value: "Block access." }
        ]
    }
];

export const CA_CATEGORIES = [
    'All',
    'AI Agents',
    'Emerging threats',
    'Protect administrator',
    'Remote work',
    'Secure foundation',
    'Zero Trust'
];

export const TITLE_OVERRIDES = {
    'RequireMFA': 'Require Multi-factor Authentication',
    'RequirePhishResist': 'Require Phishing-Resistant Multi-factor Authentication',
    'RequireMfaForRisk': 'Require Multi-factor Authentication for Risk',
    'RequireCompliant': 'Require Compliant Device',
    'RequirePasswordChange': 'Require Password Change',
    'AppProtection': 'Require App Protection',
    'AppEnforced': 'App Enforced Restrictions',
    'Block': 'Block Unknown Platforms',
    'BlockHighRiskAgentIdentities': 'Block high-risk agent identities',
    'BlockInsiderRisk': 'Block Insider Risk',
    'BlockLegacyAuth': 'Block Legacy Authentication',
    'SessionControl': 'Session Control'
};

export const getReadableTitle = (requirement) => {
    if (TITLE_OVERRIDES[requirement]) return TITLE_OVERRIDES[requirement];
    return requirement
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
        .trim();
};
