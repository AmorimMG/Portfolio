import axios from 'axios';

const CAT_API_URL = 'https://api.thecatapi.com/v1';
const WEATHER_API_URL = 'http://api.weatherapi.com/v1/';
const AI_API_URL = 'https://api.aimlapi.com/chat/completions';

const weatherKey = '254d6ff9bc1946cebd8191443241707';
const cidade = 'Belo Horizonte';
const aiKey = '79a2db82b84c4965aca4fe1bab5074f6';

export const PhotoService = {
    async getImages() {
        try {
            const response = await axios.get(`${CAT_API_URL}/images/search?limit=10`);
            return response.data;
        } catch (error) {
            console.error('Error fetching images:', error);
            throw error;
        }
    }
};

export const WeatherService = {
    async getWeather() {
        try {
            const response = await axios.get(`${WEATHER_API_URL}/current.json?key=${weatherKey}&q=${cidade}&aqi=no`);
            return response.data;
        } catch (error) {
            console.error('Error fetching weather data:', error);
            throw error;
        }
    }
};

export const AIService = {
    async sendMessage(messageToSend) {
        try {
            const response = await axios.post(
                AI_API_URL,
                {
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'user',
                            content: messageToSend
                        }
                    ],
                    max_tokens: 512,
                    stream: false
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${aiKey}`
                    }
                }
            );
            return response.data.choices[0].message.content.trim();
        } catch (error) {
            console.error('Error fetching AI response:', error);
            throw error;
        }
    }
};