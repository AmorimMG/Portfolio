export const scrollToBottom = () => {
    setTimeout(() => {
        const terminal = document.querySelector('.p-terminal-content');
        if (terminal) {
            terminal.scrollTop = terminal.scrollHeight;
        }
    }, 100);
};
