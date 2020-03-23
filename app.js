const express = require('express');
const app = express();
const apiRouter = require('./routes/apiRouter');
const {handle500s} = require('./errors')
app.use(express.json());

app.use('/api', apiRouter);

app.use(handle500s);

module.exports = app;