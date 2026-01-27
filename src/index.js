const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware')
const { limiter } = require('./utils/rate-limiter/rate-limit');
const { ServerConfig } = require('./config');
const { Routes } = require('./routes')
const { isAuthenticated } = require('./middlewares/user-middleware');

const app = express();

// Apply the rate limiting middleware to all requests.
app.use(limiter)            //Implementing the rate limiting here for now. 


const createServiceProxy = (target, prefix) =>
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: { [`^/${prefix}`]: '' },
  });

app.use('/flightservice', isAuthenticated, createServiceProxy(ServerConfig.FLIGHT_SERVICE, 'flightservice'));
app.use('/bookingservice', isAuthenticated, createServiceProxy(ServerConfig.BOOKING_SERVICE, 'bookingservice'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', Routes );

app.listen(ServerConfig.PORT, '0.0.0.0', () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
});