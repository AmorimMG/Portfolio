const Endpoints = (instance) => ({
    Login: (data) => instance.post('Login/Logar', data),
    AlterarSenha: (data) => instance.post('Login/AlterarSenha', data),
    RecebeUsuario: (data) => instance.get(`Usuarios/Obter?id=${data}`, data),
    UsuarioCriar: (data) => instance.post('Usuarios/Inserir', data),
    UsuarioEditar: (data) => instance.post('Usuarios/Atualizar', data),
    UsuarioExcluir: (data) => instance.delete(`Usuarios/Excluir/${data}`),
    UsuarioObterTodos: () => instance.get('Usuarios/ObterTodos'),

    ObterSteam: (steamid, steamkey) => instance.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${steamkey}&format=json&steamids=${steamid}`),
    ObterDiscord: () => instance.get(`https://api.lanyard.rest/v1/users/257165295427256320`),
    ObterLastFM: (lastFMUsername, lastFMApiKey) => instance.get(`http://ws.audioscrobbler.com/2.0/?method=user.getWeeklyTrackChart&user=${lastFMUsername}&api_key=${lastFMApiKey}&format=json`)
});

export default Endpoints;
