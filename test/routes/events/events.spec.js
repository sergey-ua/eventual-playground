const sinon = require('sinon');
require('sinon-mongoose');
const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../../../app');
const Event = require('@models/event')

describe('Events GET', function () {
    it('return empty array if there are no events', function (done) {
        sinon.mock(Event)
            .expects('find')
            .chain('exec')
            .resolves([]);

        supertest(app)
            .get('/events')
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body.length).to.equal(0);
                done();
        });
    });
});

describe("Adding new event", function() {
    it('Should generate timeframe for each day between startDate and endDate', function(done) {
        sinon.stub(Event, 'create').callsFake((obj) => {
            obj.save = function() {};
            sinon.mock(obj)
                .expects('save')
                .resolves(obj);
            expect(obj.timeframes.length).to.equal(3);
            return obj;
        });

        supertest(app)
            .post('/events')
            .send({
                "startDate":"2018-01-01",
                "endDate":"2018-01-03"
            })
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body.success).to.equal(true);
                done();
            })
    })
});
