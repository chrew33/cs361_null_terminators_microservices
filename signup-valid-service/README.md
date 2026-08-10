# Rules for usernames
No shorter than 5 chars for usernames
No longer than 20 chars for usernames

# Rules for passwords
No shorter than 6 chars for passwords
No longer than 20 chars for passwords
Need 1 special character for password

# How to run this microservice
Send a http request with a body containing username and password. 
Both username and password must be strings!:
```
const dataToSend = {
    username: "john123",
    password: "mypassword123!"
}

const response = await fetch("http://localhost:6060/validate", {
    method: "Post",
    headers:{
        "Content-Type": "application/json"
    },
    body: JSON.stringify(dataToSend)
});
```

## How to receive data from this microservice
We do the following to obtain the json data:
```
const resultData = await response.json();
```


# Example Responses
*Success Response (Status 200):*

```json
{
    "valid": true,
    "message": "Username and password meet all conditions. User is elligible for signup!"
}



*Failure Response (Status 400):
{
    "valid": false,
    "messages": [
        "Username must be at least 5 characters long.",
        "Password must contain at least one special character"
    ]
}
