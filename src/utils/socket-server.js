/* eslint-disable no-console */
const Devices = require('../app/schema/Devices');

class SocketServer {
  handleServer(io) {
    io.on('connection', async socket => {
      const { device } = socket.handshake.query;
      console.log(`Dispositivo conectado: ${device} | ID: ${socket.id}`);

      if (device === 'mobile') {
        try {
          socket.on('mobile', async data => {
            if (await Devices.findOne({ socket_id: socket.id })) {
              try {
                await Devices.findOneAndUpdate(
                  { socket_id: socket.id },
                  {
                    socket_id: socket.id,
                    lat: data.latitude,
                    lng: data.longitude,
                  }
                );

                const devices = await Devices.find();

                const coordinates = devices.map(e => {
                  return {
                    socket_id: e.socket_id,
                    lat: e.lat,
                    lng: e.lng,
                  };
                });

                socket.broadcast.emit('server', coordinates);
              } catch (error) {
                console.error('ON DEVICE UPDATE ERROR', error);
              }
            } else {
              try {
                await Devices.create({
                  socket_id: socket.id,
                  lat: data.latitude,
                  lng: data.longitude,
                });

                const devices = await Devices.find();

                socket.broadcast.emit('server', {
                  socket_id: devices.socket_id,
                  lat: devices.lat,
                  lng: devices.lng,
                });
              } catch (error) {
                console.log('ON DEVICE CREATE ERROR', error);
              }
            }
          });
        } catch (error) {
          console.error('DEU RUIM', error);
        }
        socket.on('disconnect', async () => {
          await Devices.findOneAndRemove({ socket_id: socket.id });
        });
      }
    });
  }
}

module.exports = new SocketServer();
