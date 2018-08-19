const mongoose = require('mongoose');
const TransferRecorder = require('../worker/transfer-recorder');

console.log('Openning MongoDB connection...');
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });

new TransferRecorder().recordNewTransfers(function() {
    // Close Mongo connection when the documenst have been saved in order to end the job
    console.log('Closing MongoDB conneccltion...');
    mongoose.connection.close();
    console.log('MongoDB connection closed.');
});
