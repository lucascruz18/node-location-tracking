require('dotenv').config();

const express = require('express');
const Youch = require('youch');
const cors = require('cors');
require('express-async-errors');
const io = require('socket.io');
const http = require('http');
const socketServer = require('./utils/socket-server');

const routes = require('./routes');

require('./database');

class App {
  constructor() {
    this.app = express();
    this.server = http.Server(this.app);

    this.socket();

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  socket() {
    this.io = io(this.server);
    socketServer.handleServer(this.io);
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());

    // this.app.use((req, res, next) => {
    //   req.io = this.io;

    //   next();
    // });
  }

  routes() {
    this.app.use(routes);
  }

  exceptionHandler() {
    this.app.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}

module.exports = new App().server;
