const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('vai toma no cu!');
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});

module.exports = {
    express,
    app
};