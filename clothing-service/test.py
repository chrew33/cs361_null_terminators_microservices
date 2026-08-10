import requests

temp = 20
precipitation = 50

response = requests.get(f'http://127.0.0.1:4000/clothing?temp={temp}&'
                        f'precipitation={precipitation}')
response.raise_for_status()
print(response.json())