/**
 * FileSystemService - Simula um sistema de arquivos completo para o terminal
 * Oferece funcionalidades como navegação, listagem, criação e manipulação de arquivos/diretórios
 */
import { reactive, ref } from 'vue';

class FileSystemService {
    constructor() {
        this.currentPath = ref('/home/amorim');
        this.history = ref([]);
        this.fileSystem = reactive(this.createInitialFileSystem());
    }

    /**
     * Cria a estrutura inicial do sistema de arquivos
     */
    createInitialFileSystem() {
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
                                    'Documents': {
                                        type: 'dir',
                                        permissions: 'drwxr-xr-x',
                                        owner: 'amorim',
                                        group: 'amorim',
                                        size: 4096,
                                        modified: new Date(),
                                        contents: {
                                            'resume.md': {
                                                type: 'file',
                                                permissions: '-rw-r--r--',
                                                owner: 'amorim',
                                                group: 'amorim',
                                                size: 2048,
                                                modified: new Date(),
                                                content: `# Henrique Amorim - Desenvolvedor Full Stack

## Experiência Profissional
- **Senior Software Engineer** - Empresa XYZ (2023-presente)
- **Full Stack Developer** - Startup ABC (2021-2023)
- **Frontend Developer** - Tech Company (2019-2021)

## Habilidades Técnicas
- **Frontend**: Vue.js, React, Angular, TypeScript, JavaScript
- **Backend**: Node.js, Python, Java, .NET
- **Databases**: MySQL, PostgreSQL, MongoDB
- **Cloud**: AWS, Azure, GCP
- **DevOps**: Docker, Kubernetes, CI/CD

## Educação
- **Bacharelado em Ciência da Computação** - Universidade Federal (2015-2019)
- **Especialização em Desenvolvimento Web** - Instituto Tech (2020)

## Contato
- Email: henrique@amorim.dev
- LinkedIn: linkedin.com/in/henriqueamorim
- GitHub: github.com/henriqueamorim`
                                            },
                                            'skills.txt': {
                                                type: 'file',
                                                permissions: '-rw-r--r--',
                                                owner: 'amorim',
                                                group: 'amorim',
                                                size: 1024,
                                                modified: new Date(),
                                                content: `Programming Languages:
- JavaScript/TypeScript
- Python
- Java
- C#
- PHP

Frameworks & Libraries:
- Vue.js / Nuxt.js
- React / Next.js
- Angular
- Node.js
- Express.js
- Django
- Spring Boot

Databases:
- MySQL
- PostgreSQL
- MongoDB
- Redis

Tools & Technologies:
- Git
- Docker
- Kubernetes
- AWS
- Azure
- Linux
- Nginx`
                                            },
                                            'projects.json': {
                                                type: 'file',
                                                permissions: '-rw-r--r--',
                                                owner: 'amorim',
                                                group: 'amorim',
                                                size: 3072,
                                                modified: new Date(),
                                                content: JSON.stringify({
                                                    "projects": [
                                                        {
                                                            "name": "Portfolio Interactive",
                                                            "description": "Terminal-based portfolio website with OS simulation",
                                                            "technologies": ["Vue.js", "PrimeVue", "Three.js", "Tailwind CSS"],
                                                            "status": "Active"
                                                        },
                                                        {
                                                            "name": "E-commerce Platform",
                                                            "description": "Full-stack e-commerce solution with microservices",
                                                            "technologies": ["Node.js", "React", "MongoDB", "Docker"],
                                                            "status": "Completed"
                                                        },
                                                        {
                                                            "name": "Task Management API",
                                                            "description": "RESTful API for task and project management",
                                                            "technologies": ["Python", "Django", "PostgreSQL", "Redis"],
                                                            "status": "Completed"
                                                        }
                                                    ]
                                                }, null, 2)
                                            }
                                        }
                                    },
                                    'Projects': {
                                        type: 'dir',
                                        permissions: 'drwxr-xr-x',
                                        owner: 'amorim',
                                        group: 'amorim',
                                        size: 4096,
                                        modified: new Date(),
                                        contents: {
                                            'portfolio': {
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
                                                        size: 1536,
                                                        modified: new Date(),
                                                        content: `# Portfolio Interactive

Um portfólio interativo que simula um sistema operacional no navegador.

## Características
- Terminal funcional com comandos Unix
- Sistema de arquivos simulado
- Interface 3D com Three.js
- Suporte a múltiplos idiomas
- Design responsivo

## Tecnologias
- Vue.js 3
- PrimeVue
- Three.js
- Tailwind CSS
- Vite

## Como executar
\`\`\`bash
npm install
npm run dev
\`\`\`

## Comandos disponíveis no terminal
- ls: Listar arquivos
- cd: Navegar diretórios
- pwd: Diretório atual
- cat: Visualizar conteúdo de arquivo
- help: Lista de comandos
- about: Informações pessoais
- skills: Habilidades técnicas
- projects: Projetos desenvolvidos`
                                                    },
                                                    'package.json': {
                                                        type: 'file',
                                                        permissions: '-rw-r--r--',
                                                        owner: 'amorim',
                                                        group: 'amorim',
                                                        size: 2048,
                                                        modified: new Date(),
                                                        content: JSON.stringify({
                                                            "name": "portfolio-interactive",
                                                            "version": "1.0.0",
                                                            "description": "Interactive portfolio with OS simulation",
                                                            "main": "src/main.js",
                                                            "scripts": {
                                                                "dev": "vite",
                                                                "build": "vite build",
                                                                "preview": "vite preview"
                                                            },
                                                            "dependencies": {
                                                                "vue": "^3.3.0",
                                                                "primevue": "^3.40.0",
                                                                "three": "^0.158.0",
                                                                "vue-i18n": "^9.5.0"
                                                            }
                                                        }, null, 2)
                                                    }
                                                }
                                            },
                                            'web-apps': {
                                                type: 'dir',
                                                permissions: 'drwxr-xr-x',
                                                owner: 'amorim',
                                                group: 'amorim',
                                                size: 4096,
                                                modified: new Date(),
                                                contents: {
                                                    'todo-app': {
                                                        type: 'dir',
                                                        permissions: 'drwxr-xr-x',
                                                        owner: 'amorim',
                                                        group: 'amorim',
                                                        size: 4096,
                                                        modified: new Date(),
                                                        contents: {}
                                                    },
                                                    'chat-app': {
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
                                    'Pictures': {
                                        type: 'dir',
                                        permissions: 'drwxr-xr-x',
                                        owner: 'amorim',
                                        group: 'amorim',
                                        size: 4096,
                                        modified: new Date(),
                                        contents: {
                                            'profile.jpg': {
                                                type: 'file',
                                                permissions: '-rw-r--r--',
                                                owner: 'amorim',
                                                group: 'amorim',
                                                size: 245760,
                                                modified: new Date(),
                                                content: '[Binary image data - profile picture]'
                                            },
                                            'screenshots': {
                                                type: 'dir',
                                                permissions: 'drwxr-xr-x',
                                                owner: 'amorim',
                                                group: 'amorim',
                                                size: 4096,
                                                modified: new Date(),
                                                contents: {}
                                            }
                                        }
                                    },
                                    '.bashrc': {
                                        type: 'file',
                                        permissions: '-rw-r--r--',
                                        owner: 'amorim',
                                        group: 'amorim',
                                        size: 1024,
                                        modified: new Date(),
                                        content: `# ~/.bashrc: executed by bash(1) for non-login shells.

# If not running interactively, don't do anything
case $- in
    *i*) ;;
      *) return;;
esac

# some more ls aliases
alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'

# enable color support of ls and also add handy aliases
if [ -x /usr/bin/dircolors ]; then
    test -r ~/.dircolors && eval "$(dircolors -b ~/.dircolors)" || eval "$(dircolors -b)"
    alias ls='ls --color=auto'
    alias grep='grep --color=auto'
fi

# Custom prompt
PS1='\\[\\033[01;32m\\]\\u@\\h\\[\\033[00m\\]:\\[\\033[01;34m\\]\\w\\[\\033[00m\\]\\$ '`
                                    }
                                }
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
                        contents: {
                            'hostname': {
                                type: 'file',
                                permissions: '-rw-r--r--',
                                owner: 'root',
                                group: 'root',
                                size: 24,
                                modified: new Date(),
                                content: 'portfolio-amorim'
                            },
                            'passwd': {
                                type: 'file',
                                permissions: '-rw-r--r--',
                                owner: 'root',
                                group: 'root',
                                size: 256,
                                modified: new Date(),
                                content: `root:x:0:0:root:/root:/bin/bash
amorim:x:1000:1000:Henrique Amorim,,,:/home/amorim:/bin/bash`
                            }
                        }
                    },
                    'var': {
                        type: 'dir',
                        permissions: 'drwxr-xr-x',
                        owner: 'root',
                        group: 'root',
                        size: 4096,
                        modified: new Date(),
                        contents: {
                            'log': {
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
                }
            }
        };
    }

    /**
     * Navega para um diretório específico
     */
    changeDirectory(path) {
        let targetPath = this.resolvePath(path);
        
        const targetDir = this.getNodeFromPath(targetPath);
        
        if (!targetDir) {
            return { success: false, error: `cd: ${path}: No such file or directory` };
        }
        
        if (targetDir.type !== 'dir') {
            return { success: false, error: `cd: ${path}: Not a directory` };
        }
        
        this.currentPath.value = targetPath;
        this.history.value.push(targetPath);
        
        return { success: true, path: targetPath };
    }

    /**
     * Lista o conteúdo de um diretório
     */
    listDirectory(path = null, options = {}) {
        const targetPath = path ? this.resolvePath(path) : this.currentPath.value;
        const dir = this.getNodeFromPath(targetPath);
        
        if (!dir) {
            return { success: false, error: `ls: cannot access '${path || targetPath}': No such file or directory` };
        }
        
        if (dir.type !== 'dir') {
            return { 
                success: true, 
                entries: [{
                    name: path || targetPath.split('/').pop(),
                    ...dir
                }]
            };
        }
        
        const entries = Object.entries(dir.contents || {}).map(([name, item]) => ({
            name,
            ...item
        }));
        
        // Ordenar por tipo (diretórios primeiro) e depois por nome
        entries.sort((a, b) => {
            if (a.type !== b.type) {
                return a.type === 'dir' ? -1 : 1;
            }
            return a.name.localeCompare(b.name);
        });
        
        return { success: true, entries, path: targetPath };
    }

    /**
     * Obtém o conteúdo de um arquivo
     */
    readFile(path) {
        const targetPath = this.resolvePath(path);
        const file = this.getNodeFromPath(targetPath);
        
        if (!file) {
            return { success: false, error: `cat: ${path}: No such file or directory` };
        }
        
        if (file.type !== 'file') {
            return { success: false, error: `cat: ${path}: Is a directory` };
        }
        
        return { success: true, content: file.content || '', file };
    }

    /**
     * Resolve um caminho relativo ou absoluto
     */
    resolvePath(path) {
        if (!path || path === '.') {
            return this.currentPath.value;
        }
        
        if (path === '..') {
            const parts = this.currentPath.value.split('/').filter(p => p);
            parts.pop();
            return '/' + parts.join('/');
        }
        
        if (path.startsWith('/')) {
            return path === '/' ? '/' : path.replace(/\/+$/, '');
        }
        
        // Caminho relativo
        const current = this.currentPath.value === '/' ? '' : this.currentPath.value;
        return `${current}/${path}`.replace(/\/+/g, '/');
    }

    /**
     * Obtém um nó do sistema de arquivos a partir de um caminho
     */
    getNodeFromPath(path) {
        if (path === '/') {
            return this.fileSystem['/'];
        }
        
        const parts = path.split('/').filter(p => p);
        let current = this.fileSystem['/'];
        
        for (const part of parts) {
            if (!current.contents || !current.contents[part]) {
                return null;
            }
            current = current.contents[part];
        }
        
        return current;
    }

    /**
     * Obtém o diretório atual
     */
    getCurrentPath() {
        return this.currentPath.value;
    }

    /**
     * Obtém o diretório atual como objeto
     */
    getCurrentDirectory() {
        return this.getNodeFromPath(this.currentPath.value);
    }

    /**
     * Cria um novo arquivo
     */
    createFile(path, content = '', permissions = '-rw-r--r--') {
        const targetPath = this.resolvePath(path);
        const parts = targetPath.split('/').filter(p => p);
        const fileName = parts.pop();
        const dirPath = '/' + parts.join('/');
        
        const parentDir = this.getNodeFromPath(dirPath);
        
        if (!parentDir || parentDir.type !== 'dir') {
            return { success: false, error: `touch: cannot create '${path}': No such file or directory` };
        }
        
        if (parentDir.contents[fileName]) {
            // Arquivo já existe, apenas atualiza o timestamp
            parentDir.contents[fileName].modified = new Date();
        } else {
            // Cria novo arquivo
            parentDir.contents[fileName] = {
                type: 'file',
                permissions,
                owner: 'amorim',
                group: 'amorim',
                size: content.length,
                modified: new Date(),
                content
            };
        }
        
        return { success: true };
    }

    /**
     * Cria um novo diretório
     */
    createDirectory(path, permissions = 'drwxr-xr-x') {
        const targetPath = this.resolvePath(path);
        const parts = targetPath.split('/').filter(p => p);
        const dirName = parts.pop();
        const parentPath = '/' + parts.join('/');
        
        const parentDir = this.getNodeFromPath(parentPath);
        
        if (!parentDir || parentDir.type !== 'dir') {
            return { success: false, error: `mkdir: cannot create directory '${path}': No such file or directory` };
        }
        
        if (parentDir.contents[dirName]) {
            return { success: false, error: `mkdir: cannot create directory '${path}': File exists` };
        }
        
        parentDir.contents[dirName] = {
            type: 'dir',
            permissions,
            owner: 'amorim',
            group: 'amorim',
            size: 4096,
            modified: new Date(),
            contents: {}
        };
        
        return { success: true };
    }

    /**
     * Remove um arquivo ou diretório
     */
    remove(path, recursive = false) {
        const targetPath = this.resolvePath(path);
        const parts = targetPath.split('/').filter(p => p);
        const itemName = parts.pop();
        const parentPath = '/' + parts.join('/');
        
        const parentDir = this.getNodeFromPath(parentPath);
        const item = this.getNodeFromPath(targetPath);
        
        if (!item) {
            return { success: false, error: `rm: cannot remove '${path}': No such file or directory` };
        }
        
        if (item.type === 'dir' && !recursive && Object.keys(item.contents || {}).length > 0) {
            return { success: false, error: `rm: cannot remove '${path}': Directory not empty` };
        }
        
        delete parentDir.contents[itemName];
        return { success: true };
    }

    /**
     * Obtém informações detalhadas sobre um arquivo/diretório
     */
    stat(path) {
        const targetPath = this.resolvePath(path);
        const item = this.getNodeFromPath(targetPath);
        
        if (!item) {
            return { success: false, error: `stat: cannot stat '${path}': No such file or directory` };
        }
        
        return { success: true, item, path: targetPath };
    }

    /**
     * Encontra arquivos por padrão
     */
    find(pattern, startPath = null) {
        const searchPath = startPath ? this.resolvePath(startPath) : this.currentPath.value;
        const results = [];
        
        const search = (path, node) => {
            if (node.type === 'file' && path.includes(pattern)) {
                results.push(path);
            }
            
            if (node.type === 'dir' && node.contents) {
                Object.entries(node.contents).forEach(([name, child]) => {
                    const childPath = path === '/' ? `/${name}` : `${path}/${name}`;
                    search(childPath, child);
                });
            }
        };
        
        const startNode = this.getNodeFromPath(searchPath);
        if (startNode) {
            search(searchPath, startNode);
        }
        
        return { success: true, results };
    }
}

// Singleton pattern para o FileSystemService
let fileSystemInstance = null;

export const getFileSystem = () => {
    if (!fileSystemInstance) {
        fileSystemInstance = new FileSystemService();
    }
    return fileSystemInstance;
};

export default FileSystemService;
