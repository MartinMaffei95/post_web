const mongoose = require('mongoose');
const { mongodb } = require('./config.js');

const connection = mongoose
  .connect(`mongodb://${mongodb.host}:${mongodb.port}/${mongodb.database}`)
  .then((db) => {
    console.log('Connected to MongoDB in: ' + 'mongodb://localhost:27017');
  })
  .catch((err) => {
    console.log('DB ERROR: ' + err);
  });

module.exports = connection;
