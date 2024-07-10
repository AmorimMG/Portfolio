const Endpoints = (instance) => ({
    ObterSteam: () => instance.get('steam'),
    ObterDiscord: () => instance.get('discord'),
    ObterLastFM: (lastFMUsername) => instance.get('lastfm?', { params: { username: lastFMUsername } }),
    EnviarEmail: (body) => instance.post('mail/send-email', body),
    ObterSpotify: () => instance.get('spotify'),
    ObterAnilist: (AnilistUsername) => instance.get(`anilist/${AnilistUsername}`),
    ObterGithub: (GithubUsername) => instance.get(`github/commits/${GithubUsername}`),

    Login: (data) => instance.post('login', data),

    UsuarioCriar: (data) => instance.post('Usuarios/Inserir', data),
    UsuarioEditar: (data) => instance.put('Usuarios/Atualizar', data),
    UsuarioExcluir: (data) => instance.delete(`Usuarios/Excluir/${data}`),
    UsuarioObterTodos: () => instance.get('Usuarios/ObterTodos'),

    LinguagemCriar: (data) => instance.post('Linguagem/Inserir', data),
    LinguagemEditar: (data) => instance.put('Linguagem/Atualizar', data),
    LinguagemExcluir: (data) => instance.delete(`Linguagem/Excluir/${data}`),
    LinguagemObterTodos: () => instance.get('Linguagem/ObterTodos'),
});

export default Endpoints;
