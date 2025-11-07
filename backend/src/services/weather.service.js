import axios from 'axios';

export const getWeatherData = async () => {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    // const cityId = process.env.CITY_ID;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=21.0285&lon=105.8342&appid=${apiKey}&units=metric`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        throw error;
    }
};