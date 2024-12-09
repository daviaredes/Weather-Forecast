const api_key = "API KEY FROM https://www.weatherapi.com/"; 

// Seleciona os elementos HTML para exibir os dados
const cityInput = document.getElementById("cityInput"); // Elemento de entrada da cidade
const searchButton = document.getElementById("searchButton"); // Botão de pesquisa
const cityElement = document.getElementById("city"); // Elemento para exibir o nome da cidade
const countryElement = document.getElementById("country"); // Elemento para exibir o nome do país
const dateElement = document.getElementById("date"); // Elemento para exibir a data
const weatherIconElement = document.getElementById("weatherIcon"); // Elemento para exibir o ícone do tempo
const tempCElement = document.getElementById("tempC"); // Elemento para exibir a temperatura em Celsius
const tempFElement = document.getElementById("tempF"); // Elemento para exibir a temperatura em Fahrenheit
const descriptionElement = document.getElementById("description"); // Elemento para exibir a descrição do tempo
const humidityElement = document.getElementById("humidity"); // Elemento para exibir a umidade
const windElement = document.getElementById("wind"); // Elemento para exibir a velocidade do vento
const pressureElement = document.getElementById("pressure"); // Elemento para exibir a pressão atmosférica
const uvElement = document.getElementById("uv"); // Elemento para exibir o índice UV
const visibilityElement = document.getElementById("visibility"); // Elemento para exibir a visibilidade
const precipitationElement = document.getElementById("precipitation"); // Elemento para exibir a precipitação
const forecastDaysElement = document.getElementById("forecastDays"); // Elemento para exibir a previsão para os próximos dias


// Chama a função getWeatherData com "Rio de Janeiro" quando a página carrega
window.onload = () => getWeatherData("Rio de Janeiro"); // Carrega os dados do tempo para o Rio de Janeiro ao iniciar

// Adiciona um ouvinte de eventos ao botão de pesquisa
searchButton.addEventListener("click", getWeatherData); // Chama getWeatherData quando o botão é clicado


// Função principal para buscar dados meteorológicos
function getWeatherData(city = "Rio de Janeiro") {
    const cityName = cityInput.value.trim() || city; // Usa o valor da entrada ou a cidade padrão

    if (cityName === "") {
        alert("Por favor, insira o nome de uma cidade.");
        return; // Sai da função se a cidade estiver vazia
    }

    // URLs para buscar dados atuais e previsão
    const currentApiUrl = `https://api.weatherapi.com/v1/current.json?key=${api_key}&q=${cityName}&aqi=yes`; // URL para dados atuais
    const forecastApiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${api_key}&q=${cityName}&days=7&aqi=yes`; // URL para previsão do tempo

    // Usa Promise.all para buscar dados simultaneamente
    Promise.all([fetch(currentApiUrl), fetch(forecastApiUrl)])
        .then(responses => Promise.all(responses.map(res => res.json()))) // Converte as respostas para JSON
        .then(data => {
            displayWeatherData(data[0]); // Exibe os dados atuais
            displayForecastData(data[1]); // Exibe a previsão
        })
        .catch(error => {
            console.error("Erro ao buscar dados da API:", error);
            alert("Erro ao buscar dados meteorológicos. Verifique sua conexão com a internet e tente novamente."); // Mensagem de erro
        });
}

// Função para exibir os dados meteorológicos atuais
function displayWeatherData(data) {
    cityElement.textContent = data.location.name; // Define o nome da cidade
    countryElement.textContent = data.location.country; // Define o nome do país
    dateElement.textContent = new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }); // Define a data
    weatherIconElement.src = `https:${data.current.condition.icon}`; // Define o ícone do tempo
    tempCElement.textContent = data.current.temp_c; // Define a temperatura em Celsius
    tempFElement.textContent = data.current.temp_f; // Define a temperatura em Fahrenheit
    descriptionElement.textContent = data.current.condition.text; // Define a descrição do tempo
    humidityElement.textContent = `${data.current.humidity}%`; // Define a umidade
    windElement.textContent = `${data.current.wind_kph} km/h`; // Define a velocidade do vento
    pressureElement.textContent = `${data.current.pressure_mb} mb`; // Define a pressão atmosférica
    uvElement.textContent = data.current.uv; // Define o índice UV
    visibilityElement.textContent = `${data.current.vis_km} km`; // Define a visibilidade
    precipitationElement.textContent = `${data.current.precip_mm} mm`; // Define a precipitação
}

// Função para exibir a previsão para os próximos 7 dias
function displayForecastData(data) {
    forecastDaysElement.innerHTML = ''; // Limpa o conteúdo anterior

    //Tratamento de erros para dados inválidos
    if (!data.forecast || !data.forecast.forecastday) {
        console.error("Dados de previsão inválidos:", data);
        forecastDaysElement.innerHTML = "<p>Erro ao carregar a previsão do tempo.</p>";
        return;
    }

    const today = new Date();
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // Filtra apenas os dias futuros
    const futureDays = data.forecast.forecastday.filter(day => {
        const dayDate = new Date(day.date);
        return dayDate > todayDate;
    });

    //Tratamento de erro para previsão não disponível
    if (futureDays.length === 0) {
        forecastDaysElement.innerHTML = "<p>Previsão não disponível para os próximos dias.</p>";
        return;
    }

    // Obtém apenas os próximos 7 dias
    const next3Days = futureDays.slice(0, 7);
    if (next3Days.length === 0) {
        forecastDaysElement.innerHTML = "<p>Previsão não disponível para os próximos 7 dias.</p>";
        return;
    }


    // Cria a estrutura HTML para os próximos 7 dias
    next3Days.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.classList.add('forecast-day');

        const date = new Date(day.date);
        const formattedDate = date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

        dayElement.innerHTML = `
            <h3>${formattedDate}</h3>
            <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}" width="64" height="64">
            <p>Máx: ${day.day.maxtemp_c}°C</p>
            <p>Mín: ${day.day.mintemp_c}°C</p>
            <p>${day.day.condition.text}</p>
        `;
        forecastDaysElement.appendChild(dayElement);
    });
}