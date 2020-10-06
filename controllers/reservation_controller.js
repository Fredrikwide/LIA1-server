// movie controller

//const models = require('../models');
const Reservation = require('../models/bookingmodel')


const AVAILABLE_TABLE = 15


/**
 * Look for available time 2020-09-30T18:00:00.000+00:00
 */


const availableTable = async (req, res) => {
    Reservation.find({
        "date": req.params.date,
    })
        .then(reservations => {
            //18.00
            const firstTime = []
            //21.00
            const lastTime = []

            // check if the reservation is 18.00 or 21.00
            reservations.filter(reservation => {
                if (reservation.time === "18.00") {
                    firstTime.push(reservation)

                } else {
                    lastTime.push(reservation)
                }
            })

            if (firstTime.length < AVAILABLE_TABLE || lastTime.length < AVAILABLE_TABLE) {
                res.send({
                    status: 'success',
                    data: {
                        "your req": req.params.date,
                        avilable_first: AVAILABLE_TABLE - firstTime.length,
                        avilable_last: AVAILABLE_TABLE - lastTime.length
                    }
                })
            } else {
                res.send({
                    status: 'fail',
                    data: {
                        message: 'no available table at this day',
                        available: false,
                        avilable_first: AVAILABLE_TABLE - firstTime.length,
                        avilable_last: AVAILABLE_TABLE - lastTime.length

                    }
                })
            }
        }).catch(err => {
            res.status(500).send({
                status: 'fail',
                message: 'Exception thrown when trying to find table at:' + req.params.date
            })
        })

}


/**
 *  Create a reservation
 * 
 *  POST /:reservation
 */
const store = async (req, res) => {
    const reservation = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone,
        date: Date.parse(req.body.date),
        people: req.body.seats,
        time: req.body.time
    }
    console.log('reservation done,', reservation)
    const newReservation = new Reservation({ ...reservation })

    newReservation.save()
        .then(async reservation => {
            await res.send({
                status: 'success',
                data: {
                    ...reservation
                }
            })
        })
        .catch(err => {
            res.status(500).send({
                status: 'fail',
                message: 'Exception thorown when trying to create a reservation', err
            })
        })
    console.log(newReservation)
}

module.exports = {
    availableTable,
    store,
}