<script setup>
import { terminalConfig } from '@/data/terminalConfig';
import {
    clearTerminal,
    commands,
    executeCommand
} from '@/service/TerminalCommandsService';
import { useFileSystemStore } from '@/stores/useFileSystemStore';
import AnsiToHtml from 'ansi-to-html';
import TerminalService from 'primevue/terminalservice';
import { computed, onBeforeUnmount, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import CardEffect from '../../CardEffect.vue';
import { neofetchOutput } from './neofetch';

const { t } = useI18n();
const locale = useI18n().locale;
const fileSystemStore = useFileSystemStore();

// Configurar ansi-to-html para processar códigos ANSI
const ansiToHtml = new AnsiToHtml({ 
    escapeXML: false,
    stream: false
});

// Função para processar respostas com códigos ANSI
const processAnsiResponse = (response) => {
    if (typeof response === 'string' && response.includes('\u001b[')) {
        // Se a resposta contém códigos ANSI, vamos processá-la
        setTimeout(() => {
            const terminalContent = document.querySelector('.p-terminal-command-list');
            if (terminalContent) {
                const commands = terminalContent.querySelectorAll('[data-pc-section="commands"]');
                const lastCommandContainer = commands[commands.length - 1];
                if (lastCommandContainer) {
                    // Aguarda um pouco mais para garantir que o elemento foi criado
                    setTimeout(() => {
                        const responseElement = lastCommandContainer.querySelector('[data-pc-section="response"]');
                        if (responseElement) {
                            responseElement.innerHTML = ansiToHtml.toHtml(response);
                        }
                    }, 50);
                }
            }
        }, 100);
        
        // Retorna a string limpa para evitar exibição dupla
        return response.replace(/\u001b\[[0-9;]*m/g, '');
    }
    return response;
};

const props = defineProps({
    isCard: {
        type: Boolean,
        default: true
    }
});

// Prompt dinâmico que mostra o diretório atual
const terminalPrompt = computed(() => {
    const currentPath = fileSystemStore.currentPath;
    const shortPath = currentPath.replace('/home/amorim', '~');
    return `portfolio@amorim:${shortPath}$ `;
});

const changeLanguage = (lang) => {
    locale.value = lang;
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

    const args = text.split(' ').filter(arg => arg);
    const cmd = args[0]?.toLowerCase();

    // Comandos do sistema (Unix-like)
    const systemCommands = Object.keys(commands);
    
    // Comandos do portfólio
    const portfolioCommands = [
        'help', 'about', 'skills', 'projects', 'education', 'experience',
        'contact', 'resume', 'social', 'interests', 'achievements', 'blog',
        'recommendations', 'FAQ', 'stats', 'connect', 'portfolio', 'feedback',
        'hire', 'funfact', 'neofetch', 'languages', 'pt', 'es', 'en'
    ];
    
    const commandLabels = [...systemCommands, ...portfolioCommands];

    switch (cmd) {
        case 'help':
            response = `Available commands:

System Commands (Unix-like):
${systemCommands.join(', ')}

Portfolio Commands:
${portfolioCommands.join(', ')}

Try 'ls' to list files, 'cd' to navigate, or 'cat filename' to read files.
Use 'tree' to see directory structure.`;
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
        case 'languages':
            response = computed(() => t('Terminal.Languages'));
            break;
        case 'pt':
            changeLanguage('pt');
            response = computed(() => t('Terminal.LanguageChanged', { language: 'Português' }));
            break;
        case 'es':
            changeLanguage('es');
            response = computed(() => t('Terminal.LanguageChanged', { language: 'Español' }));
            break;
        case 'en':
            changeLanguage('en');
            response = computed(() => t('Terminal.LanguageChanged', { language: 'English' }));
            break;
        // Comandos do sistema de arquivos
        case 'ls':
        case 'cd':
        case 'pwd':
        case 'cat':
        case 'mkdir':
        case 'touch':
        case 'rm':
        case 'find':
        case 'file':
        case 'wc':
        case 'tree':
            response = executeCommand(text);
            break;
        default:
            response = `Unknown command: ${command}`;
    }

    if (response) {
        const processedResponse = processAnsiResponse(response);
        TerminalService.emit('response', processedResponse);
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
        <CardEffect class="card-effect" v-if="props.isCard">
            <div class="terminal-card" style="width: 100%; height: 100%; padding: 0">
                <Terminal :welcomeMessage="'Welcome to Amorim Terminal. ' + 'Type \'help\' for portfolio commands or try Unix commands like \'ls\', \'cd\', \'cat\''"
                    :prompt="terminalPrompt" aria-label="PrimeVue Terminal Service" />
            </div>
        </CardEffect>
        <div v-else class="terminal-modal" style="width: 100%; height: 100%; padding: 0">
            <Terminal :welcomeMessage="'Welcome to Amorim Terminal. ' + 'Type \'help\' for portfolio commands or try Unix commands like \'ls\', \'cd\', \'cat\''"
                :prompt="terminalPrompt" aria-label="PrimeVue Terminal Service" />
        </div>
    </div>
</template>
<style scoped>
.p-terminal {
    font-size: calc(var(--scale) + 2px) !important;
    border: none !important;
    border-radius: none !important;
    white-space: pre-line;
    overflow: hidden !important;
    height: 100% !important;
}

.p-terminal-command {
    white-space: pre-line;
}

.p-terminal .p-terminal-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 0;
}

.p-terminal .p-terminal-input {
    font-size: calc(var(--scale) + 2px) !important;
}

.card-effect {
    aspect-ratio: 2/1;
    width: 100%;
    height: auto;
}

.terminal-card {
    background: rgba(155, 89, 182, 0.15);
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.terminal-card>.p-terminal {
    background: var(--card-background) !important;
    color: white;
    border: none;
    height: 100%;
    overflow: hidden;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.terminal-modal {
    background: rgba(155, 89, 182, 0.15);
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Estilos para suporte a cores ANSI */
.p-terminal [data-pc-section="response"] {
    white-space: pre-wrap;
    font-family: monospace;
}

/* Cores ANSI para diretórios (azul) */
.p-terminal [data-pc-section="response"] .ansi-blue {
    color: #5555ff;
    font-weight: bold;
}

/* Garantir que o HTML seja renderizado */
.p-terminal [data-pc-section="response"] * {
    color: inherit;
}
</style>
