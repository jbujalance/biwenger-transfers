const express = require('express');
const mongoose = require('mongoose');
const TransferAggregator = require('./app/db/transfer-aggregator');
const app = express();

// Server connection to database
console.log('Server connecting to database...');
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });

// The aggregator that will provide the users balances
var aggregator = new TransferAggregator();

// Serve balances in dedicated endpoint
app.get('/balances', (req, res) => {
    aggregator.getUsersBalance()
    .then(balances => {
        console.log('Serving request: ' + req.url);
        res.send(balances)
    })
    .catch(err => {
        console.log(err);
        res.send({
            status: 'error',
            message: error
        });
    });
});

console.log('Server listening')
app.listen(8080);
