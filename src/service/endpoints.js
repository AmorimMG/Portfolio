const Endpoints = (instance) => ({
    ObterSteam: () => instance.get('steam'),
    ObterDiscord: () => instance.get('discord'),
    ObterLastFM: (lastFMUsername) => instance.get('lastfm?', { params: { username: lastFMUsername } }),
    EnviarEmail: (body) => instance.post('mail/send-email', body),
    ObterSpotify: () => instance.get('spotify'),
    ObterAnilist: (AnilistUsername) => instance.get(`anilist/${AnilistUsername}`),
    ObterGithub: (GithubUsername) => instance.get(`github/contributions?username=${GithubUsername}`),

    Login: (data) => instance.post('login', data),

    UsuarioCriar: (data) => instance.post('Usuarios/Inserir', data),
    UsuarioEditar: (data) => instance.put('Usuarios/Atualizar', data),
    UsuarioExcluir: (data) => instance.delete(`Usuarios/${data}`),
    UsuarioObterTodos: () => instance.get('Usuarios'),

    ProjetoCriar: (data) => instance.post('Projetos', data),
    ProjetoEditar: (data) => instance.put('Projetos', data),
    ProjetoExcluir: (data) => instance.delete(`Projetos/${data}`),
    ProjetoObterTodos: () => instance.get('Projetos'),

    LinguagemCriar: (data) => instance.post('Linguagem', data),
    LinguagemEditar: (data) => instance.put('Linguagem', data),
    LinguagemExcluir: (data) => instance.delete(`Linguagem/${data}`),
    LinguagemObterTodos: () => instance.get('Linguagem/ObterTodos')
});

export default Endpoints;
