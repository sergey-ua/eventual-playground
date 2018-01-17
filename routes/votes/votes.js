const express = require('express');
const router = express.Router();
const Vote = require('@models/vote');
const Event = require('@models/vote');

router.post("/{event_id}", function (req, res, next) {
    const availability = req.body.availability;
    let eventId = req.params.event_id;
    Vote.create(req.body).save().then(res.send);
});