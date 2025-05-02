import { closeModal, openModal } from '../components/DynamicModal.vue';
import { removeUserCookie } from '../service/session';

export const SidebarItems = [
    {
        items: [
            {
                label: 'Dashboard',
                icon: 'pi pi-fw pi-table',
                to: '/cadastros/dashboard',
                command: () => closeModal()
            },
            {
                label: 'Home',
                icon: 'pi pi-fw pi-home',
                to: '/',
                command: () => removeUserCookie()
            },
            {
                label: 'Cadastros',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'Usuario',
                        icon: 'pi pi-fw pi-users',
                        to: '/cadastros/usuarios',
                        command: () => closeModal()
                    },
                    {
                        label: 'Projetos',
                        icon: 'pi pi-fw pi-github',
                        to: '/cadastros/projetos',
                        command: () => closeModal()
                    },
                    {
                        label: 'Linguagens',
                        icon: 'pi pi-fw pi-code',
                        to: '/cadastros/linguagem',
                        command: () => closeModal()
                    }
                ]
            },
            {
                label: 'Consultas',
                icon: 'pi pi-fw pi-search',
                items: [
                    {
                        label: 'Consultas SQL',
                        icon: 'pi pi-fw pi-users',
                        to: '/consultas/consultaSQL',
                        command: () => closeModal()
                    }
                ]
            },
            {
                label: 'Serviços HomeLab',
                icon: 'pi pi-fw pi-server',
                items: [
                    {
                        label: 'Swagger',
                        icon: 'pi pi-fw pi-server',
                        command: () => openModal('https://api.amorim.pro/')
                    },
                    {
                        label: 'CasaOS',
                        icon: 'pi pi-fw pi-server',
                        command: () => openModal('https://casaos.amorim.pro')
                    },
                    {
                        label: 'Home',
                        icon: 'pi pi-fw pi-server',
                        command: () => openModal('https://home.amorim.pro')
                    },
                    {
                        label: 'Stremio',
                        icon: 'pi pi-fw pi-server',
                        command: () => openModal('https://stremio.amorim.pro')
                    },
                    {
                        label: 'UpSnap',
                        icon: 'pi pi-fw pi-server',
                        command: () => openModal('https://ligar.amorim.pro')
                    },
                    {
                        label: 'Tachiyomi',
                        icon: 'pi pi-fw pi-server',
                        command: () => openModal('https://tachiyomi.amorim.pro')
                    }
                ]
            },
            {
                label: 'Serviços Flamorz',
                icon: 'pi pi-fw pi-server',
                items: [
                    {
                        label: 'CasaOS',
                        icon: 'pi pi-fw pi-server',
                        command: () => openModal('https://casaos.flamorz.com')
                    },
                    {
                        label: 'Jenkins',
                        icon: 'pi pi-fw pi-server',
                        command: () => openModal('https://jenkins.flamorz.com')
                    },
                    {
                        label: 'Dbeaver',
                        icon: 'pi pi-fw pi-database',
                        command: () => openModal('https://dbeaver.flamorz.com')
                    },
                    {
                        label: 'Git',
                        icon: 'pi pi-fw pi-database',
                        command: () => openModal('https://git.flamorz.com')
                    },
                    {
                        label: 'IA',
                        icon: 'pi pi-fw pi-database',
                        command: () => openModal('https://chat.flamorz.com')
                    },
                    {
                        label: 'Coolify',
                        icon: 'pi pi-fw pi-database',
                        command: () => openModal('https://coolify.flamorz.com')
                    },
                    {
                        label: 'Wiki',
                        icon: 'pi pi-fw pi-database',
                        command: () => openModal('https://wiki.flamorz.com')
                    },
                    {
                        label: 'Wordpress',
                        icon: 'pi pi-fw pi-database',
                        command: () => openModal('https://wordpress.flamorz.com')
                    }
                ]
            },
            {
                label: 'Flamorz Sites',
                icon: 'pi pi-fw pi-server',
                items: [
                    {
                        label: 'Flamorz.com',
                        icon: 'pi pi-fw pi-server',
                        command: () => openModal('https://flamorz.com')
                    },
                    {
                        label: 'NFT',
                        icon: 'pi pi-fw pi-server',
                        command: () => openModal('https://nft.flamorz.com')
                    }
                ]
            },
            {
                label: 'Ligar',
                icon: 'pi pi-power-off',
                command: () => alert('pc ligado')
            }
        ]
    }
];
