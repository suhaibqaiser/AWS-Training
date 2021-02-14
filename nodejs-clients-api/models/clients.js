var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ClientsSchema = new Schema(
  {
    clientName: { type: String, required: true, maxlength: 100 },
    clientIp: { type: String, required: true, maxlength: 100 },
    clientHostname: { type: String, maxlength: 100 },
    clientDeviceId: { type: String, maxlength: 256 },
    clientConnected: { type: Date, required: true },
    clientLastSeen: { type: Date },
    clientIsAlive: { type: Boolean, required: true },
  }
);

ClientsSchema
  .virtual('id')
  .get(function () {
    return this.clientName + '-' + this.clientDeviceId;
  });

ClientsSchema
  .virtual('duration')
  .get(function () {
    return (this.clientLastSeen - this.clientConnected).toString();
  });

// Virtual for author's URL
ClientsSchema
  .virtual('url')
  .get(function () {
    return '/client/' + this._id;
  });

//Export model
module.exports = mongoose.model('Clients', ClientsSchema);

