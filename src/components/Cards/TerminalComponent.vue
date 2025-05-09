<script setup>
import AnsiToHtml from 'ansi-to-html';
import TerminalService from 'primevue/terminalservice';
import { computed, onBeforeUnmount, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import CardEffect from '../CardEffect.vue';

const { t } = useI18n();
const ansiToHtml = new AnsiToHtml();

const neofetchOutput = () => {
    const rawAnsi = `
\u001b[38;5;46m         ,xNMM.           \u001b[0m  \u001b[38;5;118mportfolio@amorim\u001b[0m
\u001b[38;5;46m       .OMMMMo            \u001b[0m  ------------------------
\u001b[38;5;46m       OMMM0,             \u001b[0m  \u001b[1mOS\u001b[0m: VueOS 3.0 (Custom)
\u001b[38;5;46m     .;loddo:. loolloddol;.\u001b[0m  \u001b[1mHost\u001b[0m: WebPortfolio
\u001b[38;5;46m   cKMMMMMMMMMMMMMMMMMMMMMM0:\u001b[0m  \u001b[1mKernel\u001b[0m: Tailwind 3.x
\u001b[38;5;220m .KMMMMMMMMMMMMMMMMMMMMMMMWd.\u001b[0m  \u001b[1mUptime\u001b[0m: 42 hours
\u001b[38;5;208m XMMMMMMMMMMMMMMMMMMMMMMMX.\u001b[0m   \u001b[1mPackages\u001b[0m: Vue + PrimeVue
\u001b[38;5;203m ;MMMMMMMMMMMMMMMMMMMMMMMM:\u001b[0m   \u001b[1mShell\u001b[0m: PrimeTerminal
\u001b[38;5;198m :MMMMMMMMMMMMMMMMMMMMMMMM:\u001b[0m   \u001b[1mResolution\u001b[0m: 100% responsive
\u001b[38;5;135m .MMMMMMMMMMMMMMMMMMMMMMMMX.\u001b[0m  \u001b[1mFont\u001b[0m: Inherited Sans
\u001b[38;5;99m  kMMMMMMMMMMMMMMMMMMMMMMMWd.\u001b[0m  \u001b[1mCPU\u001b[0m: Human Imagination
\u001b[38;5;69m   .XMMMMMMMMMMMMMMMMMMMMMMMK.\u001b[0m \u001b[1mGPU\u001b[0m: CSS Renderer
\u001b[38;5;33m    kMMMMMMMMMMMMMMMMMMMMMMd \u001b[0m \u001b[1mMemory\u001b[0m: Unlimited
\u001b[38;5;27m     ;KMMMMMMMWXXWMMMMMMMK;\u001b[0m
\u001b[38;5;27m        .cooc,.    .,coo:.\u001b[0m
    `;
    const terminalCommandList = document.querySelector('.p-terminal-command-list');

    if (!terminalCommandList) {
        console.error('Element with class "p-terminal-command-list" not found.');
        return;
    }

    // Substitui \n por <br> para preservar quebras de linha
    const formattedAnsi = rawAnsi.replace(/\n/g, '<br>');

    // Cria uma nova div para o comando
    const commandDiv = document.createElement('div');
    commandDiv.className = 'p-terminal-command';
    commandDiv.innerHTML = ansiToHtml.toHtml(formattedAnsi);

    // Adiciona a nova div ao final da lista
    terminalCommandList.appendChild(commandDiv);
};

const commandHandler = (text) => {
    let response;
    const lowerCaseText = text.toLowerCase();
    const argsIndex = lowerCaseText.indexOf(' ');
    const command = argsIndex !== -1 ? lowerCaseText.substring(0, argsIndex) : lowerCaseText;

    const commandLabels = [
        'help',
        'clear',
        'about',
        'skills',
        'projects',
        'education',
        'experience',
        'contact',
        'resume',
        'social',
        'interests',
        'achievements',
        'blog',
        'recommendations',
        'FAQ',
        'stats',
        'connect',
        'portfolio',
        'feedback',
        'hire',
        'funfact',
        'neofetch'
    ];

    switch (command) {
        case 'help':
            response = `Commands are: ${commandLabels.join(', ')}`;
            break;
        case 'clear':
            response = '';
            clearTerminal();
            setTimeout(() => {
                clearTerminal();
            }, 1);
            return;
        case 'about':
            response = computed(() => t('Terminal.About'));
            break;
        case 'skills':
            response = computed(() => t('Terminal.Skills'));
            break;
        case 'projects':
            response = computed(() => t('Terminal.Projects'));
            break;
        case 'education':
            response = computed(() => t('Terminal.Education'));
            break;
        case 'experience':
            response = computed(() => t('Terminal.Experience'));
            break;
        case 'contact':
            response = computed(() => t('Terminal.Contact'));
            break;
        case 'resume':
            response = computed(() => t('Terminal.Resume'));
            break;
        case 'social':
            response = computed(() => t('Terminal.Social'));
            break;
        case 'interests':
            response = computed(() => t('Terminal.Interests'));
            break;
        case 'achievements':
            response = computed(() => t('Terminal.Achievements'));
            break;
        case 'blog':
            response = computed(() => t('Terminal.Blog'));
            break;
        case 'recommendations':
            response = computed(() => t('Terminal.Recommendations'));
            break;
        case 'faq':
            response = computed(() => t('Terminal.FAQ'));
            break;
        case 'stats':
            response = computed(() => t('Terminal.Stats'));
            break;
        case 'connect':
            response = computed(() => t('Terminal.Connect'));
            break;
        case 'portfolio':
            response = computed(() => t('Terminal.Portfolio'));
            break;
        case 'feedback':
            response = computed(() => t('Terminal.Feedback'));
            break;
        case 'hire':
            response = computed(() => t('Terminal.Hire'));
            break;
        case 'funfact':
            response = computed(() => t('Terminal.Funfact'));
            break;
        case 'neofetch':
            neofetchOutput();
            break;

        default:
            response = `Unknown command: ${command}`;
    }

    TerminalService.emit('response', response);
};

const clearTerminal = () => {
    const terminalContent = document.querySelector('.p-terminal-content');
    const commandSections = terminalContent.querySelectorAll('[data-pc-section="commands"]');
    for (const section of commandSections) {
        section.remove();
    }
};

onMounted(() => {
    TerminalService.on('command', commandHandler);

    setTimeout(() => {
        TerminalService.emit('command', 'neofetch');
    }, 200);
});

onBeforeUnmount(() => {
    TerminalService.off('command', commandHandler);
});
</script>

<template>
    <div id="Terminal" class="col-span-4 lg:col-span-4 xl:col-span-4 pb-0">
        <CardEffect>
            <div class="terminal-card" style="width: 100%; height: 100%; padding: 0">
                <Terminal :welcomeMessage="'Welcome to Amorim. ' + 'Type \'help\' for commands'"
                    prompt="portfolio@amorim:~$" aria-label="PrimeVue Terminal Service" />
            </div>
        </CardEffect>
    </div>
</template>
<style scoped>
.p-terminal {
    font-size: calc(var(--scale) + 2px) !important;
    background: var(--surface-card) !important;
}

.p-terminal .p-terminal-content {
    height: 100%;
}

.p-terminal .p-terminal-input {
    font-size: calc(var(--scale) + 2px) !important;
}

.p-terminal-content {
    white-space: pre-wrap;
    word-break: break-word;
}

.p-terminal-command {
    white-space: pre;
    /* Preserva espaços e quebras de linha */
    font-family: 'Courier New', Courier, monospace;
    /* Usa uma fonte monoespaçada */
    line-height: 1.1;
    /* Ajusta o espaçamento entre linhas */
    display: block;
    /* Garante que o conteúdo seja tratado como bloco */
    overflow-x: auto;
    /* Adiciona rolagem horizontal, se necessário */
}

.p-terminal-command-list {
    white-space: pre-wrap;
    /* Permite quebras de linha sem alterar o formato */
    word-break: normal;
    /* Evita que palavras sejam quebradas */
    overflow-x: auto;
    /* Adiciona rolagem horizontal, se necessário */
    font-family: 'Courier New', Courier, monospace;
    /* Garante fonte monoespaçada no container */
}

.terminal-card {
    background: var(--surface-card);
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
