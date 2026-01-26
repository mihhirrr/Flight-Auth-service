const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware')
const { limiter } = require('./utils/rate-limiter/rate-limit');
const { ServerConfig } = require('./config');
const { Routes } = require('./routes')
const { attachUserToHeaders } = require('./middlewares/auth-gateway-middleware');

const app = express();

// Apply the rate limiting middleware to all requests.
app.use(limiter)            //Implementing the rate limiting here for now. 

// Middleware to extract user info from JWT and add to request headers
app.use(attachUserToHeaders);

const createServiceProxy = (target, prefix) =>
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: { [`^/${prefix}`]: '' },
  });

app.use('/flightservice', createServiceProxy(ServerConfig.FLIGHT_SERVICE, 'flightservice'));
app.use('/bookingservice', createServiceProxy(ServerConfig.BOOKING_SERVICE, 'bookingservice'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', Routes );

app.listen(ServerConfig.PORT, '0.0.0.0', () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
});