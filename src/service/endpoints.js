const Endpoints = (instance) => ({
    ObterSteam: () => instance.get('steam'),
    ObterDiscord: () => instance.get('discord'),
    ObterLastFM: (lastFMUsername) => instance.get('lastfm?', { params: { username: lastFMUsername } }),
    ObterUsuarioLastFM: (lastFMUsername) => instance.get('lastfm/user?', { params: { username: lastFMUsername } }),
    EnviarEmail: (body) => instance.post('mail/send-email', body),
    ObterSpotify: () => instance.get('spotify'),
    ObterAnilist: (AnilistUsername) => instance.get(`anilist/${AnilistUsername}`),
    ObterGithub: (GithubUsername) => instance.get(`github/contributions?username=${GithubUsername}`),

    Login: (data) => instance.post('auth/login', data),

    UsuarioCriar: (data) => instance.post('usuarios', data),
    UsuarioEditar: (data) => instance.put(`usuarios/${data._id}`, data),
    UsuarioExcluir: (data) => instance.delete(`usuarios/${data._id}`),
    UsuarioObterTodos: () => instance.get('usuarios'),

    ProjetoCriar: (data) => instance.post('Projetos', data),
    ProjetoEditar: (data) => instance.put('Projetos', data),
    ProjetoExcluir: (data) => instance.delete(`Projetos/${data}`),
    ProjetoObterTodos: () => instance.get('Projetos'),

    LinguagemCriar: (data) => instance.post('linguagens', data),
    LinguagemEditar: (data) => instance.put(`linguagens/${data._id}`, data),
    LinguagemExcluir: (data) => instance.delete(`linguagens/${data}`),
    LinguagemObterTodos: () => instance.get('linguagens'),

    IA: (data) => instance.post('Chat/send', data)
});

export default Endpoints;
