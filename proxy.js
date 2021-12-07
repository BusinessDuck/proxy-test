const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer')();
const FormData = require('form-data');
const request = require('request');
const fs = require('fs');
// const axios = require('axios');

app.use(bodyParser.json());

app.post('/photo', multer.array('image[]'), (req, res) => {
     // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
     res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
     res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));
 
     if (req.method === 'OPTIONS') {
         // CORS Preflight
         res.send();
         return;
     }

    const fileRecievedFromClient = req.files[0]; //File Object sent in 'fileFieldName' field in multipart/form-data
    const form = new FormData();
    form.append('image[]', fileRecievedFromClient.buffer, fileRecievedFromClient.originalname);
    const targetURL = 'https://9may.mail.ru'; // Target-URL ie. https://example.com or http://example.com
    const headers = {
        origin: 'https://9may.mail.ru',
        ...form.getHeaders(),
    };
    const options = {
        url: targetURL + req.url,
        method: req.method,
        headers,
    };

    const proxyReq = request(options, (error, response, body) => {
        if (error) {
            console.error('error: ' + error);
        }
    });

    form.pipe(proxyReq);

    proxyReq.pipe(res);

})

const server = app.listen(3000, function () {
    console.log('Server listening on port 3000');
});
