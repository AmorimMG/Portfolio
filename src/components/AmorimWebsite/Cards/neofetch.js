import AnsiToHtml from 'ansi-to-html';
import { scrollToBottom } from './terminalUtils';

const ansiToHtml = new AnsiToHtml({ escapeXML: false });

export const neofetchOutput = (isDarkTheme, isCard = true) => {
    var logoAnsi = `
\u001b[0m\u001b \u001b[0m
\u001b[38;5;196m            ⢱⣆
\u001b[38;5;197m            ⠈⣿⣷⡀
\u001b[38;5;198m            ⢸⣿⣿⣷⣧
\u001b[38;5;199m        ⡀⢠⣿⡟⣿⣿⣿⡇
\u001b[38;5;200m        ⣳⣼⣿⡏⢸⣿⣿⣿⢀
\u001b[38;5;201m       ⣰⣿⣿⡿⠁⢸⣿⣿⡟⣼⡆
\u001b[38;5;93m    ⢰⢀⣾⣿⣿⠟⠀⣾⢿⣿⣿⣿⣿
\u001b[38;5;99m    ⢸⣿⣿⣿⡏⠀⠀⠃⠸⣿⣿⣿⡿
\u001b[38;5;63m    ⢳⣿⣿⣿⠀⠀⠀⠀⢹⣿⡿⡁
\u001b[38;5;33m    ⠹⣿⣿⡄⠀⠀⠀⢠⣿⡞⠁
\u001b[38;5;39m     ⠈⠛⢿⣄⠀⣠⠞⠋
\u001b[38;5;45m        ⠉⠀
\u001b[0m\u001b \u001b[0m`;

    var infoAnsi = `
\u001b[38;5;15mPortfolio@Amorim
\u001b[38;5;15m------------------
\u001b[38;5;15mOS:\u001b[0m FlamorzOS 3.0 (Custom)
\u001b[38;5;15mHost:\u001b[0m WebPortfolio
\u001b[38;5;15mKernel:\u001b[0m Tailwind 3.x
\u001b[38;5;15mUptime:\u001b[0m 42 hours
\u001b[38;5;15mPackages:\u001b[0m Vue + PrimeVue
\u001b[38;5;15mShell:\u001b[0m PrimeTerminal
\u001b[38;5;15mResolution:\u001b[0m 100% responsive
\u001b[38;5;15mFont:\u001b[0m Inherited Sans
\u001b[38;5;15mCPU:\u001b[0m Human Imagination
\u001b[38;5;15mGPU:\u001b[0m CSS Renderer
\u001b[38;5;15mMemory:\u001b[0m Unlimited
\u001b[38;5;45m███\u001b[38;5;51m███\u001b[38;5;87m███\u001b[38;5;123m███\u001b[38;5;159m███\u001b[38;5;195m███
\u001b[38;5;45m███\u001b[38;5;51m███\u001b[38;5;87m███\u001b[38;5;123m███\u001b[38;5;159m███\u001b[38;5;195m███`;

    if (isDarkTheme) {
        logoAnsi = logoAnsi.replace(/\u001b\[38;5;(\d+)m/g, (match, p1) => {
            return `\u001b[38;5;${parseInt(p1) + 8}m`;
        });
        infoAnsi = infoAnsi.replace(/\u001b\[38;5;(\d+)m/g, (match, p1) => {
            return `\u001b[38;5;${parseInt(p1) + 8}m`;
        });
    }

    const terminalContent = document.querySelector('.p-terminal-command-list');
    if (!terminalContent) {
        console.error('Terminal content not found');
        return;
    }

    const commands = terminalContent.querySelectorAll('[data-pc-section="commands"]');
    const lastCommandContainer = commands[commands.length - 1];

    if (!lastCommandContainer) return;

    const preElement = document.createElement('pre');
    preElement.className = 'p-terminal-command neofetch-output';

    const flexContainer = document.createElement('div');
    flexContainer.className = 'neofetch-container';
    flexContainer.style.display = 'flex';
    flexContainer.style.gap = '25px';

    if (isCard) {
        flexContainer.style.fontSize = '10px';
    }

    const logoDiv = document.createElement('div');
    logoDiv.className = 'neofetch-logo';
    const logoCode = document.createElement('code');
    logoCode.innerHTML = ansiToHtml.toHtml(logoAnsi);
    logoDiv.appendChild(logoCode);

    const infoDiv = document.createElement('div');
    infoDiv.className = 'neofetch-info';
    const infoCode = document.createElement('code');
    infoCode.innerHTML = ansiToHtml.toHtml(infoAnsi);
    infoDiv.appendChild(infoCode);

    infoDiv.style.display = 'flex';
    infoDiv.style.alignItems = 'center';

    flexContainer.appendChild(logoDiv);
    flexContainer.appendChild(infoDiv);
    preElement.appendChild(flexContainer);

    lastCommandContainer.appendChild(preElement);
    scrollToBottom();
};
