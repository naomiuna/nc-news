const express = require('express');
const app = express();
const apiRouter = require('./routes/apiRouter');
const {handleBadPaths, handleCustomErrors, handle500s} = require('./errors')
app.use(express.json());

app.use('/api', apiRouter);

app.all('/*', handleBadPaths);

app.use(handleCustomErrors);
app.use(handle500s);

module.exports = app;