import express from 'express';
const app = express();
const PORT = 4000;

function clothingRec(current_temp, precipitation_probability) {
    let clothes;
    if (current_temp < 30) {
        return ['Winter Coat', 'Warm Layers'];

    } else if (current_temp < 40) {
        clothes = ['Heavy Jacket', 'Layers'];
    } else if (current_temp < 55) {
        clothes = ['Jacket/Hoodie', 'Pants'];
    } else if (current_temp < 70) {
        clothes = ['Long Sleeves', 'Pants'];
    } else if (current_temp < 85) {
        clothes = ['T-Shirt', 'Shorts/Light Pants'];
    } else {
        clothes = ['T-Shirt', 'Shorts'];
    }

    if (precipitation_probability > 60) {
        clothes.push('Umbrella');
    } else if (precipitation_probability > 50) {
        clothes.push('Rain Jacket');
    }

    return clothes;
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