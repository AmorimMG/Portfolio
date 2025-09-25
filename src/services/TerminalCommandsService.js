/**
 * Terminal Commands - Implementa comandos Unix-like usando o FileSystemStore
 */
import { useFileSystemStore } from '@/stores/useFileSystemStore';
import AnsiToHtml from 'ansi-to-html';

const ansiToHtml = new AnsiToHtml({ escapeXML: false });
let fs = null;

// Função para obter a store (lazy loading)
const getFileSystemStore = () => {
    if (!fs) {
        fs = useFileSystemStore();
    }
    return fs;
};

/**
 * Utilitário para scrollar terminal para o final
 */
export const scrollToBottom = () => {
    setTimeout(() => {
        const terminal = document.querySelector('.p-terminal-content');
        if (terminal) {
            terminal.scrollTop = terminal.scrollHeight;
        }
    }, 10);
};

/**
 * Comando ls - Lista diretórios e arquivos
 */
export const lsCommand = (args = []) => {
    const fs = getFileSystemStore();
    const options = {
        long: args.includes('-l') || args.includes('-la') || args.includes('-al'),
        all: args.includes('-a') || args.includes('-la') || args.includes('-al'),
        human: args.includes('-h')
    };
    
    const path = args.find(arg => !arg.startsWith('-')) || null;
    const result = fs.listDirectory(path, options);
    
    if (!result.success) {
        return result.error;
    }
    
    if (result.entries.length === 0) {
        return 'Directory is empty';
    }
    
    if (options.long) {
        return formatLongListing(result.entries, result.path);
    } else {
        return formatSimpleListing(result.entries);
    }
};

/**
 * Comando cd - Muda diretório
 */
export const cdCommand = (args = []) => {
    const fs = getFileSystemStore();
    const path = args[0] || '/home/amorim';
    const result = fs.changeDirectory(path);
    
    if (!result.success) {
        return result.error;
    }
    
    return '';
};

/**
 * Comando pwd - Mostra diretório atual
 */
export const pwdCommand = () => {
    const fs = getFileSystemStore();
    return fs.currentPath;
};

/**
 * Comando cat - Exibe conteúdo de arquivo
 */
export const catCommand = (args = []) => {
    const fs = getFileSystemStore();
    if (args.length === 0) {
        return 'cat: missing file operand';
    }
    
    const results = [];
    for (const path of args) {
        const result = fs.readFile(path);
        if (!result.success) {
            results.push(result.error);
        } else {
            results.push(result.content);
        }
    }
    
    return results.join('\n');
};

/**
 * Comando mkdir - Cria diretório
 */
export const mkdirCommand = (args = []) => {
    const fs = getFileSystemStore();
    if (args.length === 0) {
        return 'mkdir: missing operand';
    }
    
    const results = [];
    for (const path of args) {
        const pathParts = path.split('/');
        const dirName = pathParts.pop();
        const parentPath = pathParts.join('/') || fs.currentPath;
        
        const result = fs.createDirectory(dirName, parentPath);
        if (!result.success) {
            results.push(result.error);
        }
    }
    
    return results.length > 0 ? results.join('\n') : '';
};

/**
 * Comando touch - Cria arquivo ou atualiza timestamp
 */
export const touchCommand = (args = []) => {
    const fs = getFileSystemStore();
    if (args.length === 0) {
        return 'touch: missing file operand';
    }
    
    const results = [];
    for (const path of args) {
        const pathParts = path.split('/');
        const fileName = pathParts.pop();
        const parentPath = pathParts.join('/') || fs.currentPath;
        
        const result = fs.createFile(fileName, '', parentPath);
        if (!result.success) {
            results.push(result.error);
        }
    }
    
    return results.length > 0 ? results.join('\n') : '';
};

/**
 * Comando rm - Remove arquivos/diretórios
 */
