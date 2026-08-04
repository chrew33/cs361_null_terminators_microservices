This microservice handles queries to a username / password database. It accepts both registration and login requests.
Registration requests will return a response code of 201 with a value of "True" in JSON format when a user enters a
valid username and password and the username is not already taken. Otherwise, a response of 409 with a value of
"False" in JSON will be returned.
Login requests will return a response code of 200 with a value of "True" in JSON format when a user enters a
username and password combination that is in the database. Otherwise, a response of 401 with a value of
"False" in JSON will be returned.

#############################
Example Registration Request:
#############################

import requests

url =

json_data = {
  "username" : username
  "password" : password
}

response = requests.post(url, json=json_data)

#############################
Example Registration Receive (continued from Request):
#############################

if response.status_code == '201':
  print('Success!')
elif response.status_code == '409':
  print('Username is already taken, please try a different username')
else:
  print('Server error, please try again later')

#############################
Example Login Request:
#############################

import requests

url =

json_data = {
  "username" : username
  "password" : password
}

response = requests.post(url, json=json_data)

#############################
Example Login Receive (continued from Request):
#############################

if response.status_code == '200':
  print('Success!')
elif response.status_code == '401':
  print('Invalid username or password')
else:
  print('Server error, please try again later')

<img width="857" height="528" alt="image" src="https://github.com/user-attachments/assets/f8792acd-559f-4e70-8399-de431cab62a4" />

