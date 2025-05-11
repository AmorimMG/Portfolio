<script setup>
import { terminalConfig } from '@/data/terminalConfig';
import { useLayout } from '@/layout/composables/layout';
import AnsiToHtml from 'ansi-to-html';
import TerminalService from 'primevue/terminalservice';
import { computed, onBeforeUnmount, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import CardEffect from '../CardEffect.vue';

const { t } = useI18n();
const { isDarkTheme } = useLayout();
const ansiToHtml = new AnsiToHtml();

const props = defineProps({
    isCard: {
        type: Boolean,
        default: true
    }
});

const neofetchOutput = () => {
    var logoAnsi = `
\u001b[0m\u001b \u001b[0m
\u001b[38;5;46m                    'c.
\u001b[38;5;46m                 ,xNMM.
\u001b[38;5;46m               .OMMMMo
\u001b[38;5;46m               OMMM0,
\u001b[38;5;46m     .;loddo:'  ':olloddol;.
\u001b[38;5;46m   cKMMMMMMMMMMNWMMMMMMMMMM0:
\u001b[38;5;220m .KMMMMMMMMMMMMMMMMMMMMMMMWd.
\u001b[38;5;208m XMMMMMMMMMMMMMMMMMMMMMMMX.
\u001b[38;5;203m;MMMMMMMMMMMMMMMMMMMMMMMM:
\u001b[38;5;198m:MMMMMMMMMMMMMMMMMMMMMMMM:
\u001b[38;5;135m.MMMMMMMMMMMMMMMMMMMMMMMMX.
\u001b[38;5;99m kMMMMMMMMMMMMMMMMMMMMMMMWd.
\u001b[38;5;69m .XMMMMMMMMMMMMMMMMMMMMMMMMk
\u001b[38;5;33m  'XMMMMMMMMMMMMMMMMMMMMMMK.
\u001b[38;5;27m    kMMMMMMMMWXXWMMMMMMMk.
\u001b[38;5;27m     ;KMXk;;'  ..';;XMXk'
\u001b[0m\u001b \u001b[0m`;

    var infoAnsi = `
\u001b[38;5;15mPortfolio@Amorim
\u001b[38;5;15m------------------
\u001b[38;5;15mOS:\u001b[0m VueOS 3.0 (Custom)
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

    // Criar div flexbox container
    const flexContainer = document.createElement('div');
    flexContainer.className = 'neofetch-container';
    flexContainer.style.display = 'flex';
    flexContainer.style.gap = '25px';

    // Criar div para logo
    const logoDiv = document.createElement('div');
    logoDiv.className = 'neofetch-logo';
    const logoCode = document.createElement('code');
    logoCode.innerHTML = ansiToHtml.toHtml(logoAnsi);
    logoDiv.appendChild(logoCode);

    // Criar div para info
    const infoDiv = document.createElement('div');
    infoDiv.className = 'neofetch-info';
    const infoCode = document.createElement('code');
    infoCode.innerHTML = ansiToHtml.toHtml(infoAnsi);
    infoDiv.appendChild(infoCode);

    infoDiv.style.display = 'flex';
    infoDiv.style.alignItems = 'center';

    // Montar estrutura
    flexContainer.appendChild(logoDiv);
    flexContainer.appendChild(infoDiv);
    preElement.appendChild(flexContainer);

    lastCommandContainer.appendChild(preElement);
};

const clearTerminal = () => {
    const commandList = document.querySelector('.p-terminal-command-list');
    if (!commandList) return;

    const commands = commandList.querySelectorAll('[data-pc-section="commands"]');
    commands.forEach((cmd) => cmd.remove());

    const input = document.querySelector('.p-terminal-prompt-value');
    if (input) {
        input.value = '';
    }
};

const formatTestimonials = () => {
    return terminalConfig.testimonials.map((t) => `"${t.content}" - ${t.author}, ${t.role} at ${t.company}`).join('\n');
};

const formatFAQs = () => {
    return terminalConfig.faqs.map((faq) => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n');
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
            clearTerminal();
            setTimeout(() => {
                clearTerminal();
            }, 50);
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
            response = computed(() =>
                t('Terminal.Resume', {
                    resumeLink: terminalConfig.resumeLink
                })
            );
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
            response = computed(() =>
                t('Terminal.Blog', {
                    blogLink: terminalConfig.blogLink
                })
            );
            break;
        case 'recommendations':
            response = computed(() =>
                t('Terminal.Recommendations', {
                    testimonials: formatTestimonials()
                })
            );
            break;
        case 'faq':
            response = computed(() =>
                t('Terminal.FAQ', {
                    faqs: formatFAQs()
                })
            );
            break;
        case 'stats':
            response = computed(() =>
                t('Terminal.Stats', {
                    projectsCount: terminalConfig.projectsCount,
                    yearsOfExperience: terminalConfig.yearsOfExperience
                })
            );
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
            setTimeout(() => {
                neofetchOutput();
            }, 50);
            return;
        default:
            response = `Unknown command: ${command}`;
    }

    if (response) {
        TerminalService.emit('response', response);
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
        <CardEffect v-if="props.isCard">
            <div class="terminal-card" style="width: 100%; height: 100%; padding: 0">
                <Terminal :welcomeMessage="'Welcome to Amorim. ' + 'Type \'help\' for commands'"
                    prompt="portfolio@amorim:~$" aria-label="PrimeVue Terminal Service" />
            </div>
        </CardEffect>
        <div v-else class="terminal-card" style="width: 100%; height: 100%; padding: 0">
            <Terminal :welcomeMessage="'Welcome to Amorim. ' + 'Type \'help\' for commands'"
                prompt="portfolio@amorim:~$" aria-label="PrimeVue Terminal Service" />
        </div>
    </div>
</template>
<style scoped>
.p-terminal {
    font-size: calc(var(--scale) + 2px) !important;
}

.p-terminal .p-terminal-content {
    height: 100%;
}

.p-terminal .p-terminal-input {
    font-size: calc(var(--scale) + 2px) !important;
}

.terminal-card {
    background: rgba(155, 89, 182, 0.15);
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
