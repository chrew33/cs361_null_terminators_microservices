const express = require("express");
const app = express();
const PORT = 6060;

// Enable JSON middleware
app.use(express.json());

// The main endpoint to choose which functions to use for calculations
app.post("/validate", (req, res) => {

    const {username, password} = req.body;

    const errorMessage = []

    // Validation of username
    if (!username) {
        errorMessage.push("Missing Username")
    } else{
        if (username.length < 5) {
            errorMessage.push("Username must be at least 5 characters long.")
        }

        if (username.length > 20) {
            errorMessage.push("Username must be at most 20 characters long.")
        }
    }

    // Validation of password
    if (!password) {
        errorMessage.push("Missing Password")
    } else {
        if (password.length < 6) {
            errorMessage.push("Password must be at least 6 characters long.")
        }

        if (password.length > 20) {
            errorMessage.push("Password must be at most 20 characters long.")
        }

        if (!hasSpecialChar(password)) {
            errorMessage.push("Password must contain at least one special character")
        }
    }

    // if there are error messages, the validation is false
    if (errorMessage.length > 0) {
        return res.status(400).json({
            valid: false,
            messages: errorMessage
        })
    }

    // only possible if no error messages in the errorMessage list
    return res.status(200).json({
        valid: true,
        message: "Username and password meet all conditions. User is elligible for signup!"
    })


});

// function to check if password has special char

function hasSpecialChar(password){
    const specialChars = "!@#$%^&*()_+-=[]{}|;:'\",.<>/?";

    for (const char of password){
        if (specialChars.includes(char)) {
            return true;
        }
    }
    return false;
}

// Start listening on port 6060
app.listen(PORT, () => {
  console.log(`Microservice running at http://localhost:${PORT}`);
});