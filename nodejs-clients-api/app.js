const express = require('express')
var bodyParser = require('body-parser');
const clientsRouter = require('./routes/clients.js')
const app = express()
const port = 3000

//Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = 'mongodb+srv://mongoUser:1t3jWnpoC0imAM4d@cluster0.tipo5.mongodb.net/clients?retryWrites=true&w=majority';

mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/', clientsRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})