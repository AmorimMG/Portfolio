import axios from "axios";

const CAT_API_URL = "https://api.thecatapi.com/v1";
const WEATHER_API_URL = "http://api.weatherapi.com/v1/";
const AI_API_URL = "https://api.gemini.google.com/v1/completions";

const weatherKey = "254d6ff9bc1946cebd8191443241707";
const cidade = "Belo Horizonte";
const aiKey = "AIzaSyBRHSxc4TU3LwslUKW0WfXS8_EwKO8hbVw"; // Replace with your actual Gemini API key

const context = "You are a helpful and informative AI assistant."; // Define your desired context

export const PhotoService = {
	async getImages() {
		try {
			const response = await axios.get(`${CAT_API_URL}/images/search?limit=10`);
			return response.data;
		} catch (error) {
			console.error("Error fetching images:", error);
			throw error;
		}
	},
};

export const WeatherService = {
	async getWeather() {
		try {
			const response = await axios.get(
				`${WEATHER_API_URL}/current.json?key=${weatherKey}&q=${cidade}&aqi=no`,
			);
			return response.data;
		} catch (error) {
			console.error("Error fetching weather data:", error);
			throw error;
		}
	},
};

export const ValorantService = {
	async getValorant() {
		try {
			const response = await axios.get(
				"https://api.tracker.gg/api/v2/valorant/standard/profile/riot/Amorim%23nx0?forceCollect=true",
			);
			return response.data;
		} catch (error) {
			console.error("Error fetching valorant data:", error);
			throw error;
		}
	},
};

export const AIService = {
	async sendMessage(messageToSend) {
		try {
			const response = await axios.post(
				AI_API_URL,
				{
					model: "gemini-1.5-pro-exp-0827",
					messages: [
						{
							role: "system",
							content: context,
						},
						{
							role: "user",
							content: messageToSend,
						},
					],
					max_tokens: 512,
					stream: false,
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${aiKey}`,
					},
				},
			);
			return response.data.choices[0].message.content.trim();
		} catch (error) {
			console.error("Error fetching AI response:", error);
			throw error;
		}
	},
};
