import { fileSystem } from '@/data/fileSystem';
import AnsiToHtml from 'ansi-to-html';
import { ref } from 'vue';
import { scrollToBottom } from './terminalUtils';

const ansiToHtml = new AnsiToHtml({ escapeXML: false });
const currentPath = ref('/home');
const currentDir = ref(fileSystem['/'].contents['home']);

export const getDirectoryFromPath = (path) => {
    let targetPath = path;
    if (!path.startsWith('/')) {
        if (path === '..') {
            targetPath = currentPath.value.split('/').slice(0, -1).join('/') || '/';
        } else if (path === '.') {
            targetPath = currentPath.value;
        } else {
            targetPath = `${currentPath.value}/${path}`.replace(/\/+/g, '/');
        }
    }

    let current = fileSystem['/'];
    if (targetPath === '/') return current;

    const parts = targetPath.split('/').filter(p => p);
    for (const part of parts) {
        if (current.contents && current.contents[part]) {
            current = current.contents[part];
        } else {
            return null;
        }
    }
    return current;
};

export const listDirectory = (dir) => {
    const terminalContent = document.querySelector('.p-terminal-command-list');
    if (!terminalContent) {
        console.error('Terminal content not found');
        return;
    }

    const commands = terminalContent.querySelectorAll('[data-pc-section="commands"]');
    const lastCommandContainer = commands[commands.length - 1];
    if (!lastCommandContainer) return;

    const preElement = document.createElement('pre');
    preElement.className = 'p-terminal-command ls-output';

    let output = `Current directory: ${currentPath.value}\n\n`;
    if (!dir || !dir.contents) {
        preElement.textContent = output;
        lastCommandContainer.appendChild(preElement);
        return;
    }

    const entries = Object.entries(dir.contents);
    if (entries.length === 0) {
        preElement.textContent = output + 'Directory is empty';
        lastCommandContainer.appendChild(preElement);
        return;
    }

    let rawOutput = '';
    for (const [name, item] of entries) {
        const type = item.type === 'dir' ? 'd' : '-';
        const permissions = 'rwxr-xr-x';
        const size = item.type === 'file' ? item.content?.length || 0 : 4096;
        const date = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });

        if (item.type === 'dir') {
            rawOutput += `${type}${permissions} 1 user group ${size.toString().padStart(8)} ${date} \u001b[1;34m${name}/\u001b[0m\n`;
        } else {
            rawOutput += `${type}${permissions} 1 user group ${size.toString().padStart(8)} ${date} ${name}\n`;
        }
    }

    const codeElement = document.createElement('code');
    codeElement.innerHTML = ansiToHtml.toHtml(output + rawOutput);
    preElement.appendChild(codeElement);
    lastCommandContainer.appendChild(preElement);

    scrollToBottom();

    return '';
};

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

export { currentDir, currentPath };

