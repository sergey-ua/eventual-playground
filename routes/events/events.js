var express = require('express');
var router = express.Router();
var Event = require('@models/event');
const moment = require('moment');
var createNamespace = require('continuation-local-storage').createNamespace;
var getNamespace = require('continuation-local-storage').getNamespace;
var session = createNamespace('s');
var clsBluebird = require('cls-bluebird');
clsBluebird(session);


/* GET users listing. */
router.get('/', function(req, res, next) {
    session.run(function () {
        session.set('user', req.query.user);
        Event.find({}).exec()
            .then((res) => {
                session.runAndReturn(function(outer){
                    console.info(`magic happens right here for user ${req.query.user }(${getNamespace('s').get('user')})`);
                    return res;
                });

            })
            .then((results) => res.send(results));
    });

});

router.get('/naive', function (req, res, next) {
   session.run(function () {
      session.set('a', req.query.a);
      process.nextTick(function() {
          console.info(`magic happens right here for variable a =  ${req.query.a}(${getNamespace('s').get('a')})`);
      });
   });
   res.send('ok');
});

router.get('/today', function(req, res, next) {
    let today = new Date();
    let aprToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    Event.find({
            startDate: {$lt: aprToday},
            endDate: {$gt: aprToday}
            }).exec()
        .then((results) => res.send(results));
});

router.post('/', function (req, res, next) {
    let event = req.body;
    let days = moment(event.endDate).diff(event.startDate, "days") + 1;
    let startDateMoment = moment(event.startDate);
    event.timeframes = [...Array(days).keys()]
        .map((day) => Object.assign({}, {date: startDateMoment.add(day, "day").toDate()}));
    Event.create(event).save().then(()=>res.send({success: true}));
});

module.exports = router;