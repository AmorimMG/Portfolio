const Endpoints = (instance) => ({
    ObterSteam: () => instance.get('steam'),
    ObterDiscord: () => instance.get('discord'),
    ObterLastFM: (lastFMUsername) => instance.get('lastfm?', { params: { username: lastFMUsername } }),
    EnviarEmail: (body) => instance.post('mail/send-email', body),
    ObterSpotify: () => instance.get('spotify'),
    ObterAnilist: (AnilistUsername) => instance.get(`anilist/${AnilistUsername}`),
});

export default Endpoints;
