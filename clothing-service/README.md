This microservice takes GET requests to /clothing with query
parameters 'temp' and 'precipitation', which are the temperature
in Fahrenheit and the percent chance of precipitation. It returns
a suggestion of what to wear outside for that weather.

Here is an example query using Python:

import requests

temp = 20
precipitation = 50

response = requests.get(f'http://127.0.0.1:4000/clothing?temp={temp}&'
                        f'precipitation={precipitation}')

response.raise_for_status()
print(response.json())

The output of this code is:
{'recommendation': ['Winter Coat', 'Warm Layers']}
