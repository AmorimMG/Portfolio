<script setup>
import TerminalService from 'primevue/terminalservice';
import { computed, onBeforeUnmount, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import CardEffect from '../CardEffect.vue';

const { t } = useI18n();

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
        'funfact'
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
});

onBeforeUnmount(() => {
    TerminalService.off('command', commandHandler);
});
</script>

<template>
    <div id="Terminal" class="col-4 lg:col-4 xl:col-4 pb-0">
        <CardEffect>
            <div class="terminal-card" style="width: 100%; height: 100%; padding: 0">
                <Terminal :welcomeMessage="'Welcome to Amorim. ' + 'Type \'help\' for commands'"
                    prompt="portfolio@amorim:~$ " aria-label="PrimeVue Terminal Service" />
            </div>
        </CardEffect>
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
    background: var(--surface-card);
    border-radius: 12px;
}
</style>
