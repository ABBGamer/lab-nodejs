const axios = require('axios');
const GL_API = 'http://ip-api.com/json/';
const W_API = ''

const getGeoLocation = async () => {
    const response = await axios.get(GL_API);
    return response.data;
}

const getWeather = async () => {
    const {city} = await getGeoLocation();
    const WeatherURI = W_API + '&q=' + city;
    const response = await axios.get(WeatherURI);
    const {name, main: {temp}} = response.data;
    console.log(name, Math.round(temp - 273));
}

getWeather().then(() => {
    console.log("Finish")
})