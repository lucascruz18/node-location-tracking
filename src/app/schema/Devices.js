const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema(
  {
    socket_id: {
      type: String,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Devices', DeviceSchema);
