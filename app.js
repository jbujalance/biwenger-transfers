const mongoose = require('mongoose');
const TransferRecorder = require('./app/worker/transfer-recorder');
const CronJob = require('cron').CronJob;

// Open connection for Mongoose
console.log('Opening MongoDB connection...');
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });

// Instantiate a transfer recorder
var recorder = new TransferRecorder();

// Setup the recording cron job
var transferRecordingJob = new CronJob(process.env.TRANSFER_RECORDING_JOB_CRON_PATTERN, function() {
    console.log('Starting transfer recording job at ' + new Date() + '...');
    recorder.recordNewTransfers();
});

// Start the cron job
transferRecordingJob.start();
