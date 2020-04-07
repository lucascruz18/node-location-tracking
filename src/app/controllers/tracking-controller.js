const Devices = require('../schema/Devices');

class TrackingController {
  async index(req, res) {
    const devices = await Devices.find();

    return res.send(devices);
  }

  async update(req, res) {
    const { lat, lng } = req.body;

    const device = await Devices.findOneAndUpdate(
      { socket_id: req.params.id },
      {
        lat,
        lng,
      }
    );

    const devices = await Devices.find();

    req.io.broadcast.emit('server', {
      socket_id: devices.socket_id,
      lat: devices.lat,
      lng: devices.lng,
    });

    return res.send(device);
  }
}

module.exports = new TrackingController();
