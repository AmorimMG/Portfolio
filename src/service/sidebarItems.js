import { openModal } from '../components/DynamicModal.vue';

export const SidebarItems = [
    {
        items: [
            { label: 'Home', icon: 'pi pi-fw pi-home', to: '/' },
            {
                label: 'Cadastros',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'Usuario',
                        icon: 'pi pi-fw pi-users',
                        to: '/cadastros/usuarios'
                    },
                    {
                        label: 'Projetos',
                        icon: 'pi pi-fw pi-github',
                        to: '/cadastros/projetos'
                    },
                    {
                        label: 'Linguagens',
                        icon: 'pi pi-fw pi-code',
                        to: '/cadastros/linguagem'
                    }
                ]
            },
            {
                label: 'Serviços HomeLab',
                icon: 'pi pi-fw pi-server',
                items: [
                    {
                        label: 'Swagger',
                        icon: 'pi pi-fw pi-hammer',
                        command: () => openModal('https://api.amorim.pro/api/index.html')
                    },
                    {
                        label: 'CasaOS',
                        icon: 'pi pi-fw pi-crown',
                        command: () => openModal('https://casaos.amorim.pro')
                    },
                    {
                        label: 'Jenkins',
                        icon: 'pi pi-fw pi-wave-pulse',
                        command: () => openModal('https://jenkins.amorim.pro')
                    },
                    {
                        label: 'Dbeaver',
                        icon: 'pi pi-fw pi-database',
                        command: () => openModal('https://dbeaver.amorim.pro')
                    },
                    {
                        label: 'Linux',
                        icon: 'pi pi-fw pi-desktop',
                        command: () => openModal('https://linux.amorim.pro')
                    }
                ]
            }
        ]
    }
];
