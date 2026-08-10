import requests
import time

# WEIGHT TESTING

first_json_data = {
    "unit": "kg",
    "value": 100.0
}

response = requests.get('http://127.0.0.1:5000/weight',
                        json=first_json_data)
response.raise_for_status()
print(response.json())

second_json_data = {
    "unit": "lb",
    "value": response.json().get('result')
}

response = requests.get('http://127.0.0.1:5000/weight',
                        json=second_json_data)
response.raise_for_status()
print(response.json())

if f"{float(response.json().get('result')):.3f}" != \
        f"{first_json_data['value']:.3f}":
    print('Error: Conversion failed. KG->LB->KG did not return the original '
          'value within 3 decimal places. Original: '
         f'{first_json_data["value"]}. Converted: '
         f'{float(response.json().get('result')):.3f}')


# TEMPERATURE TESTING

first_temperature_json_data = {
    "unit": "f",
    "value": 212
}

response = requests.get('http://127.0.0.1:5000/temperature',
                        json=first_temperature_json_data)
response.raise_for_status()
print(response.json())

second_temperature_json_data = {
    "unit": "c",
    "value": response.json().get('result')
}

response = requests.get('http://127.0.0.1:5000/temperature',
                        json=second_temperature_json_data)
response.raise_for_status()
print(response.json())

if f"{float(response.json().get('result')):.3f}" != \
        f"{first_json_data['value']:.3f}":
    print('Error: Conversion failed. F->C->F did not return the original '
          'value within 3 decimal places. Original: '
         f'{first_json_data["value"]}. Converted: '
         f'{float(response.json().get('result')):.3f}')


## PRECIP TESTING

first_precip_data = {
    "unit": "mm",
    "value": 100
}

response = requests.get('http://127.0.0.1:5000/precipitation',
                        json=first_precip_data)
response.raise_for_status()
print(f"THIS IS PRECIP TEST 1{response.json()}")

second_precip_data = {
    "unit": "in",
    "value": 30
}

response = requests.get('http://127.0.0.1:5000/precipitation',
                        json=second_precip_data)
response.raise_for_status()
print(f"THIS IS PRECIP TEST 2{response.json()}")