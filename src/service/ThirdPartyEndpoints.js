import axios from 'axios';

const CAT_API_URL = 'https://api.thecatapi.com/v1';
const WEATHER_API_URL = 'http://api.weatherapi.com/v1/';
const weatherKey = '254d6ff9bc1946cebd8191443241707';
const cidade = 'Belo Horizonte';

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

export const ValorantService = {
    async getValorant() {
        try {
            const response = await axios.get('https://api.tracker.gg/api/v2/valorant/standard/profile/riot/Amorim%23nx0?forceCollect=true');
            return response.data;
        } catch (error) {
            console.error('Error fetching valorant data:', error);
            throw error;
        }
    }
};
