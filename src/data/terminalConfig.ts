export interface Testimonial {
    author: string;
    role: string;
    company: string;
    content: string;
}

export interface TerminalConfig {
    yearsOfExperience: number;
    resumeLink: string;
    projectsCount: number;
    githubProfile: string;
    testimonials: Testimonial[];
    blogLink: string;
    faqs: Array<{
        question: string;
        answer: string;
    }>;
}

export const terminalConfig: TerminalConfig = {
    yearsOfExperience: 4,
    resumeLink: 'https://amorim.pro/resume.pdf',
    projectsCount: 50,
    githubProfile: 'https://github.com/yourusername',
    testimonials: [
        {
            author: "John Doe",
            role: "Tech Lead",
            company: "TechCorp",
            content: "Gabriel is an exceptional developer with great attention to detail."
        },
        {
            author: "Jane Smith",
            role: "Project Manager",
            company: "InnovateTech",
            content: "Working with Gabriel was a pleasure. His technical skills and communication are outstanding."
        }
    ],
    blogLink: 'https://amorim.pro/blog',
    faqs: [
        {
            question: "What technologies do you specialize in?",
            answer: "I specialize in Vue.js, TypeScript, and modern web development."
        },
        {
            question: "Are you available for freelance work?",
            answer: "Yes, I'm available for selective freelance projects."
        }
    ]
};
