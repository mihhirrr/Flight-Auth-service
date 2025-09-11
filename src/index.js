const express = require('express');
const { limiter } = require('./utils/rate-limiter/rate-limit');
const { ServerConfig } = require('./config');
const { UserRoutes } = require('./routes')

const app = express();

// Apply the rate limiting middleware to all requests.
app.use(limiter)            //Implementing the rate limiting here for now. Later will be implemented in nginx.

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', UserRoutes);

app.listen(ServerConfig.PORT, () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
});