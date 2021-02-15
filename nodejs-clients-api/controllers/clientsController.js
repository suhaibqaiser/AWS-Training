var Client = require('../models/clients');
var async = require('async');

// Display list of all Clients.
exports.client_list = function (req, res, next) {
    Client.find({}, function (err, docs) {
        if (err) console.log('Error:' + err)

        res.status(200).send({ title: 'Client List', client: docs });
    })//.select({ "clientIp": 1, "_id": 0 })
};

// Display detail page for a specific Client.
exports.client_detail = function (req, res, next) {

    async.parallel({
        client: function (callback) {
            //console.log(req.params.id);
            Client.findById(req.params.id)
                .exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.client == null) { // No results.
            return res.status(404).send('Client not found');
        }
        // Successful, so render.
        res.status(200).send({ title: 'Client Detail', client: results.client });
    });

};


// Display Client create form on POST.
exports.client_register = function (req, res, next) {
    var client = new Client(
        {
            clientName: req.body.clientName,
            clientIp: req.body.clientIp,
            clientHostname: req.body.clientHostname,
            clientDeviceId: req.body.clientDeviceId,
            clientConnected: Date(),
            clientLastSeen: Date(),
            clientIsAlive: req.body.clientIsAlive
        });
    client.save(function (err) {
        if (err) { return next(err); }
        //console.log(client.id);
        res.status(200).send({ title: 'Client Registered', client: client });
    });

};

exports.client_remove = function (req, res, next) {
    async.parallel({
        client: function (callback) {
            //console.log(req.body.clientId);
            Client.findOneAndDelete({ _id: req.body.clientId })
                .exec(callback)
        }
    }, function (err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.client == null) { // No results.
            return res.status(404).send('Client not found');
        }
        // Successful, so render.
        res.status(200).send({ title: 'Client Removed', client: results.client });
    });
}

exports.client_update = function (req, res) {

    async.parallel({
        client: function (callback) {
            //console.log(req.body.clientId);
            Client.findByIdAndUpdate(req.body.clientId, {
                clientName: req.body.clientName,
                clientIp: req.body.clientIp,
                clientHostname: req.body.clientHostname,
                clientDeviceId: req.body.clientDeviceId,
                clientLastSeen: Date(),
                clientIsAlive: req.body.clientIsAlive
            }, { new: true })
                .exec(callback)
        }
    }, function (err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.client == null) { // No results.
            return res.status(404).send('Client not found');
        }
        // Successful, so render.
        res.status(200).send({ title: 'Client Updated', client: results.client });
    });
}

exports.client_report_alive = function (req, res) {

    async.parallel({
        client: function (callback) {
            //console.log(req.body.clientId);
            Client.findByIdAndUpdate(req.body.clientId, { clientIsAlive: true, clientLastSeen: Date() }, { new: true })
                .exec(callback)
        }
    }, function (err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.client == null) { // No results.
            return res.status(404).send('Client not found');
        }
        // Successful, so render.
        res.status(200).send({ title: 'Client Alive', client: results.client });
    });
}

exports.client_count = function (req, res) {
    if (req.query.type === 'active') {
        async.parallel({
            client: function (callback) {
                Client.countDocuments({ clientIsAlive: true })
                    .exec(callback)
            }
        }, function (err, results) {
            if (err) { return next(err); } // Error in API usage.
            if (results.client == null) { // No results.
                return res.status(404).send('Client not found');
            }
            // Successful, so render.
            res.status(200).send({ title: 'Client count', client: { active: results.client } });
        });
    } else if (req.query.type === 'inactive') {
        async.parallel({
            client: function (callback) {
                Client.countDocuments({ clientIsAlive: false })
                    .exec(callback)
            }
        }, function (err, results) {
            if (err) { return next(err); } // Error in API usage.
            if (results.client == null) { // No results.
                return res.status(404).send('Client not found');
            }
            // Successful, so render.
            res.status(200).send({ title: 'Client count', client: { inactive: results.client } });
        });
    } else {
        async.parallel({
            client: function (callback) {
                Client.countDocuments({})
                    .exec(callback)
            }
        }, function (err, results) {
            if (err) { return next(err); } // Error in API usage.
            if (results.client == null) { // No results.
                return res.status(404).send('Client not found');
            }
            // Successful, so render.
            res.status(200).send({ title: 'Client count', client: { total: results.client } });
        });
    }
}