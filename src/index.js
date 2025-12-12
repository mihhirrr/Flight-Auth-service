const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware')
const { limiter } = require('./utils/rate-limiter/rate-limit');
const { ServerConfig } = require('./config');
const { Routes } = require('./routes')

const app = express();

// Apply the rate limiting middleware to all requests.
app.use(limiter)            //Implementing the rate limiting here for now. Later will be implemented in nginx.

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', Routes );

// forwarding requests to respective microservice
app.use('/flightservice', createProxyMiddleware({ 
    target: ServerConfig.FLIGHT_SERVICE , 
    changeOrigin:true,  
    pathRewrite: { '^/flightservice': '' }
}) );

app.use('/bookingservice', createProxyMiddleware({ 
    target: ServerConfig.BOOKING_SERVICE , 
    changeOrigin:true, 
    pathRewrite: { '^/bookingservice': '' }
}) );


app.listen(ServerConfig.PORT, '0.0.0.0', () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
});