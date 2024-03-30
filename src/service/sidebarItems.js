import { formatMessage } from "./localization";

export const SidebarItems = [
    {
        items: [{ label: 'Home', icon: 'pi pi-fw pi-home', to: '/' },
        {
            label: formatMessage('gblPortfolio'),
            icon: 'pi pi-fw pi-user',
            items: [
                {
                    label: formatMessage("gblCurriculum"),
                    icon: 'pi pi-fw pi-users',
                    to: '/pages/cv'
                },
                {
                    label: formatMessage("gblArcade"),
                    icon: 'pi pi-fw pi-users',
                    to: '/pages/arcade'
                },
            ]
        },]
    },
];