const Endpoints = (instance) => ({
    ObterSteam: () => instance.get('steam'),
    ObterDiscord: () => instance.get('discord'),
    ObterLastFM: (lastFMUsername) => instance.get(`lastfm?username=${lastFMUsername}`),
    EnviarEmail: (body) => instance.post('mail/send-email', body),
});

export default Endpoints;
