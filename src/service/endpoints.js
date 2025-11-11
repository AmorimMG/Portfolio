const Endpoints = (instance) => ({
  ObterSteam: () => instance.get("steam"),
  ObterDiscord: () => instance.get("discord"),
  ObterLastFM: (lastFMUsername) =>
    instance.get("lastfm?", { params: { username: lastFMUsername } }),
  ObterUsuarioLastFM: (lastFMUsername) =>
    instance.get("lastfm/user?", { params: { username: lastFMUsername } }),
  EnviarEmail: (body) => instance.post("mail/send-email", body),
  ObterSpotify: () => instance.get("spotify"),
  ObterAnilist: (AnilistUsername) => instance.get(`anilist/${AnilistUsername}`),
  ObterGithub: (GithubUsername) =>
    instance.get(`github/contributions?username=${GithubUsername}`),

  Login: (data) => instance.post("auth/login", data),

  UsuarioCriar: (data) => instance.post("usuarios", data),
  UsuarioEditar: (data) => instance.put(`usuarios/${data._id}`, data),
  UsuarioExcluir: (data) => instance.delete(`usuarios/${data._id}`),
  UsuarioObterTodos: () => instance.get("usuarios"),

  ProjetoCriar: (data) => instance.post("Projetos", data),
  ProjetoEditar: (data) => instance.put("Projetos", data),
  ProjetoExcluir: (data) => instance.delete(`Projetos/${data}`),
  ProjetoObterTodos: () => instance.get("Projetos"),

  LinguagemCriar: (data) => instance.post("linguagens", data),
  LinguagemEditar: (data) => instance.put(`linguagens/${data._id}`, data),
  LinguagemExcluir: (data) => instance.delete(`linguagens/${data}`),
  LinguagemObterTodos: () => instance.get("linguagens"),

  ImagemCriar: (data) => instance.post("imagens", data),
  ImagemEditar: (data) => instance.put(`imagens/${data._id}`, data),
  ImagemExcluir: (data) => instance.delete(`imagens/${data}`),
  ImagemObterTodos: () => instance.get("imagens"),

  IA: (data) => instance.post("Chat/send", data),
  RecebeIconeJogo: (data) => instance.get(`igdb/exact-game?name=${data}`),
});

export default Endpoints;
