const express = require("express");
const app = express();
const PORT = 5050;

// Enable JSON middleware
app.use(express.json());

// The main endpoint to choose which functions to use for calculations
app.post("/api/math", (req, res) => {

    const {operator, values} = req.body;

    if (!isValidValues(values)) {
        return res.status(400).json(
            {
                error: "values must be an array with 2 or more numbers. Also, check if each value is a number."
            }
        )
    }

    let result;

    switch (operator) {
        case "addition":
            result = addfunc(values);
            break;

        case "subtraction":
            result = subfunc(values);
            break;

        case "multiplication":
            result = multfunc(values);
            break;

        case "division":
            result = divfunc(values);
            break;

        // if none of the switch cases worked, it was an unsupported operator
        default:
            return res.status(400).json(
                {
                error: "Unsupported Operator, please make 'operator' either of these: 'addition', 'subtraction', 'multiplication', or 'division'"
                }
            )
    }

    // if the result is a String, it is an error message
    if (typeof result === "string"){
        return res.status(400).json(
            {
                error: `${result}`
            }
        )
    }

    // return the result
    return res.status(200).json(
        {
            result: result
        }
    )
});

// checking function for values array
function isValidValues(values){
    // make sure values is an array and has atleast 2 numbers
    if (!Array.isArray(values) || values.length < 2){
        return false
    }
    // make sure each value in values array is a number
    for (const value of values) {
        if (typeof value !== "number" || Number.isNaN(value)){
            return false
        }
    }

    return true
}



// the math functions

function addfunc(values){
    let result = values[0];
    for (let i = 1; i < values.length; i++){
        result += values[i];
    }
    return result;
}

function subfunc(values){
    let result = values[0];
    for (let i = 1; i < values.length; i++){
        result -= values[i];
    }
    return result;
}

function multfunc(values){
    let result = values[0];
    for (let i = 1; i < values.length; i++){
        result *= values[i];
    }
    return result;
}

function divfunc(values){
    let result = values[0];

    for (let i = 1; i < values.length; i++){
        // Check to see if dividing by zero
        if (values[i] === 0){
            // return a string message
            return "error: Cannot divide by zero"
        }
        result /= values[i];
    }
    return result;
}


// Start listening on port 5050
app.listen(PORT, () => {
  console.log(`Microservice running at http://localhost:${PORT}`);
});