export const rmCommand = (args = []) => {
    const fs = getFileSystemStore();
    if (args.length === 0) {
        return 'rm: missing operand';
    }
    
    const recursive = args.includes('-r') || args.includes('-rf');
    const paths = args.filter(arg => !arg.startsWith('-'));
    
    const results = [];
    for (const path of paths) {
        const pathParts = path.split('/');
        const itemName = pathParts.pop();
        const parentPath = pathParts.join('/') || fs.currentPath;
        
        const result = fs.removeItem(itemName, parentPath);
        if (!result.success) {
            results.push(result.error);
        }
    }
    
    return results.length > 0 ? results.join('\n') : '';
};

/**
 * Comando find - Encontra arquivos
 */
export const findCommand = (args = []) => {
    const fs = getFileSystemStore();
    if (args.length === 0) {
        return 'find: missing search pattern';
    }
    
    const pattern = args[0];
    const startPath = args[1] || null;
    
    const results = fs.searchFiles(pattern, startPath);
    
    if (results.length === 0) {
        return `find: no matches found for '${pattern}'`;
    }
    
    return results.map(item => item.path).join('\n');
};

/**
 * Comando file - Mostra tipo de arquivo
 */
export const fileCommand = (args = []) => {
    const fs = getFileSystemStore();
    if (args.length === 0) {
        return 'file: missing file operand';
    }
    
    const results = [];
    for (const path of args) {
        const item = fs.getItemAtPath(path);
        if (!item) {
            results.push(`file: cannot open '${path}': No such file or directory`);
        } else {
            let description = '';
            
            if (item.type === 'dir') {
                description = 'directory';
            } else {
                // Detect file type based on extension or content
                const filename = path.split('/').pop();
                const ext = filename.split('.').pop().toLowerCase();
                
                switch (ext) {
                    case 'md':
                        description = 'Markdown document';
                        break;
                    case 'json':
                        description = 'JSON data';
                        break;
                    case 'txt':
                        description = 'ASCII text';
                        break;
                    case 'js':
                        description = 'JavaScript source';
                        break;
                    case 'jpg':
                    case 'jpeg':
                        description = 'JPEG image data';
                        break;
                    default:
                        description = 'regular file';
                }
            }
            
            results.push(`${path}: ${description}`);
        }
    }
    
    return results.join('\n');
};

/**
 * Comando wc - Conta linhas, palavras e caracteres
 */
export const wcCommand = (args = []) => {
    const fs = getFileSystemStore();
    if (args.length === 0) {
        return 'wc: missing file operand';
    }
    
    const results = [];
    for (const path of args) {
        const result = fs.readFile(path);
        if (!result.success) {
            results.push(result.error);
        } else {
            const content = result.content;
            const lines = content.split('\n').length;
            const words = content.split(/\s+/).filter(w => w).length;
            const chars = content.length;
            
            results.push(`${lines.toString().padStart(8)} ${words.toString().padStart(8)} ${chars.toString().padStart(8)} ${path}`);
        }
    }
    
    return results.join('\n');
};

/**
 * Comando tree - Mostra estrutura de diretórios
 */
export const treeCommand = (args = []) => {
    const fs = getFileSystemStore();
    const startPath = args[0] || fs.currentPath;
    const maxDepth = args.includes('-L') ? parseInt(args[args.indexOf('-L') + 1]) || 2 : 3;
    
    const item = fs.getItemAtPath(startPath);
    if (!item) {
        return `tree: ${startPath}: No such file or directory`;
    }
    
    const lines = [];
    lines.push(startPath);
    
    const buildTree = (path, node, prefix = '', depth = 0) => {
        if (depth >= maxDepth || node.type !== 'dir' || !node.contents) {
            return;
        }
        
        const entries = Object.entries(node.contents);
        entries.forEach(([name, item], index) => {
            const isLast = index === entries.length - 1;
            const currentPrefix = prefix + (isLast ? '└── ' : '├── ');
            const nextPrefix = prefix + (isLast ? '    ' : '│   ');
            
            lines.push(currentPrefix + name + (item.type === 'dir' ? '/' : ''));
            
            if (item.type === 'dir') {
                buildTree(`${path}/${name}`, item, nextPrefix, depth + 1);
            }
        });
    };
    
    buildTree(startPath, item);
    return lines.join('\n');
};

