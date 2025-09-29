/**
 * FileSystem Store - Store centralizada para gerenciar o sistema de arquivos
 * Conecta área de trabalho, file manager e terminal em tempo real
 */
import { defineStore } from 'pinia';
import { computed, reactive, ref, watch } from 'vue';
import { useAppsStore } from './useAppsStore';
import { useTrashStore } from './useTrashStore';

export const useFileSystemStore = defineStore('fileSystem', () => {
    // Estados reativos
    const currentPath = ref('/home/amorim');
    const history = ref([]);
    const selectedItems = ref([]);
    const clipBoard = ref({ items: [], operation: null }); // cut/copy
    const searchResults = ref([]);
    const isLoading = ref(false);
    
    // Estrutura do sistema de arquivos reativo
    const fileSystem = reactive(createInitialFileSystem());
    
    // Stores relacionadas
    const appsStore = useAppsStore();
    const trashStore = useTrashStore();
    
    /**
     * Cria a estrutura inicial do sistema de arquivos
     */
    function createInitialFileSystem() {
        return {
            '/': {
                type: 'dir',
                permissions: 'drwxr-xr-x',
                owner: 'root',
                group: 'root',
                size: 4096,
                modified: new Date(),
                contents: {
                    'home': {
                        type: 'dir',
                        permissions: 'drwxr-xr-x',
                        owner: 'root',
                        group: 'root',
                        size: 4096,
                        modified: new Date(),
                        contents: {
                            'amorim': {
                                type: 'dir',
                                permissions: 'drwxr-xr-x',
                                owner: 'amorim',
                                group: 'amorim',
                                size: 4096,
                                modified: new Date(),
                                contents: {
                                    'Desktop': {
                                        type: 'dir',
                                        permissions: 'drwxr-xr-x',
                                        owner: 'amorim',
                                        group: 'amorim',
                                        size: 4096,
                                        modified: new Date(),
                                        contents: {
                                            'README.txt': {
                                                type: 'file',
                                                permissions: '-rw-r--r--',
                                                owner: 'amorim',
                                                group: 'amorim',
                                                size: 245,
                                                modified: new Date(),
                                                content: 'Bem-vindo ao Desktop!\n\nEste é um arquivo de exemplo que demonstra a sincronização entre o Desktop e o FileManager.\n\nVocê pode:\n- Criar novos arquivos e pastas\n- Renomear itens\n- Excluir itens\n- Navegar entre pastas\n\nTudo sincronizado em tempo real!'
                                            },
                                            'Projetos': {
                                                type: 'dir',
                                                permissions: 'drwxr-xr-x',
                                                owner: 'amorim',
                                                group: 'amorim',
                                                size: 4096,
                                                modified: new Date(),
                                                contents: {
                                                    'portfolio.json': {
                                                        type: 'file',
                                                        permissions: '-rw-r--r--',
                                                        owner: 'amorim',
                                                        group: 'amorim',
                                                        size: 156,
                                                        modified: new Date(),
                                                        content: '{\n  "name": "Portfolio Vue.js",\n  "version": "1.0.0",\n  "description": "Meu portfólio pessoal",\n  "technologies": ["Vue.js", "JavaScript", "CSS"]\n}'
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    'Documents': {
                                        type: 'dir',
                                        permissions: 'drwxr-xr-x',
                                        owner: 'amorim',
                                        group: 'amorim',
                                        size: 4096,
                                        modified: new Date(),
                                        contents: {
                                            'Projects': {
                                                type: 'dir',
                                                permissions: 'drwxr-xr-x',
                                                owner: 'amorim',
                                                group: 'amorim',
                                                size: 4096,
                                                modified: new Date(),
                                                contents: {
                                                    'Portfolio': {
                                                        type: 'dir',
                                                        permissions: 'drwxr-xr-x',
                                                        owner: 'amorim',
                                                        group: 'amorim',
                                                        size: 4096,
                                                        modified: new Date(),
                                                        contents: {
                                                            'README.md': {
                                                                type: 'file',
                                                                permissions: '-rw-r--r--',
                                                                owner: 'amorim',
                                                                group: 'amorim',
                                                                size: 1024,
                                                                modified: new Date(),
                                                                content: '# Portfolio\n\nMeu portfólio pessoal criado com Vue.js'
                                                            },
                                                            'package.json': {
                                                                type: 'file',
                                                                permissions: '-rw-r--r--',
                                                                owner: 'amorim',
                                                                group: 'amorim',
                                                                size: 2048,
                                                                modified: new Date(),
                                                                content: '{\n  "name": "portfolio",\n  "version": "1.0.0"\n}'
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            'resume.pdf': {
                                                type: 'file',
                                                permissions: '-rw-r--r--',
                                                owner: 'amorim',
                                                group: 'amorim',
                                                size: 1048576,
                                                modified: new Date(),
                                                content: 'PDF content...'
                                            }
                                        }
                                    },
                                    'Downloads': {
                                        type: 'dir',
                                        permissions: 'drwxr-xr-x',
                                        owner: 'amorim',
                                        group: 'amorim',
                                        size: 4096,
                                        modified: new Date(),
                                        contents: {}
                                    },
                                    'Pictures': {
                                        type: 'dir',
                                        permissions: 'drwxr-xr-x',
                                        owner: 'amorim',
                                        group: 'amorim',
                                        size: 4096,
                                        modified: new Date(),
                                        contents: {}
                                    },
                                    'Music': {
                                        type: 'dir',
                                        permissions: 'drwxr-xr-x',
                                        owner: 'amorim',
                                        group: 'amorim',
                                        size: 4096,
                                        modified: new Date(),
                                        contents: {}
                                    },
                                    'Videos': {
                                        type: 'dir',
                                        permissions: 'drwxr-xr-x',
                                        owner: 'amorim',
                                        group: 'amorim',
                                        size: 4096,
                                        modified: new Date(),
                                        contents: {}
                                    }
                                }
                            }
                        }
                    },
                    'usr': {
                        type: 'dir',
                        permissions: 'drwxr-xr-x',
                        owner: 'root',
                        group: 'root',
                        size: 4096,
                        modified: new Date(),
                        contents: {
                            'bin': {
                                type: 'dir',
                                permissions: 'drwxr-xr-x',
                                owner: 'root',
                                group: 'root',
                                size: 4096,
                                modified: new Date(),
                                contents: {}
                            }
                        }
                    },
                    'etc': {
                        type: 'dir',
                        permissions: 'drwxr-xr-x',
                        owner: 'root',
                        group: 'root',
                        size: 4096,
                        modified: new Date(),
                        contents: {}
                    },
                    'var': {
                        type: 'dir',
                        permissions: 'drwxr-xr-x',
                        owner: 'root',
                        group: 'root',
                        size: 4096,
                        modified: new Date(),
                        contents: {}
                    }
                }
            }
        };
    }

    /**
     * Computeds
     */
    const currentDirectory = computed(() => {
        return getItemAtPath(currentPath.value);
    });

    const currentDirectoryContents = computed(() => {
        const dir = currentDirectory.value;
        if (!dir || dir.type !== 'dir') return [];
        
        return Object.entries(dir.contents || {}).map(([name, item]) => ({
            name,
            ...item,
            path: joinPath(currentPath.value, name)
        }));
    });

    const desktopItems = computed(() => {
        const desktop = getItemAtPath('/home/amorim/Desktop');
        if (!desktop || desktop.type !== 'dir') return [];
        
        return Object.entries(desktop.contents || {}).map(([name, item]) => ({
            name,
            ...item,
            path: joinPath('/home/amorim/Desktop', name)
        }));
    });

    /**
     * Utilitários
     */
    function joinPath(...parts) {
        return parts
            .join('/')
            .replace(/\/+/g, '/')
            .replace(/\/$/, '') || '/';
    }

    function normalizePath(path) {
        if (!path.startsWith('/')) {
            path = joinPath(currentPath.value, path);
        }
        
        const parts = path.split('/').filter(part => part);
        const normalizedParts = [];
        
        for (const part of parts) {
            if (part === '..') {
                normalizedParts.pop();
            } else if (part !== '.') {
                normalizedParts.push(part);
            }
        }
        
        return '/' + normalizedParts.join('/');
    }

    function getItemAtPath(path) {
        path = normalizePath(path);
        const parts = path.split('/').filter(part => part);
        
        let current = fileSystem['/'];
        
        for (const part of parts) {
            if (current?.type !== 'dir' || !current.contents?.[part]) {
                return null;
            }
            current = current.contents[part];
        }
        
        return current;
    }

    function getParentPath(path) {
        const parts = path.split('/').filter(part => part);
        parts.pop();
        return '/' + parts.join('/') || '/';
    }

    /**
     * Operações de navegação
     */
    function changeDirectory(path) {
        if (!path || path === '.') return { success: true };
        
        if (path === '..') {
            path = getParentPath(currentPath.value);
        } else if (path === '~') {
            path = '/home/amorim';
        } else if (!path.startsWith('/')) {
            path = joinPath(currentPath.value, path);
        }
        
        path = normalizePath(path);
        const item = getItemAtPath(path);
        
        if (!item) {
            return { success: false, error: `cd: ${path}: No such file or directory` };
        }
        
        if (item.type !== 'dir') {
            return { success: false, error: `cd: ${path}: Not a directory` };
        }
        
        history.value.push(currentPath.value);
        currentPath.value = path;
        
        return { success: true, path };
    }

    function goBack() {
        if (history.value.length > 0) {
            currentPath.value = history.value.pop();
        }
    }

    /**
     * Operações de listagem
     */
    function listDirectory(path = null, options = {}) {
        const targetPath = path ? normalizePath(path) : currentPath.value;
        const item = getItemAtPath(targetPath);
        
        if (!item) {
            return { success: false, error: `ls: cannot access '${path}': No such file or directory` };
        }
        
        if (item.type !== 'dir') {
            return {
                success: true,
                entries: [{ name: path.split('/').pop(), ...item }],
                path: targetPath
            };
        }
        
        let entries = Object.entries(item.contents || {}).map(([name, fileItem]) => ({
            name,
            ...fileItem
        }));
        
        if (!options.all) {
            entries = entries.filter(entry => !entry.name.startsWith('.'));
        }
        
        if (options.all && targetPath !== '/') {
            entries.unshift(
                { name: '.', type: 'dir', ...item },
                { name: '..', type: 'dir', ...getItemAtPath(getParentPath(targetPath)) }
            );
        }
        
        return { success: true, entries, path: targetPath };
    }

    /**
     * Operações de criação
     */
    function createFile(name, content = '', path = null) {
        const targetPath = path || currentPath.value;
        const parentItem = getItemAtPath(targetPath);
        
        if (!parentItem || parentItem.type !== 'dir') {
            return { success: false, error: `Cannot create file in ${targetPath}` };
        }
        
        if (parentItem.contents[name]) {
            return { success: false, error: `${name}: File exists` };
        }
        
        parentItem.contents[name] = {
            type: 'file',
            permissions: '-rw-r--r--',
            owner: 'amorim',
            group: 'amorim',
            size: content.length,
            modified: new Date(),
            content
        };
        
        // Emitir evento para atualizar componentes
        emitFileSystemChange('create', 'file', joinPath(targetPath, name));
        
        return { success: true, path: joinPath(targetPath, name) };
    }

    function createDirectory(name, path = null) {
        const targetPath = path || currentPath.value;
        const parentItem = getItemAtPath(targetPath);
        
        if (!parentItem || parentItem.type !== 'dir') {
            return { success: false, error: `Cannot create directory in ${targetPath}` };
        }
        
        if (parentItem.contents[name]) {
            return { success: false, error: `${name}: Directory exists` };
        }
        
        parentItem.contents[name] = {
            type: 'dir',
            permissions: 'drwxr-xr-x',
            owner: 'amorim',
            group: 'amorim',
            size: 4096,
            modified: new Date(),
            contents: {}
        };
        
        // Emitir evento para atualizar componentes
        emitFileSystemChange('create', 'dir', joinPath(targetPath, name));
        
        return { success: true, path: joinPath(targetPath, name) };
    }

    /**
     * Operações de remoção
     */
    function removeItem(name, path = null) {
        const targetPath = path || currentPath.value;
        const parentItem = getItemAtPath(targetPath);
        
        if (!parentItem || parentItem.type !== 'dir' || !parentItem.contents[name]) {
            return { success: false, error: `${name}: No such file or directory` };
        }
        
        const item = parentItem.contents[name];
        const fullPath = joinPath(targetPath, name);
        
        // Mover para lixeira se disponível
        if (trashStore) {
            trashStore.addToTrash({
                name,
                path: fullPath,
                type: item.type,
                originalPath: fullPath,
                deletedAt: new Date()
            });
        }
        
        delete parentItem.contents[name];
        
        // Emitir evento para atualizar componentes
        emitFileSystemChange('delete', item.type, fullPath);
        
        return { success: true };
    }

    /**
     * Operações de leitura/escrita
     */
    function readFile(path) {
        const item = getItemAtPath(path);
        
        if (!item) {
            return { success: false, error: `cat: ${path}: No such file or directory` };
        }
        
        if (item.type !== 'file') {
            return { success: false, error: `cat: ${path}: Is a directory` };
        }
        
        return { success: true, content: item.content || '' };
    }

    function writeFile(path, content) {
        const item = getItemAtPath(path);
        
        if (item && item.type !== 'file') {
            return { success: false, error: `Cannot write to ${path}: Is a directory` };
        }
        
        if (item) {
            item.content = content;
            item.size = content.length;
            item.modified = new Date();
        } else {
            const pathParts = path.split('/');
            const fileName = pathParts.pop();
            const parentPath = pathParts.join('/') || '/';
            
            return createFile(fileName, content, parentPath);
        }
        
        emitFileSystemChange('modify', 'file', path);
        
        return { success: true };
    }

    /**
     * Busca
     */
    function searchFiles(query, searchPath = null) {
        const results = [];
        const startPath = searchPath || currentPath.value;
        
        function searchRecursive(path, item) {
            if (item.type === 'dir') {
                Object.entries(item.contents || {}).forEach(([name, childItem]) => {
                    const childPath = joinPath(path, name);
                    
                    if (name.toLowerCase().includes(query.toLowerCase())) {
                        results.push({
                            name,
                            path: childPath,
                            type: childItem.type,
                            ...childItem
                        });
                    }
                    
                    if (childItem.type === 'dir') {
                        searchRecursive(childPath, childItem);
                    }
                });
            }
        }
        
        const startItem = getItemAtPath(startPath);
        if (startItem) {
            searchRecursive(startPath, startItem);
        }
        
        searchResults.value = results;
        return results;
    }

    /**
     * Integração com área de trabalho
     */
    function addToDesktop(item) {
        const desktop = getItemAtPath('/home/amorim/Desktop');
        if (!desktop || desktop.type !== 'dir') return { success: false };
        
        const name = item.name || 'New Item';
        let uniqueName = name;
        let counter = 1;
        
        while (desktop.contents[uniqueName]) {
            uniqueName = `${name} (${counter})`;
            counter++;
        }
        
        desktop.contents[uniqueName] = {
            type: item.type || 'file',
            permissions: item.permissions || '-rw-r--r--',
            owner: 'amorim',
            group: 'amorim',
            size: item.size || 0,
            modified: new Date(),
            content: item.content || '',
            ...(item.type === 'dir' && { contents: {} })
        };
        
        // Integrar com apps store se for aplicativo
        if (item.isApp && appsStore) {
            appsStore.addApp({
                title: uniqueName,
                icon: item.icon,
                component: item.component,
                type: 'desktop-file'
            });
        }
        
        emitFileSystemChange('create', item.type, `/home/amorim/Desktop/${uniqueName}`);
        
        return { success: true, name: uniqueName };
    }

    /**
     * Sistema de eventos para sincronização
     */
    const eventListeners = ref(new Set());
    
    function onFileSystemChange(callback) {
        eventListeners.value.add(callback);
        
        return () => {
            eventListeners.value.delete(callback);
        };
    }
    
    function emitFileSystemChange(operation, type, path) {
        const event = {
            operation, // 'create', 'delete', 'modify', 'move'
            type,      // 'file', 'dir'
            path,
            timestamp: new Date()
        };
        
        eventListeners.value.forEach(callback => {
            try {
                callback(event);
            } catch (error) {
                console.error('Error in file system event listener:', error);
            }
        });
    }

    /**
     * Watchers para sincronização
     */
    watch(() => desktopItems.value, (newItems) => {
        // Sincronizar com apps store quando desktop mudar
        if (appsStore) {
            // Atualizar apps baseados em arquivos do desktop
            const desktopApps = newItems.filter(item => 
                item.type === 'file' && 
                (item.name.endsWith('.app') || item.name.endsWith('.desktop'))
            );
            
            // Implementar sincronização conforme necessário
        }
    }, { deep: true });

    return {
        // Estado
        currentPath,
        history,
        selectedItems,
        clipBoard,
        searchResults,
        isLoading,
        fileSystem,
        
        // Computeds
        currentDirectory,
        currentDirectoryContents,
        desktopItems,
        
        // Navegação
        changeDirectory,
        goBack,
        
        // Listagem
        listDirectory,
        
        // Manipulação de arquivos/diretórios
        createFile,
        createDirectory,
        removeItem,
        readFile,
        writeFile,
        
        // Busca
        searchFiles,
        
        // Desktop
        addToDesktop,
        
        // Utilitários
        getItemAtPath,
        normalizePath,
        joinPath,
        
        // Eventos
        onFileSystemChange,
        emitFileSystemChange
    };
});
