'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    Actuator = mongoose.model('Actuator'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    fs = require('fs'),
    async = require('async'),
    httpError = require('http-errors'),
    validationService = require('../services/validation.server.service'),
    _ = require('lodash');

exports.create = function(req, res) {
    async.waterfall([
        validate,
        save,
    ], done);

    function validate(callback) {
        validationService.checkPinAvailability(req.body, callback);
    }

    function save(callback){
        new Actuator(req.body).save(callback);
    }

    function done(err, actuator) {
        if (err) {
            return res.status(err.status || 400).json({
                message: err.status ? err.message : errorHandler.getErrorMessage(err)
            });
        }

        res.json({
            id: actuator._id,
            microController: actuator.microController,
            title: actuator.title,
            type: actuator.type,
            pinNumber: actuator.pinNumber,
            manualControlOn: actuator.manualControlOn
        });
    }
};

exports.list = function(req, res) {
    Actuator.find().sort('-created').deepPopulate('microController.place').exec(function(err, actuators) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(actuators.map(function(actuator) {
                return {
                    id: actuator._id,
                    title: actuator.title,
                    placeTitle: actuator.place ? actuator.place.title : '',
                    type: actuator.type,
                    pinNumber: actuator.pinNumber,
                    isActive: actuator.isActive,
                    value: actuator.value,
                    microController: actuator.microController ? actuator.microController.title : '',
                    place: actuator.microController && actuator.microController.place ? actuator.microController.place.title : '',
                    manualControlOn: actuator.manualControlOn
                };
            }));
        }
    });
};


exports.read = function(req, res) {
    var id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Actuator id is invalid'
        });
    }

    Actuator.findById(id).exec(function(err, actuator) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else if (actuator) {
            res.json({
                id: actuator._id,
                title: actuator.title,
                microController: actuator.microController,
                type: actuator.type,
                pinNumber: actuator.pinNumber,
                isActive: actuator.isActive,
                manualControlOn: actuator.manualControlOn
            });
        } else {
            return res.status(400).send({
                message: 'Actuator id is invalid'
            });
        }
    });
};

exports.update = function(req, res) {
    var id = req.params.id;

    async.waterfall([
        validate,
        update,
    ], done);

    function validate(callback) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return callback(new httpError.BadRequest('Actuator id is invalid'));
        }
        req.body.id = id;
        validationService.checkPinAvailability(req.body, callback);
    }

    function update(callback){
        Actuator.findOneAndUpdate({_id: id}, req.body).exec(callback);
    }

    function done(err) {
        if (err) {
            return res.status(err.status || 400).json({
                message: err.status ? err.message : errorHandler.getErrorMessage(err)
            });
        }

        res.json();
    }
};

exports.delete = function(req, res) {
    var id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Actuator id is invalid'
        });
    }

    Actuator.findById(id).exec(function(err, actuator) {
        if (err) {
            console.log('error');
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else if (actuator) {
            actuator.remove(function(err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.json();
                }
            });
        } else {
            return res.status(400).send({
                message: 'Actuator id is invalid'
            });
        }
    });
};

exports.changeValue = function(req, res) {
    var id = req.params.id;
    console.log(id);
    var outcomExecutor = require('../services/outcomes-executor.server.service');
    Actuator.findOne({_id: id}).populate('microController').exec(function(err, actuator) {
        var outcomes = {};

        outcomes[actuator._id] = {
            actuator: actuator,
            value: req.body.value,
            manualControlRequest: true
        };

        outcomExecutor.executeOutcomes(outcomes);

        return res.json();
    });
};