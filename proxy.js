const express = require("express");
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer')();
const FormData = require('form-data');
const request = require('request');
const fs = require('fs');
// const axios = require('axios');

app.use(bodyParser.json());
//allow OPTIONS on all resources
app.options('*', cors())
app.post('/photo', multer.array('image[]'), (req, res) => {
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

    proxyReq.on('response', (res) => {
        res.headers = {
            ...res.headers,
            "access-control-allow-origin": "*",
            "access-control-allow-methods": "GET, PUT, PATCH, POST, DELETE",
        }
    }).pipe(res);

})

const server = app.listen(80, function () {
    console.log('Server listening on port 80');
});
