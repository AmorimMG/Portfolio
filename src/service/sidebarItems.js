import { formatMessage } from './localization';

export const SidebarItems = [
    {
        items: [
            { label: 'Home', icon: 'pi pi-fw pi-home', to: '/' },
            {
                label: formatMessage('gblCadastros'),
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: formatMessage('gblUsuario'),
                        icon: 'pi pi-fw pi-users',
                        to: '/cadastros/usuario'
                    },
                    {
                        label: formatMessage('gblLinguagem'),
                        icon: 'pi pi-fw pi-pen',
                        to: '/cadastros/linguagem'
                    },
                ]
            }
        ]
    }
];
