import express from 'express';
const app = express();
const PORT = 4000;

function clothingRec(current_temp, precipitation_probability) {
    if (current_temp < 30) {
        return ['Winter Coat', 'Warm Layers']
        
    } else if (current_temp < 40) {
        if (precipitation_probability < 50) {
            return ['Heavy Jacket', 'Layers']
        }
        else if (precipitation_probability < 60) {
            return ['Heavy Jacket', 'Layers', 'Rain Jacket'];
        } else {   
            return ['Heavy Jacket', 'Layers', 'Umbrella']
        }

    } else if (current_temp < 55) {
        if (precipitation_probability < 50) {
            return ['Jacket/Hoodie', 'Pants']
        }
        else if (precipitation_probability < 60) {
            return ['Jacket/Hoodie', 'Pants', 'Rain Jacket']
        } else {   
            return ['Jacket/Hoodie', 'Pants', 'Umbrella']
        }

    } else if (current_temp < 70) {
        if (precipitation_probability < 50) {
            return ['Long Sleeves', 'Pants']
        }
        else if (precipitation_probability < 60) {
            return ['Long Sleeves', 'Pants', 'Rain Jacket']
        } else {   
            return ['Long Sleeves', 'Pants', 'Umbrella']
        }

    } else if (current_temp < 85) {
        if (precipitation_probability < 50) {
            return ['T-Shirt', 'Shorts/Light Pants']
        }
        else if (precipitation_probability < 60) {
            return ['T-Shirt', 'Shorts/Light Pants', 'Rain Jacket']
        } else {   
            return ['T-Shirt', 'Shorts/Light Pants', 'Umbrella']
        }
    
    } else {
        if (precipitation_probability < 50) {
            return ['T-Shirt', 'Shorts']
        }
        else if (precipitation_probability < 60) {
            return ['T-Shirt', 'Shorts', 'Rain Jacket']
        } else {   
            return ['T-Shirt', 'Shorts', 'Umbrella']
        }
    }
}



app.get('/clothing', (req, res) => {
    const current_temp = Number(req.query.temp);
    const precipitation_probability = Number(req.query.precipitation);

    const result = clothingRec(current_temp, precipitation_probability);

    console.log(result);
    res.json({
        recommendation: result
    });

});

app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    }
);