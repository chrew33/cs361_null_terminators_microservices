import requests
import time

first_json_data = {
    "unit": "kg",
    "value": 200.0
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
