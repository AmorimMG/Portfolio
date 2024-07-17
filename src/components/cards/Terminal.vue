<script setup>
import { onBeforeUnmount, onMounted } from 'vue';
import TerminalService from 'primevue/terminalservice';

const commandHandler = (text) => {
    let response;
    let argsIndex = text.indexOf(' ');
    let command = argsIndex !== -1 ? text.substring(0, argsIndex) : text;

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
            response = 'Commands are: ' + commandLabels.join(', ');
            break;
        case 'clear':
            clearTerminal();
            TerminalService.emit('clear');
            response = '';
            break;
        case 'about':
            response = 'I am a passionate individual with a strong interest in technology.';
            break;
        case 'skills':
            response = 'I have proficiency in several programming languages, including JavaScript, Python, and Java.';
            break;
        case 'projects':
            response = 'I have worked on numerous projects, ranging from web development to machine learning applications.';
            break;
        case 'education':
            response = 'I hold a degree in Computer Science from XYZ University.';
            break;
        case 'experience':
            response = 'I have several years of experience working as a software developer in various industries.';
            break;
        case 'contact':
            response = 'You can reach me via email at example@example.com.';
            break;
        case 'resume':
            response = 'You can download my resume from the following link: [resume_link].';
            break;
        case 'social':
            response = 'You can connect with me on LinkedIn, Twitter, and GitHub.';
            break;
        case 'interests':
            response = 'Apart from technology, I enjoy traveling, photography, and playing musical instruments.';
            break;
        case 'achievements':
            response = 'I have received several awards for my contributions to projects and initiatives.';
            break;
        case 'blog':
            response = 'You can read my latest blog posts on [blog_link].';
            break;
        case 'recommendations':
            response = 'Here are some testimonials from my colleagues: [testimonial_1], [testimonial_2].';
            break;
        case 'FAQ':
            response = 'Here are some frequently asked questions along with their answers: [FAQs].';
            break;
        case 'stats':
            response = 'I have completed [number_of_projects] projects and have [years_of_experience] years of experience.';
            break;
        case 'connect':
            response = "Let's connect on LinkedIn: [LinkedIn_link].";
            break;
        case 'portfolio':
            response = 'You can view my portfolio at [portfolio_link].';
            break;
        case 'feedback':
            response = 'Your feedback is valuable to me. Please feel free to share your thoughts.';
            break;
        case 'hire':
            response = "I am available for freelance opportunities. Let's discuss how I can help with your project.";
            break;
        case 'funfact':
            response = 'Did you know that I once climbed Mount Everest? (Just kidding!)';
            break;
        default:
            response = 'Unknown command: ' + command;
    }

    TerminalService.emit('response', response);
};

const clearTerminal = () => {
    const terminalContent = document.querySelector('.p-terminal-content');
    const commandSections = terminalContent.querySelectorAll('[data-pc-section="commands"]');
    commandSections.forEach((section) => {
        section.remove();
    });
};

onMounted(() => {
    TerminalService.on('command', commandHandler);
});

onBeforeUnmount(() => {
    TerminalService.off('command', commandHandler);
});
</script>

<template>
<div id="Terminal" class="col-12 lg:col-12 xl:col-6">
    <div style="width: 100%; height: 100%px">
        <Terminal :welcomeMessage="'Welcome to Amorim. ' + 'Type \'help\' for commands'" prompt="portfolio@amorim:~$ " aria-label="PrimeVue Terminal Service" />
    </div>
</div>
</template>
