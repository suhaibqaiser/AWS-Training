var express = require('express');
var router = express.Router();
var client_controller = require('../controllers/clientsController');

// PUT request for registering Client.
router.put('/client/register', client_controller.client_register);

// DELETE request to delete Client.
router.delete('/client/remove', client_controller.client_remove);

// POST request to update Client.
router.post('/client/update', client_controller.client_update);

// POST request to report alive Client.
router.post('/client/alive', client_controller.client_report_alive);

// GET request for all Clients list.
router.get('/client/list', client_controller.client_list);

// GET request for all Clients count.
router.get('/client/count', client_controller.client_count);

// GET request for one Client.
router.get('/client/:id', client_controller.client_detail);

module.exports = router;