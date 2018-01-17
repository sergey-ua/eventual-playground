const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const Timeframe = new Schema({
    date: Date
})

const EventSchema = new Schema({
    name: String,
    startDate: Date,
    endDate: Date,
    timeframes: [Timeframe]
});




module.exports = mongoose.model('Event', EventSchema);