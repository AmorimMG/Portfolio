export const fileSystem = {
    '/': {
        type: 'dir',
        contents: {
            'home': {
                type: 'dir',
                contents: {
                    'documents': {
                        type: 'dir',
                        contents: {
                            'resume.md': {
                                type: 'file',
                                content: 'Meu currículo detalhado'
                            },
                            'skills.md': {
                                type: 'file',
                                content: 'Minhas habilidades técnicas'
                            }
                        }
                    },
                    'projects': {
                        type: 'dir',
                        contents: {
                            'portfolio': {
                                type: 'dir',
                                contents: {
                                    'README.md': {
                                        type: 'file',
                                        content: 'Meu portfólio pessoal'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
