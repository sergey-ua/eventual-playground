const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const VoteSchema = new Schema({
    availability: [String],
    user: String
});