/**
 * Formata listagem longa (ls -l)
 */
const formatLongListing = (entries, path) => {
    const lines = [`total ${entries.length}`];
    
    entries.forEach(entry => {
        const permissions = entry.permissions || (entry.type === 'dir' ? 'drwxr-xr-x' : '-rw-r--r--');
        const owner = entry.owner || 'amorim';
        const group = entry.group || 'amorim';
        const size = entry.size || 0;
        const date = entry.modified ? entry.modified.toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }) : 'Jan 01 00:00';
        
        const name = entry.type === 'dir' ? `\u001b[1;34m${entry.name}/\u001b[0m` : entry.name;
        
        lines.push(`${permissions} 1 ${owner} ${group} ${size.toString().padStart(8)} ${date} ${name}`);
    });
    
    return lines.join('\n');
};

/**
 * Formata listagem simples (ls)
 */
const formatSimpleListing = (entries) => {
    const names = entries.map(entry => {
        if (entry.type === 'dir') {
            return `\u001b[1;34m${entry.name}/\u001b[0m`;
        }
        return entry.name;
    });
    
    // Organiza em colunas se houver muitos itens
    if (names.length > 6) {
        const columns = 3;
        const rows = Math.ceil(names.length / columns);
        const result = [];
        
        for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < columns; j++) {
                const index = i + j * rows;
                if (index < names.length) {
                    row.push(names[index].padEnd(20));
                }
            }
            result.push(row.join(''));
        }
        
        return result.join('\n');
    }
    
    return names.join('  ');
};

/**
 * Atualiza o prompt do terminal com o diretório atual
 */
const updatePrompt = () => {
    const fs = getFileSystemStore();
    const currentPath = fs.currentPath;
    const shortPath = currentPath.replace('/home/amorim', '~');
    
    // Tenta atualizar o prompt se o terminal estiver disponível
    setTimeout(() => {
        const promptElement = document.querySelector('.p-terminal-prompt-label');
        if (promptElement) {
            promptElement.textContent = `portfolio@amorim:${shortPath}$ `;
        }
    }, 10);
};

/**
 * Limpa o terminal
 */
export const clearTerminal = () => {
    const commandList = document.querySelector('.p-terminal-command-list');
    if (!commandList) return;

    const commands = commandList.querySelectorAll('[data-pc-section="commands"]');
    commands.forEach((cmd) => cmd.remove());

    const input = document.querySelector('.p-terminal-prompt-value');
    if (input) {
        input.value = '';
    }
};

/**
 * Mapa de comandos disponíveis
 */
export const commands = {
    'ls': lsCommand,
    'cd': cdCommand,
    'pwd': pwdCommand,
    'cat': catCommand,
    'mkdir': mkdirCommand,
    'touch': touchCommand,
    'rm': rmCommand,
    'find': findCommand,
    'file': fileCommand,
    'wc': wcCommand,
    'tree': treeCommand,
    'clear': () => { clearTerminal(); return ''; }
};

/**
 * Executa um comando
 */
export const executeCommand = (commandLine) => {
    const args = commandLine.trim().split(' ').filter(arg => arg);
    if (args.length === 0) return '';
    
    const command = args[0].toLowerCase();
    const commandArgs = args.slice(1);
    
    if (commands[command]) {
        return commands[command](commandArgs);
    }
    
    return `${command}: command not found`;
};

// Exports para compatibilidade (removendo duplicações)
export const getCurrentPath = () => getFileSystemStore().currentPath;
export const getCurrentDirectory = () => getFileSystemStore().currentDirectory;
export const getNodeFromPath = (path) => getFileSystemStore().getItemAtPath(path);
export const listDirectory = (dir) => {
    // Mantém compatibilidade com a implementação anterior
    if (dir && dir.contents) {
        const entries = Object.entries(dir.contents).map(([name, item]) => ({ name, ...item }));
        return formatSimpleListing(entries);
    }
    return lsCommand();
};
