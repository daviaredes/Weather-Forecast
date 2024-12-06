import requests
import datetime

api_key = "API KEY FROM https://www.weatherapi.com/"

city = "Rio de Janeiro"
country = "BR"

now = datetime.datetime.now()

dias_da_semana = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"]

num_dias = 7

base_url = f"https://api.weatherapi.com/v1/forecast.json?key={api_key}&q={city},{country}&days={num_dias}"
response = requests.get(base_url)

if response.status_code == 200:
    data = response.json()
    forecasts = data['forecast']['forecastday']

    today_forecast = forecasts[0]
    today_date = today_forecast['date']

    hourly_forecasts = today_forecast['hour']

    for hourly_forecast in hourly_forecasts:
        hour_forecast = datetime.datetime.strptime(hourly_forecast['time'], '%Y-%m-%d %H:%M').hour
        if hour_forecast == now.hour:
            temp_c = hourly_forecast['temp_c']
            temp_f = hourly_forecast['temp_f']
            condition_text = hourly_forecast['condition']['text']
            print(f"Previsão para hoje, {today_date}, {now.hour}h em {city}:\n Temperatura: {temp_c}°C ({temp_f}°F)\n Condição do céu: {condition_text}")
            print()
            break
        
    escolha = input("Digite C para Celsius, F para Fahrenheit ou A para Ambos: ").upper()

    for i, forecast in enumerate(forecasts):
        date = forecast['date']

        data_datetime = datetime.datetime.strptime(date, "%Y-%m-%d")
        dia_da_semana = dias_da_semana[data_datetime.weekday()]
        temp_c_max = forecast['day']['maxtemp_c']
        temp_c_min = forecast['day']['mintemp_c']
        temp_c_avg = forecast['day']['avgtemp_c']
                                
        temp_f_max = forecast['day']['maxtemp_f']  
        temp_f_min = forecast['day']['mintemp_f'] 
        temp_f_avg = forecast['day']['avgtemp_f'] 
        condition_text = forecast['day']['condition']['text']

        print(f"Previsão para {dia_da_semana}, {date}:")

        if escolha == "C":
            print(f"Temperatura máxima: {temp_c_max}°C\nTemperatura mínima: {temp_c_min}°C\nTemperatura média: {temp_c_avg}°C\nCondição do céu: {condition_text}")
        elif escolha == "F":
            print(f"Temperatura máxima: {temp_f_max}°F\nTemperatura mínima: {temp_f_min}°F\nTemperatura média: {temp_f_avg}°F\nCondição do céu: {condition_text}")
        elif escolha == "A":
            print(f"Temperatura máxima: {temp_c_max}°C ({temp_f_max}°F)\nTemperatura mínima: {temp_c_min}°C ({temp_f_min}°F)\nTemperatura média: {temp_c_avg}°C ({temp_f_avg}°F)\nCondição do céu: {condition_text}")
        else:
            print("Opção inválida.")

        print()
else:
    print(f"Erro na requisição: {response.status_code}")
