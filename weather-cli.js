const inputArgs = process.argv;

function registerFlagValue(inputArgs, flagName, flagValue, userData) { // функция, которая присваивает полям объекта userData данные, введенные пользователем через аргументы.
    const flagIndex = inputArgs.indexOf(flagValue.flag)
    if (flagIndex > 0 && flagValue.requiredArg) {
        userData[flagName] = inputArgs[flagIndex + 1];
        return;
    }
    if (flagIndex > 0) {
        userData[flagName] = true;
    }
}

function getFlagValues(inputArgs, flagsConfig, userData) {
    const flagsArray = Object.entries(flagsConfig);
    flagsArray.forEach((flagData) => {
        const [flagName, flagValue] = flagData;
        registerFlagValue(inputArgs, flagName, flagValue, userData);
    });
}

const getData = async (userData) => {
    try {
        const {city, token} = userData;
        const fetch = require("node-fetch");
        const res = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${token}&q=${city}&lang=ru`
        );
        if (res.ok) {
            return await res.json();
        } else throw new Error('Не удалось получить данные');
    } catch (e) {
        console.log(e.message);
    }
};

const getWeatherData = (data) => {
    const date = data.location.localtime;
    const text = data.current.condition.text;
    const temp = data.current.temp_c;
    const city = data.location.name;
    return `Погода в ${city} на ${date} : ${temp} градусов по Цельсию, ${text}`;
};

const getWeather = async (inputArgs) => {

    let userData = {};
    const fs = require("fs");

    if (fs.existsSync("weather_config.json")) {
        userData = JSON.parse(fs.readFileSync("./weather_config.json", "utf-8"))
    }

    const flagsConfig = {
        city: {
            flag: '-s',
            requiredArg: true,
            name: 'city',
        },
        token: {
            flag: '-t',
            requiredArg: true,
            name: 'token',
        },
    };

    if (inputArgs.length > 2) {
        getFlagValues(inputArgs, flagsConfig, userData);
    }

    if (userData.city && userData.token) {
        getData(userData).then((data) => {
            console.log(getWeatherData(data));
        })
    } else {
        console.log("Ошибка! Недостаточно данных для отправки запроса. Для вызова справки запустите программу с флагом -h")
    }
};

getWeather(inputArgs);