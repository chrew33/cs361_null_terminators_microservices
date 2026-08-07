# basic-math-service


## How to send data
This example is primarily using JavaScript. I recommend having an array object
carry the values you want to calculate. Then, you want to create another variable to hold the JSON data (ex. `dataToSend`).

Here is what I recommend:
```
const someArray = [1,2,3,4,5]

const dataToSend = {
    operator: "addition",
    values: someArray
}
```

Here I use fetch() to send the data through a POST request:
```
response = await fetch("http://localhost:5050/api/math", {
    method: "Post",
    headers:{
        "Content-Type": "application/json"
    },
    body: JSON.stringify(dataToSend)
});
```
NOTICE the `JSON.stringify()` is used on the `dataToSend`!


## How to receive the data
Assuming you did the above code or something similar, the next step is to obtain the reponse data sent by the service. 

We do the following to obtain the json data:
```
const resultData = await response.json();
```

The resultData should look something like this:
```
{result: 15}
```