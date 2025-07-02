const cron = require('node-cron')

// const { Enums } = require('../utils/common-utils')
// const { BOOKED, FAILED, CANCELLED } = Enums.BookingStatus;


function cancelUnprocessedBookings(){
      cron.schedule('*/5 * * * * *', async() => {
            try {
                 const { BookingService } = require('../../services')
                 const response = await BookingService.expireUnprocessedBookings()
                 
                 console.log(response)
            } catch (error) {
                  console.log(error)
            }
          });
}

module.exports = cancelUnprocessedBookings;