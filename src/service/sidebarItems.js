import { formatMessage } from './localization';

export const SidebarItems = [
    {
        items: [
            { label: 'Home', icon: 'pi pi-fw pi-home', to: '/' },
            {
                label: formatMessage('gblPortfolio'),
                icon: 'pi pi-fw pi-user',
                items: []
            }
        ]
    }
];
