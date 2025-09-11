const { rateLimit } = require('express-rate-limit')

const limiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	limit: 100, // Limit each IP to 100 requests per window.
})


module.exports = {
	limiter
}