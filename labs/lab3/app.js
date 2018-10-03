const express = require('express');
const path = require('path');

const app = express();

// will open public directory files for http requests
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));
//app.get(function(req, res){
//    console.log('Non-static request');
//    res.sendStatus(404);
//});
app.listen(3001, function() { console.log('Server is ready\n' + publicPath); });